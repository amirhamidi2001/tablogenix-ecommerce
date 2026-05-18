# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — base: shared OS packages and Python deps
# ─────────────────────────────────────────────────────────────────────────────
FROM python:3.11-slim AS base

# Prevent .pyc files and enable real-time log output
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install Python dependencies once; Docker will cache this layer
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install -r requirements.txt

# Copy the full project
COPY . .

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — development: hot-reload via Django dev server (HTTP only)
# Used by docker-compose `target: development`
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS development

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

# ─────────────────────────────────────────────────────────────────────────────
# Stage 3 — production: Daphne ASGI server (HTTP + WebSocket)
# ─────────────────────────────────────────────────────────────────────────────
FROM base AS production

# Collect static assets
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Daphne serves both HTTP and WebSocket over the same port via ASGI
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]
