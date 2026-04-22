// src/pages/SearchResults.jsx
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || 'Lorem ipsum';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [sortBy, setSortBy] = useState('relevance');

  // Mock products data (same as category page)
  const allProducts = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: ['Tempor Incididunt', 'Elit Consectetur', 'Adipiscing Magna', 'Labore Dolore', 'Magna Aliqua', 'Eiusmod Tempor', 'Incididunt Labore', 'Aliqua Magna'][i % 8],
    category: ['Women\'s Fashion', 'Men\'s Collection', 'Accessories', 'Footwear', 'Men\'s Fashion', 'Women\'s Fashion', 'Accessories', 'Men\'s Fashion'][i % 8],
    price: [129, 95, 75, 145, 89, 110, 55, 79][i % 8],
    originalPrice: i % 5 === 2 ? [99, 129, 99, null, null, 129, null, null][i % 8] : null,
    rating: [4.8, 4.6, 4.9, 4.7, 4.5, 4.8, 4.6, 4.7][i % 8],
    reviews: [42, 28, 56, 35, 23, 47, 31, 39][i % 8],
    imageMain: `/assets/img/product/product-${(i % 12) + 1}.webp`,
    imageHover: `/assets/img/product/product-${((i + 4) % 12) + 1}.webp`,
    isNew: i % 6 === 0,
    isSale: i % 5 === 2,
  }));

  // Filter products based on search query
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts];
  if (sortBy === 'price-asc') sortedProducts.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') sortedProducts.sort((a, b) => b.price - a.price);
  if (sortBy === 'rating') sortedProducts.sort((a, b) => b.rating - a.rating);
  if (sortBy === 'name-asc') sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  if (sortBy === 'name-desc') sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  // 'relevance' is default (no sort)

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: searchQuery });
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Clear filter (demo)
  const clearFilter = (filter) => {
    alert(`Clear filter: ${filter}`);
  };

  // Product Card Component
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
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button className="bg-white p-2 rounded-full hover:bg-teal-600 hover:text-white transition">
              <i className="bi bi-eye"></i>
            </button>
            <button className="bg-white p-2 rounded-full hover:bg-teal-600 hover:text-white transition">
              <i className="bi bi-cart-plus"></i>
            </button>
          </div>
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-semibold px-2 py-1 rounded">New</span>
          )}
          {product.isSale && (
            <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">Sale</span>
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

  return (
    <>
      {/* Page Title */}
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

      {/* Search Results Header */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Search Results</h2>
              <p className="text-gray-500 text-sm">
                We found <span className="font-semibold text-teal-600">{filteredProducts.length}</span> results for{' '}
                <span className="font-medium">"{searchQuery}"</span>
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-1 lg:w-80 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-500"
              />
              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          {/* Filters and Sort */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Filters:</span>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  Category: Blog <button onClick={() => clearFilter('Category')} className="ml-1 hover:text-red-500"><i className="bi bi-x-circle"></i></button>
                </span>
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                  Date: Last Month <button onClick={() => clearFilter('Date')} className="ml-1 hover:text-red-500"><i className="bi bi-x-circle"></i></button>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-teal-500"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="name-asc">Name A-Z</option>
                <option value="name-desc">Name Z-A</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <i className="bi bi-search text-6xl text-gray-300"></i>
              <h3 className="text-xl font-semibold text-gray-700 mt-4">No results found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-12">
              <nav className="flex items-center gap-1">
                <button className="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100" disabled>
                  <i className="bi bi-arrow-left"></i> <span className="hidden sm:inline">Previous</span>
                </button>
                <button className="px-3 py-1 bg-teal-600 text-white rounded-md">1</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">2</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">3</button>
                <span className="px-2">...</span>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">8</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">9</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">10</button>
                <button className="px-3 py-1 border rounded-md hover:bg-gray-100">
                  <span className="hidden sm:inline">Next</span> <i className="bi bi-arrow-right"></i>
                </button>
              </nav>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchResults;