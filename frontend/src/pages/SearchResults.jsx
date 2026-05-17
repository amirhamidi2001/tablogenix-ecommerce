import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { autocompleteProducts, searchProducts } from '../services/api';

// ─── Constants ───────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];
const PAGE_SIZE = 12;
const AUTOCOMPLETE_DEBOUNCE = 250;  // ms
const SEARCH_DEBOUNCE = 400;        // ms

// ─── Helper: read search params ───────────────────────────────────────────────
const readParams = (sp) => ({
  q: sp.get('q') || '',
  category: sp.get('category') || '',
  brand: sp.get('brand') || '',
  min_price: sp.get('min_price') || '',
  max_price: sp.get('max_price') || '',
  is_new: sp.get('is_new') || '',
  is_sale: sp.get('is_sale') || '',
  in_stock: sp.get('in_stock') || '',
  sort: sp.get('sort') || 'relevance',
  page: parseInt(sp.get('page') || '1', 10),
});

// ─── Skeleton card ────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
    <div className="bg-gray-200 h-64 w-full" />
    <div className="p-4 space-y-2">
      <div className="bg-gray-200 h-3 w-1/3 rounded" />
      <div className="bg-gray-200 h-5 w-3/4 rounded" />
      <div className="bg-gray-200 h-4 w-1/4 rounded" />
    </div>
  </div>
);

