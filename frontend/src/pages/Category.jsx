// src/pages/Category.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

// ========== داده‌های ساختگی ==========
const categoriesData = [
  {
    id: 1,
    name: 'Clothing',
    subcategories: ['Men\'s Wear', 'Women\'s Wear', 'Kids\' Clothing', 'Accessories'],
  },
  {
    id: 2,
    name: 'Electronics',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Accessories'],
  },
  {
    id: 3,
    name: 'Home & Kitchen',
    subcategories: ['Furniture', 'Kitchen Appliances', 'Home Decor', 'Bedding'],
  },
  {
    id: 4,
    name: 'Beauty & Personal Care',
    subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Fragrances'],
  },
  {
    id: 5,
    name: 'Sports & Outdoors',
    subcategories: ['Fitness Equipment', 'Outdoor Gear', 'Sports Apparel', 'Team Sports'],
  },
  { id: 6, name: 'Books', subcategories: [] },
  {
    id: 7,
    name: 'Toys & Games',
    subcategories: ['Board Games', 'Puzzles', 'Action Figures', 'Educational Toys'],
  },
];

const brandsData = [
  { name: 'Nike', count: 24 },
  { name: 'Adidas', count: 18 },
  { name: 'Puma', count: 12 },
  { name: 'Reebok', count: 9 },
  { name: 'Under Armour', count: 7 },
  { name: 'New Balance', count: 6 },
  { name: 'Converse', count: 5 },
  { name: 'Vans', count: 4 },
];

const colorsData = [
  { name: 'Black', code: '#000000' },
  { name: 'White', code: '#ffffff' },
  { name: 'Red', code: '#e74c3c' },
  { name: 'Blue', code: '#3498db' },
  { name: 'teal', code: '#2ecc71' },
  { name: 'Yellow', code: '#f1c40f' },
  { name: 'teal', code: '#9b59b6' },
  { name: 'Orange', code: '#e67e22' },
  { name: 'Pink', code: '#fd79a8' },
  { name: 'Brown', code: '#795548' },
];

const productsData = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  category: ['Women\'s Fashion', 'Men\'s Collection', 'Accessories', 'Footwear'][i % 4],
  price: Math.floor(Math.random() * 200) + 30,
  originalPrice: Math.random() > 0.7 ? Math.floor(Math.random() * 250) + 50 : null,
  rating: (Math.random() * 1.5 + 3.5).toFixed(1),
  reviews: Math.floor(Math.random() * 100) + 5,
  imageMain: `/assets/img/product/product-${(i % 12) + 1}.webp`,
  imageHover: `/assets/img/product/product-${((i + 4) % 12) + 1}.webp`,
  isNew: i % 6 === 0,
  isSale: i % 5 === 2,
}));

