import time

from django.core.management.base import BaseCommand, CommandError
from django.db import connection

from shop.documents import ProductDocument
from shop.models import Product


class Command(BaseCommand):
    help = "Rebuild the Elasticsearch product index."

    def add_arguments(self, parser):
        parser.add_argument(
            "--create-only",
            action="store_true",
            help="Only (re)create the index mapping; do not populate it.",
        )
        parser.add_argument(
            "--populate-only",
            action="store_true",
            help="Only populate an existing index; do not recreate it.",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would happen without executing anything.",
        )
        parser.add_argument(
            "--batch-size",
            type=int,
            default=500,
            metavar="N",
            help="Number of documents sent per bulk-index request (default: 500).",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        create_only = options["create_only"]
        populate_only = options["populate_only"]
        batch_size = options["batch_size"]

        if create_only and populate_only:
            raise CommandError(
                "--create-only and --populate-only are mutually exclusive."
            )

        index = ProductDocument._index
        index_name = ProductDocument.Index.name
        total = Product.objects.count()

        self.stdout.write(
            self.style.MIGRATE_HEADING(
                f"\n{'[DRY RUN] ' if dry_run else ''}Elasticsearch Product Reindex"
            )
        )
        self.stdout.write(f"  Index    : {index_name}")
        self.stdout.write(f"  Products : {total:,}")
        self.stdout.write(f"  Batch    : {batch_size}")
        self.stdout.write("")

        if dry_run:
            self.stdout.write(self.style.WARNING("Dry run — nothing was changed."))
            return

        start = time.perf_counter()

        # ── 1. Delete existing index ──────────────────────────────────────────
        if not populate_only:
            self.stdout.write("  Deleting existing index … ", ending="")
            try:
                index.delete(ignore_unavailable=True)
                self.stdout.write(self.style.SUCCESS("done"))
            except Exception as exc:
                self.stdout.write(self.style.ERROR(f"failed ({exc})"))
                raise CommandError(f"Could not delete index: {exc}") from exc

            # ── 2. Create index with mappings ─────────────────────────────────
            self.stdout.write("  Creating index with mappings … ", ending="")
            try:
                index.create()
                self.stdout.write(self.style.SUCCESS("done"))
            except Exception as exc:
                self.stdout.write(self.style.ERROR(f"failed ({exc})"))
                raise CommandError(f"Could not create index: {exc}") from exc

        if create_only:
            elapsed = time.perf_counter() - start
            self.stdout.write(
                self.style.SUCCESS(
                    f"\n✓ Index created in {elapsed:.1f}s (not populated)."
                )
            )
            return

        # ── 3. Populate ───────────────────────────────────────────────────────
        self.stdout.write(f"  Indexing {total:,} products … ", ending="")
        self.stdout.flush()

        try:
            # django-elasticsearch-dsl's parallel=True uses multiple threads
            ProductDocument().update(
                ProductDocument.django.model.objects.all(),
                parallel=True,
                chunk_size=batch_size,
            )
            self.stdout.write(self.style.SUCCESS("done"))
        except Exception as exc:
            self.stdout.write(self.style.ERROR(f"failed ({exc})"))
            raise CommandError(f"Could not populate index: {exc}") from exc

        elapsed = time.perf_counter() - start
        rate = int(total / elapsed) if elapsed > 0 else 0

        # ── 4. Verify ─────────────────────────────────────────────────────────
        try:
            indexed = ProductDocument.search().count()
        except Exception:
            indexed = "?"

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS(
                f"✓ Reindex complete in {elapsed:.1f}s "
                f"({rate:,} docs/s) — {indexed} documents in ES."
            )
        )

        if isinstance(indexed, int) and indexed != total:
            self.stdout.write(
                self.style.WARNING(
                    f"  ⚠  Count mismatch: DB has {total} rows but ES has {indexed} docs. "
                    f"Check for indexing errors above."
                )
            )