// ─── Product card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const thumb = product.thumbnail
    ? product.thumbnail.startsWith('http')
      ? product.thumbnail
      : `http://localhost:8000${product.thumbnail}`
    : null;

  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-100">
        {thumb ? (
          <img
            src={thumb}
            alt={product.name}
            className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center text-gray-300">
            <i className="bi bi-image text-5xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${product.slug}`}
            className="bg-white p-2 rounded-full hover:bg-teal-600 hover:text-white transition"
            title="View product"
          >
            <i className="bi bi-eye" />
          </Link>
        </div>
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-semibold px-2 py-1 rounded">
            New
          </span>
        )}
        {product.is_sale && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider truncate">
          {product.category?.name || product.category_name || ''}
        </div>
        <h4 className="font-semibold text-lg mt-1 line-clamp-1">
          <Link to={`/product/${product.slug}`} className="hover:text-teal-600">
            {product.name}
          </Link>
        </h4>
        <div className="flex justify-between items-center mt-2">
          <div>
            {product.original_price ? (
              <>
                <span className="text-lg font-bold text-teal-700">
                  ${Number(product.price).toFixed(2)}
                </span>
                <span className="text-sm text-gray-400 line-through ml-2">
                  ${Number(product.original_price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">
                ${Number(product.price).toFixed(2)}
              </span>
            )}
          </div>
          {product.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <i className="bi bi-star-fill text-yellow-400" />
              <span>{Number(product.rating).toFixed(1)}</span>
              <span className="text-gray-400">({product.reviews_count})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Pagination ───────────────────────────────────────────────────────────────
const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const range = [];
  const delta = 2;
  const left = Math.max(1, page - delta);
  const right = Math.min(pages, page + delta);

  for (let i = left; i <= right; i++) range.push(i);

  return (
    <nav className="flex items-center gap-1 flex-wrap justify-center">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 border rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
      >
        <i className="bi bi-arrow-left" /> <span className="hidden sm:inline">Prev</span>
      </button>

      {left > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="px-3 py-1 border rounded-md hover:bg-gray-100">1</button>
          {left > 2 && <span className="px-2 text-gray-400">…</span>}
        </>
      )}

      {range.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          className={`px-3 py-1 rounded-md border transition ${n === page
              ? 'bg-teal-600 text-white border-teal-600'
              : 'hover:bg-gray-100'
            }`}
        >
          {n}
        </button>
      ))}

      {right < pages && (
        <>
          {right < pages - 1 && <span className="px-2 text-gray-400">…</span>}
          <button onClick={() => onPageChange(pages)} className="px-3 py-1 border rounded-md hover:bg-gray-100">{pages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === pages}
        className="px-3 py-1 border rounded-md disabled:opacity-40 hover:bg-gray-100 transition"
      >
        <span className="hidden sm:inline">Next</span> <i className="bi bi-arrow-right" />
      </button>
    </nav>
  );
};

// ─── Autocomplete dropdown ────────────────────────────────────────────────────
const AutocompleteDropdown = ({ suggestions, activeIndex, onSelect, query }) => {
  if (!suggestions.length) return null;

  const highlight = (text, q) => {
    if (!q) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className="bg-yellow-100 text-inherit">{text.slice(idx, idx + q.length)}</mark>
        {text.slice(idx + q.length)}
      </>
    );
  };

  return (
    <ul className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-80 overflow-y-auto">
      {suggestions.map((s, i) => {
        const thumb = s.thumbnail
          ? s.thumbnail.startsWith('http')
            ? s.thumbnail
            : `http://localhost:8000${s.thumbnail}`
          : null;
        return (
          <li
            key={s.id}
            onMouseDown={() => onSelect(s)}
            className={`flex items-center gap-3 px-4 py-2 cursor-pointer transition ${i === activeIndex ? 'bg-teal-50' : 'hover:bg-gray-50'
              }`}
          >
            <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
              {thumb ? (
                <img src={thumb} alt={s.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <i className="bi bi-image text-lg" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-800 truncate">
                {highlight(s.name, query)}
              </div>
              {s.category && (
                <div className="text-xs text-gray-500 truncate">{s.category}</div>
              )}
            </div>
            {s.price != null && (
              <div className="text-sm font-semibold text-teal-700 flex-shrink-0">
                ${Number(s.price).toFixed(2)}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

// ─── Sidebar filter section ───────────────────────────────────────────────────
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        className="flex items-center justify-between w-full text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-gray-800 text-sm">{title}</span>
        <i className={`bi bi-chevron-${open ? 'up' : 'down'} text-gray-400 text-xs`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

// ═════════════════════════════════════════════════════════════════════════════
// Main component
// ═════════════════════════════════════════════════════════════════════════════
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // ── Parse URL state ────────────────────────────────────────────────────────
  const urlState = readParams(searchParams);

  // ── Local form state (input box value only — everything else from URL) ─────
  const [inputValue, setInputValue] = useState(urlState.q);
  const [priceMin, setPriceMin] = useState(urlState.min_price);
  const [priceMax, setPriceMax] = useState(urlState.max_price);

  // ── Search results ─────────────────────────────────────────────────────────
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ── Autocomplete ───────────────────────────────────────────────────────────
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loadingAC, setLoadingAC] = useState(false);
  const searchBoxRef = useRef(null);

  // ── Debounce refs ──────────────────────────────────────────────────────────
  const searchTimer = useRef(null);
  const acTimer = useRef(null);

  // ─── Fetch results whenever URL params change ──────────────────────────────
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = {
          q: urlState.q,
          category: urlState.category,
          brand: urlState.brand,
          sort: urlState.sort,
          page: urlState.page,
          page_size: PAGE_SIZE,
        };
        if (urlState.min_price) params.min_price = urlState.min_price;
        if (urlState.max_price) params.max_price = urlState.max_price;
        if (urlState.is_new) params.is_new = urlState.is_new;
        if (urlState.is_sale) params.is_sale = urlState.is_sale;
        if (urlState.in_stock) params.in_stock = urlState.in_stock;

        const res = await searchProducts(params);
        setData(res.data);
      } catch (err) {
        setError('Search is temporarily unavailable. Please try again.');
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [searchParams.toString()]);

  // ── Sync input value when URL q changes externally ─────────────────────────
  useEffect(() => {
    setInputValue(urlState.q);
    setPriceMin(urlState.min_price);
    setPriceMax(urlState.max_price);
  }, [urlState.q]);

  // ── Autocomplete fetch ─────────────────────────────────────────────────────
  useEffect(() => {
    clearTimeout(acTimer.current);
    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoadingAC(true);
    acTimer.current = setTimeout(async () => {
      try {
        const res = await autocompleteProducts(inputValue);
        setSuggestions(res.data.suggestions || []);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingAC(false);
      }
    }, AUTOCOMPLETE_DEBOUNCE);
    return () => clearTimeout(acTimer.current);
  }, [inputValue]);

  // ── Close autocomplete on outside click ───────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── URL update helpers ────────────────────────────────────────────────────
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(next);
  };

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) {
        next.set(k, v);
      } else {
        next.delete(k);
      }
    });
    next.set('page', '1');
    setSearchParams(next);
  };

  // ─── Search submit ─────────────────────────────────────────────────────────
  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    setShowSuggestions(false);
    updateParam('q', inputValue.trim());
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || !suggestions.length) {
      if (e.key === 'Enter') handleSearchSubmit();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSuggestionSelect(suggestions[activeIndex]);
      } else {
        handleSearchSubmit();
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setShowSuggestions(false);
    navigate(`/product/${suggestion.slug}`);
  };

  // ─── Filter handlers ───────────────────────────────────────────────────────
  const handleCategoryClick = (slug) => {
    updateParam('category', urlState.category === slug ? '' : slug);
  };

  const handleBrandClick = (slug) => {
    updateParam('brand', urlState.brand === slug ? '' : slug);
  };

  const handlePriceApply = () => {
    updateParams({ min_price: priceMin, max_price: priceMax });
  };

  const handleToggle = (key) => {
    updateParam(key, searchParams.get(key) === '1' ? '' : '1');
  };

  const handleSort = (e) => {
    updateParam('sort', e.target.value);
  };

  const handlePageChange = (p) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', String(p));
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchParams({ q: urlState.q });
    setPriceMin('');
    setPriceMax('');
  };

  // ─── Derived values ────────────────────────────────────────────────────────
  const aggs = data?.aggregations || {};
  const results = data?.results || [];
  const hasActiveFilters =
    urlState.category ||
    urlState.brand ||
    urlState.min_price ||
    urlState.max_price ||
    urlState.is_new ||
    urlState.is_sale ||
    urlState.in_stock;

  // ═══════════════════════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      {/* ── Page title ───────────────────────────────────────────────────── */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Search Results</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Search Results</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* ── Search bar ───────────────────────────────────────────────────── */}
      <section className="py-6 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Count + query label */}
            <div>
              {loading ? (
                <div className="h-5 bg-gray-200 rounded w-48 animate-pulse" />
              ) : (
                <p className="text-gray-600 text-sm">
                  {data?.count != null ? (
                    <>
                      <span className="font-semibold text-teal-600">{data.count.toLocaleString()}</span>
                      {' results'}
                      {urlState.q && (
                        <> for <span className="font-medium text-gray-800">"{urlState.q}"</span></>
                      )}
                      {data.fallback && (
                        <span className="ml-2 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                          basic search
                        </span>
                      )}
                    </>
                  ) : null}
                </p>
              )}
            </div>

            {/* Search input with autocomplete */}
            <form onSubmit={handleSearchSubmit} className="w-full lg:w-auto">
              <div ref={searchBoxRef} className="relative flex gap-2 w-full lg:w-96">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => inputValue.length >= 2 && setShowSuggestions(true)}
                    placeholder="Search products…"
                    className="w-full border border-gray-300 rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:border-teal-500 text-sm"
                    autoComplete="off"
                  />
                  {loadingAC && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  {showSuggestions && suggestions.length > 0 && (
                    <AutocompleteDropdown
                      suggestions={suggestions}
                      activeIndex={activeIndex}
                      onSelect={handleSuggestionSelect}
                      query={inputValue}
                    />
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition flex-shrink-0"
                >
                  <i className="bi bi-search" />
                </button>
              </div>
            </form>
          </div>

          {/* Sort + clear filters bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              {hasActiveFilters && (
                <>
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {urlState.category && (
                    <FilterPill
                      label={`Category: ${aggs.categories?.find(c => c.slug === urlState.category)?.name || urlState.category}`}
                      onRemove={() => updateParam('category', '')}
                    />
                  )}
                  {urlState.brand && (
                    <FilterPill
                      label={`Brand: ${aggs.brands?.find(b => b.slug === urlState.brand)?.name || urlState.brand}`}
                      onRemove={() => updateParam('brand', '')}
                    />
                  )}
                  {(urlState.min_price || urlState.max_price) && (
                    <FilterPill
                      label={`Price: $${urlState.min_price || '0'} – $${urlState.max_price || '∞'}`}
                      onRemove={() => updateParams({ min_price: '', max_price: '' })}
                    />
                  )}
                  {urlState.is_new === '1' && (
                    <FilterPill label="New arrivals" onRemove={() => updateParam('is_new', '')} />
                  )}
                  {urlState.is_sale === '1' && (
                    <FilterPill label="On sale" onRemove={() => updateParam('is_sale', '')} />
                  )}
                  {urlState.in_stock === '1' && (
                    <FilterPill label="In stock" onRemove={() => updateParam('in_stock', '')} />
                  )}
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Clear all
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={urlState.sort}
                onChange={handleSort}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-teal-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main content: sidebar + grid ─────────────────────────────────── */}
      <section className="py-10 bg-gray-50 min-h-[60vh]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Sidebar ────────────────────────────────────────────────── */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-2">Filters</h3>

                {/* Categories */}
                {aggs.categories?.length > 0 && (
                  <FilterSection title="Category">
                    <ul className="space-y-1.5">
                      {aggs.categories.map((c) => (
                        <li key={c.slug}>
                          <button
                            onClick={() => handleCategoryClick(c.slug)}
                            className={`flex items-center justify-between w-full text-sm px-2 py-1 rounded transition ${urlState.category === c.slug
                                ? 'bg-teal-50 text-teal-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            <span className="truncate">{c.name}</span>
                            <span className="text-xs text-gray-400 ml-1 flex-shrink-0">({c.count})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </FilterSection>
                )}

                {/* Brands */}
                {aggs.brands?.length > 0 && (
                  <FilterSection title="Brand">
                    <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {aggs.brands.map((b) => (
                        <li key={b.slug}>
                          <button
                            onClick={() => handleBrandClick(b.slug)}
                            className={`flex items-center justify-between w-full text-sm px-2 py-1 rounded transition ${urlState.brand === b.slug
                                ? 'bg-teal-50 text-teal-700 font-semibold'
                                : 'text-gray-600 hover:bg-gray-50'
                              }`}
                          >
                            <span className="truncate">{b.name}</span>
                            <span className="text-xs text-gray-400 ml-1 flex-shrink-0">({b.count})</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </FilterSection>
                )}

                {/* Price range */}
                {aggs.price_stats?.max > 0 && (
                  <FilterSection title="Price Range">
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Min</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={priceMin}
                            onChange={(e) => setPriceMin(e.target.value)}
                            placeholder="$0"
                            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs text-gray-500">Max</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={priceMax}
                            onChange={(e) => setPriceMax(e.target.value)}
                            placeholder="Any"
                            className="w-full border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-teal-500"
                          />
                        </div>
                      </div>
                      <button
                        onClick={handlePriceApply}
                        className="w-full bg-teal-600 text-white text-sm py-1.5 rounded hover:bg-teal-700 transition"
                      >
                        Apply
                      </button>
                      {aggs.price_stats && (
                        <p className="text-xs text-gray-400 text-center">
                          Range: ${Math.floor(aggs.price_stats.min)} – ${Math.ceil(aggs.price_stats.max)}
                        </p>
                      )}
                    </div>
                  </FilterSection>
                )}

                {/* Tags */}
                <FilterSection title="Tags">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={urlState.is_new === '1'}
                        onChange={() => handleToggle('is_new')}
                        className="w-4 h-4 accent-teal-600"
                      />
                      <span className="text-sm text-gray-700">New Arrivals</span>
                      {aggs.new_count > 0 && (
                        <span className="text-xs text-gray-400">({aggs.new_count})</span>
                      )}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={urlState.is_sale === '1'}
                        onChange={() => handleToggle('is_sale')}
                        className="w-4 h-4 accent-teal-600"
                      />
                      <span className="text-sm text-gray-700">On Sale</span>
                      {aggs.sale_count > 0 && (
                        <span className="text-xs text-gray-400">({aggs.sale_count})</span>
                      )}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={urlState.in_stock === '1'}
                        onChange={() => handleToggle('in_stock')}
                        className="w-4 h-4 accent-teal-600"
                      />
                      <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>
                  </div>
                </FilterSection>
              </div>
            </aside>

            {/* ── Product grid ───────────────────────────────────────────── */}
            <div className="flex-1">
              {/* Error state */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 text-center">
                  <i className="bi bi-exclamation-triangle text-3xl mb-2 block" />
                  <p>{error}</p>
                  <button
                    onClick={() => setSearchParams(new URLSearchParams(searchParams))}
                    className="mt-3 text-sm underline hover:no-underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Loading skeleton */}
              {loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* Results */}
              {!loading && !error && data && (
                <>
                  {results.length === 0 ? (
                    <div className="text-center py-20">
                      <i className="bi bi-search text-6xl text-gray-300" />
                      <h3 className="text-xl font-semibold text-gray-700 mt-4">No results found</h3>
                      <p className="text-gray-500 mt-2 max-w-sm mx-auto">
                        Try adjusting your search term or removing some filters.
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearAllFilters}
                          className="mt-4 text-teal-600 hover:text-teal-800 text-sm underline"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {results.map((product) => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>

                      <div className="mt-10">
                        <Pagination
                          page={data.page}
                          pages={data.pages}
                          onPageChange={handlePageChange}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// ─── Mini-component: filter pill ──────────────────────────────────────────────
const FilterPill = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 border border-teal-200 text-xs px-2 py-1 rounded-full">
    {label}
    <button onClick={onRemove} className="hover:text-red-500 ml-0.5">
      <i className="bi bi-x-circle" />
    </button>
  </span>
);

export default SearchResults;