// ========== کامپوننت Product Card ==========
const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img
          src={isHovered && product.imageHover ? product.imageHover : product.imageMain}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay & Actions on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button className="bg-white p-2 rounded-full hover:bg-teal-600 hover:text-white transition">
            <i className="bi bi-eye"></i>
          </button>
          <button className="bg-white p-2 rounded-full hover:bg-teal-600 hover:text-white transition">
            <i className="bi bi-cart-plus"></i>
          </button>
        </div>
        {/* Badges */}
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-semibold px-2 py-1 rounded">
            New
          </span>
        )}
        {product.isSale && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Sale
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</div>
        <h4 className="font-semibold text-lg mt-1 line-clamp-1">
          <Link to={`/product/${product.id}`} className="hover:text-teal-600">
            {product.name}
          </Link>
        </h4>
        <div className="flex justify-between items-center mt-2">
          <div>
            {product.originalPrice ? (
              <>
                <span className="text-lg font-bold text-teal-700">${product.price}</span>
                <span className="text-sm text-gray-400 line-through ml-2">${product.originalPrice}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-800">${product.price}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm">
            <i className="bi bi-star-fill text-yellow-400"></i>
            <span>{product.rating}</span>
            <span className="text-gray-400">({product.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ========== کامپوننت Category Tree ==========
const CategoryTree = ({ selectedCategory, onSelectCategory }) => {
  const [openCategories, setOpenCategories] = useState({});

  const toggleCategory = (id) => {
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="widget-item mb-6">
      <h3 className="text-lg font-semibold border-l-4 border-teal-600 pl-3 mb-4">Categories</h3>
      <ul className="space-y-2">
        {categoriesData.map((cat) => (
          <li key={cat.id} className="category-item">
            <div className="flex justify-between items-center">
              <button
                onClick={() => onSelectCategory(cat.name)}
                className={`text-gray-700 hover:text-teal-600 ${selectedCategory === cat.name ? 'text-teal-600 font-medium' : ''}`}
              >
                {cat.name}
              </button>
              {cat.subcategories.length > 0 && (
                <button onClick={() => toggleCategory(cat.id)} className="text-gray-400 hover:text-teal-600">
                  <i className={`bi bi-chevron-${openCategories[cat.id] ? 'up' : 'down'}`}></i>
                </button>
              )}
            </div>
            {openCategories[cat.id] && cat.subcategories.length > 0 && (
              <ul className="pl-4 mt-2 space-y-1">
                {cat.subcategories.map((sub, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => onSelectCategory(sub)}
                      className="text-sm text-gray-500 hover:text-teal-600"
                    >
                      {sub}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ========== کامپوننت Price Range Slider ==========
const PriceRangeSlider = ({ minPrice, maxPrice, onPriceChange }) => {
  const [minVal, setMinVal] = useState(minPrice);
  const [maxVal, setMaxVal] = useState(maxPrice);
  const globalMin = 0;
  const globalMax = 1000;

  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), maxVal - 10);
    setMinVal(val);
    onPriceChange({ min: val, max: maxVal });
  };
  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), minVal + 10);
    setMaxVal(val);
    onPriceChange({ min: minVal, max: val });
  };

  return (
    <div className="widget-item mb-6">
      <h3 className="text-lg font-semibold border-l-4 border-teal-600 pl-3 mb-4">Price Range</h3>
      <div className="mb-3 flex justify-between">
        <span>${minVal}</span>
        <span>${maxVal}</span>
      </div>
      <div className="relative h-1 bg-gray-200 rounded">
        <div
          className="absolute h-1 bg-teal-600 rounded"
          style={{ left: `${(minVal / globalMax) * 100}%`, right: `${100 - (maxVal / globalMax) * 100}%` }}
        ></div>
        <input
          type="range"
          min={globalMin}
          max={globalMax}
          step={10}
          value={minVal}
          onChange={handleMinChange}
          className="absolute w-full top-0 left-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 [&::-webkit-slider-thumb]:cursor-pointer"
        />
        <input
          type="range"
          min={globalMin}
          max={globalMax}
          step={10}
          value={maxVal}
          onChange={handleMaxChange}
          className="absolute w-full top-0 left-0 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-teal-600 [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
      <div className="flex gap-2 mt-3">
        <input type="number" value={minVal} onChange={handleMinChange} className="w-1/2 border rounded px-2 py-1 text-sm" />
        <input type="number" value={maxVal} onChange={handleMaxChange} className="w-1/2 border rounded px-2 py-1 text-sm" />
      </div>
    </div>
  );
};

// ========== کامپوننت Color Filter ==========
const ColorFilter = ({ selectedColors, onColorToggle }) => {
  return (
    <div className="widget-item mb-6">
      <h3 className="text-lg font-semibold border-l-4 border-teal-600 pl-3 mb-4">Filter by Color</h3>
      <div className="flex flex-wrap gap-2">
        {colorsData.map((color) => (
          <label key={color.name} className="relative cursor-pointer">
            <input
              type="checkbox"
              value={color.name}
              checked={selectedColors.includes(color.name)}
              onChange={() => onColorToggle(color.name)}
              className="sr-only peer"
            />
            <span
              className="block w-8 h-8 rounded-full border-2 border-gray-300 peer-checked:border-teal-600 peer-checked:ring-2 peer-checked:ring-teal-300 transition"
              style={{ backgroundColor: color.code, boxShadow: color.code === '#ffffff' ? 'inset 0 0 0 1px #ccc' : 'none' }}
              title={color.name}
            ></span>
          </label>
        ))}
      </div>
    </div>
  );
};

// ========== کامپوننت Brand Filter ==========
const BrandFilter = ({ selectedBrands, onBrandToggle, onClearBrands }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const filteredBrands = brandsData.filter((b) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="widget-item mb-6">
      <h3 className="text-lg font-semibold border-l-4 border-teal-600 pl-3 mb-4">Filter by Brand</h3>
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search brands..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-teal-500"
        />
        <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
      </div>
      <div className="max-h-56 overflow-y-auto space-y-2">
        {filteredBrands.map((brand) => (
          <label key={brand.name} className="flex justify-between items-center cursor-pointer">
            <span className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand.name)}
                onChange={() => onBrandToggle(brand.name)}
                className="rounded text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm">{brand.name}</span>
            </span>
            <span className="text-xs text-gray-400">({brand.count})</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between mt-3">
        <button
          onClick={() => onClearBrands()}
          className="text-sm text-teal-600 hover:underline"
        >
          Clear All
        </button>
      </div>
    </div>
  );
};

// ========== صفحه اصلی Category ==========
const Category = () => {
  // State for filters
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Helper to toggle colors
  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };
  const toggleBrand = (brand) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };
  const clearAllFilters = () => {
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 1000 });
    setSelectedColors([]);
    setSelectedBrands([]);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Filter products based on all criteria
  const filteredProducts = productsData.filter((product) => {
    // Category filter
    if (selectedCategory && product.category !== selectedCategory) return false;
    // Price filter
    if (product.price < priceRange.min || product.price > priceRange.max) return false;
    // Color filter (simulate - in real app product has color property)
    if (selectedColors.length > 0) {
      // Mock: if product id even and color includes 'Black' etc. For demo, just pass if any color selected
      // We'll assume product has a random color for demo
      const productColor = ['Black', 'White', 'Red', 'Blue', 'teal'][product.id % 5];
      if (!selectedColors.includes(productColor)) return false;
    }
    // Brand filter (similar mock)
    if (selectedBrands.length > 0) {
      const productBrand = brandsData[product.id % brandsData.length].name;
      if (!selectedBrands.includes(productBrand)) return false;
    }
    // Search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts];
  if (sortBy === 'price_low') sortedProducts.sort((a, b) => a.price - b.price);
  if (sortBy === 'price_high') sortedProducts.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') sortedProducts.sort((a, b) => b.rating - a.rating);
  // Default 'featured' no sort

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Active filters display
  const activeFilters = [];
  if (selectedCategory) activeFilters.push({ type: 'Category', value: selectedCategory });
  if (priceRange.min > 0 || priceRange.max < 1000) activeFilters.push({ type: 'Price', value: `$${priceRange.min} - $${priceRange.max}` });
  selectedColors.forEach((c) => activeFilters.push({ type: 'Color', value: c }));
  selectedBrands.forEach((b) => activeFilters.push({ type: 'Brand', value: b }));
  if (searchQuery) activeFilters.push({ type: 'Search', value: searchQuery });

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Category</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Category</li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Left */}
          <aside className="lg:w-1/4">
            <CategoryTree selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
            <PriceRangeSlider minPrice={priceRange.min} maxPrice={priceRange.max} onPriceChange={setPriceRange} />
            <ColorFilter selectedColors={selectedColors} onColorToggle={toggleColor} />
            <BrandFilter selectedBrands={selectedBrands} onBrandToggle={toggleBrand} onClearBrands={() => setSelectedBrands([])} />
          </aside>

          {/* Main Content - Right */}
          <main className="lg:w-3/4">
            {/* Filters Bar */}
            <div className="bg-gray-50 p-4 rounded-xl mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Search Products</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                      className="w-full border rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-teal-500"
                    />
                    <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price Range</label>
                  <select
                    value={`${priceRange.min}-${priceRange.max}`}
                    onChange={(e) => {
                      const [min, max] = e.target.value.split('-').map(Number);
                      setPriceRange({ min, max });
                      setCurrentPage(1);
                    }}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="0-1000">All Prices</option>
                    <option value="0-25">Under $25</option>
                    <option value="25-50">$25 to $50</option>
                    <option value="50-100">$50 to $100</option>
                    <option value="100-200">$100 to $200</option>
                    <option value="200-1000">$200 & Above</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Customer Rating</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Items Per Page</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  >
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>48 per page</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    <i className="bi bi-grid-3x3-gap-fill"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                  >
                    <i className="bi bi-list-ul"></i>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Showing {paginatedProducts.length} of {sortedProducts.length} products
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium">Active Filters:</span>
                {activeFilters.map((filter, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">
                    {filter.type}: {filter.value}
                    <button
                      onClick={() => {
                        if (filter.type === 'Category') setSelectedCategory('');
                        if (filter.type === 'Price') setPriceRange({ min: 0, max: 1000 });
                        if (filter.type === 'Color') toggleColor(filter.value);
                        if (filter.type === 'Brand') toggleBrand(filter.value);
                        if (filter.type === 'Search') setSearchQuery('');
                      }}
                      className="ml-1 hover:text-teal-900"
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </span>
                ))}
                <button onClick={clearAllFilters} className="text-xs text-red-500 hover:underline ml-auto">Clear All</button>
              </div>
            )}

            {/* Products Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="flex gap-4 bg-white rounded-xl shadow-sm p-4">
                    <img src={product.imageMain} alt={product.name} className="w-32 h-32 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="text-xs text-gray-500">{product.category}</div>
                      <h4 className="font-semibold text-lg">{product.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex text-yellow-400">
                          <i className="bi bi-star-fill"></i>
                          <span className="ml-1 text-gray-700">{product.rating}</span>
                        </div>
                        <span className="text-gray-400">({product.reviews} reviews)</span>
                      </div>
                      <div className="mt-2">
                        {product.originalPrice ? (
                          <>
                            <span className="text-xl font-bold text-teal-700">${product.price}</span>
                            <span className="text-gray-400 line-through ml-2">${product.originalPrice}</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold">${product.price}</span>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="bg-teal-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-teal-700">Add to Cart</button>
                        <button className="border border-gray-300 px-4 py-1 rounded-lg text-sm hover:bg-gray-50">Quick View</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100"
                  >
                    <i className="bi bi-chevron-left"></i> Prev
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-1 border rounded-md ${currentPage === pageNum ? 'bg-teal-600 text-white border-teal-600' : 'hover:bg-gray-100'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  {totalPages > 5 && currentPage < totalPages - 2 && <span className="px-2">...</span>}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100"
                  >
                    Next <i className="bi bi-chevron-right"></i>
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
};

export default Category;