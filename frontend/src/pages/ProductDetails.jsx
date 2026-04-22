// src/pages/ProductDetails.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductDetails = () => {
  // Mock product data
  const product = {
    id: 1,
    name: 'Mauris tempus cursus magna vel scelerisque nisl consectetur',
    category: 'Audio Equipment',
    rating: 4.6,
    reviewCount: 127,
    price: 189.99,
    originalPrice: 239.99,
    description:
      'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
    availability: 'In Stock',
    stockLeft: 18,
    images: [
      '/assets/img/product/product-details-6.webp',
      '/assets/img/product/product-details-7.webp',
      '/assets/img/product/product-details-8.webp',
      '/assets/img/product/product-details-4.webp',
      '/assets/img/product/product-details-5.webp',
      '/assets/img/product/product-details-3.webp',
    ],
    colors: [
      { name: 'Midnight Black', code: 'linear-gradient(135deg, #1a1a1a, #000)' },
      { name: 'Pearl White', code: 'linear-gradient(135deg, #f8f9fa, #e9ecef)' },
      { name: 'Ocean Blue', code: 'linear-gradient(135deg, #0066cc, #004499)' },
      { name: 'Forest teal', code: 'linear-gradient(135deg, #28a745, #155724)' },
    ],
  };

  // Mock reviews
  const reviews = [
    {
      id: 1,
      name: 'Sarah Martinez',
      avatar: '/assets/img/person/person-f-3.webp',
      rating: 5,
      date: 'March 28, 2024',
      headline: 'Outstanding audio quality and comfort',
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam. Eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
      helpful: 12,
    },
    {
      id: 2,
      name: 'David Chen',
      avatar: '/assets/img/person/person-f-5.webp',
      rating: 4,
      date: 'March 15, 2024',
      headline: 'Great value, minor connectivity issues',
      text: 'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Overall satisfied with the purchase.',
      helpful: 8,
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      avatar: '/assets/img/person/person-f-7.webp',
      rating: 5,
      date: 'February 22, 2024',
      headline: 'Perfect for work-from-home setup',
      text: 'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.',
      helpful: 15,
    },
  ];

  // Rating distribution (percentages)
  const ratingDistribution = [
    { stars: 5, count: 86, width: 68 },
    { stars: 4, count: 28, width: 22 },
    { stars: 3, count: 8, width: 6 },
    { stars: 2, count: 4, width: 3 },
    { stars: 1, count: 1, width: 1 },
  ];

  // State for gallery
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // State for quantity and color
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  // State for active tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, technical, reviews

  // Handlers
  const handleThumbnailClick = (img, idx) => {
    setSelectedImage(img);
    setCurrentIndex(idx);
  };

  const handlePrevImage = () => {
    const newIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(product.images[newIndex]);
  };

  const handleNextImage = () => {
    const newIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(product.images[newIndex]);
  };

  const increaseQuantity = () => {
    if (quantity < product.stockLeft) setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    alert(`Added ${quantity} item(s) to cart`);
  };

  const handleBuyNow = () => {
    alert('Proceed to checkout');
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <i key={i} className={`bi ${i < fullStars ? 'bi-star-fill' : i === fullStars && hasHalfStar ? 'bi-star-half' : 'bi-star'}`}></i>
        ))}
      </div>
    );
  };

  // Calculate savings
  const savings = product.originalPrice - product.price;
  const discountPercent = Math.round((savings / product.originalPrice) * 100);

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Product Details</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Product Details</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Product Details Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Gallery */}
            <div className="lg:w-7/12">
              {/* Main Image */}
              <div className="relative bg-gray-100 rounded-2xl overflow-hidden mb-4">
                <img src={selectedImage} alt="Product" className="w-full h-auto object-contain" />
                {/* Navigation Buttons */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white shadow-md transition"
                >
                  <i className="bi bi-chevron-left text-xl"></i>
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white shadow-md transition"
                >
                  <i className="bi bi-chevron-right text-xl"></i>
                </button>
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-6 gap-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleThumbnailClick(img, idx)}
                    className={`border-2 rounded-lg overflow-hidden transition ${selectedImage === img ? 'border-teal-600' : 'border-transparent'}`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-20 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right - Product Info */}
            <div className="lg:w-5/12">
              {/* Category & Rating */}
              <div className="flex justify-between items-start mb-3">
                <span className="bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {product.category}
                </span>
                <div className="flex items-center gap-2">
                  {renderStars(product.rating)}
                  <span className="text-gray-500 text-sm">({product.reviewCount} reviews)</span>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-teal-700">${product.price.toFixed(2)}</span>
                  <span className="text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-teal-600 text-sm">Save ${savings.toFixed(2)}</span>
                  <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">({discountPercent}% off)</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-5">{product.description}</p>

              {/* Availability */}
              <div className="flex justify-between items-center bg-teal-50 p-3 rounded-lg mb-5">
                <div className="flex items-center gap-2">
                  <i className="bi bi-check-circle-fill text-teal-600"></i>
                  <span className="font-medium text-teal-800">{product.availability}</span>
                </div>
                <div className="text-sm text-gray-600">Only {product.stockLeft} items remaining</div>
              </div>

              {/* Color Selection */}
              <div className="mb-5">
                <label className="block font-medium text-gray-700 mb-2">Available Colors:</label>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-full border-2 transition ${selectedColor.name === color.name ? 'border-teal-600 ring-2 ring-teal-300' : 'border-gray-300'}`}
                      style={{ background: color.code }}
                      title={color.name}
                    >
                      {selectedColor.name === color.name && <i className="bi bi-check text-white text-sm flex justify-center items-center h-full"></i>}
                    </button>
                  ))}
                </div>
                <div className="text-sm text-gray-500 mt-2">Selected: <span className="font-medium">{selectedColor.name}</span></div>
              </div>

              {/* Quantity & Actions */}
              <div className="mb-6">
                <label className="block font-medium text-gray-700 mb-2">Quantity:</label>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button onClick={decreaseQuantity} className="px-3 py-2 hover:bg-gray-100 transition">
                      <i className="bi bi-dash"></i>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stockLeft, Math.max(1, parseInt(e.target.value) || 1)))}
                      className="w-16 text-center border-x border-gray-300 py-2 outline-none"
                      min="1"
                      max={product.stockLeft}
                    />
                    <button onClick={increaseQuantity} className="px-3 py-2 hover:bg-gray-100 transition">
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={handleAddToCart} className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2">
                    <i className="bi bi-bag-plus"></i> Add to Cart
                  </button>
                  <button onClick={handleBuyNow} className="flex-1 border border-teal-600 text-teal-600 py-3 rounded-lg font-semibold hover:bg-teal-50 transition flex items-center justify-center gap-2">
                    <i className="bi bi-lightning"></i> Buy Now
                  </button>
                  <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition" title="Add to Wishlist">
                    <i className="bi bi-heart"></i>
                  </button>
                </div>
              </div>

              {/* Benefits List */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2"><i className="bi bi-truck text-teal-600"></i><span className="text-sm">Free delivery on orders over $75</span></div>
                <div className="flex items-center gap-2"><i className="bi bi-arrow-clockwise text-teal-600"></i><span className="text-sm">45-day hassle-free returns</span></div>
                <div className="flex items-center gap-2"><i className="bi bi-shield-check text-teal-600"></i><span className="text-sm">3-year manufacturer warranty</span></div>
                <div className="flex items-center gap-2"><i className="bi bi-headset text-teal-600"></i><span className="text-sm">24/7 customer support available</span></div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-12">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 font-semibold transition ${activeTab === 'overview' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('technical')}
                className={`px-6 py-3 font-semibold transition ${activeTab === 'technical' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Technical Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 font-semibold transition ${activeTab === 'reviews' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Reviews ({product.reviewCount})
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-xl">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h3 className="text-xl font-bold mb-3">Product Overview</h3>
                    <p className="text-gray-600 mb-6">
                      Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                    </p>
                    <h4 className="text-lg font-semibold mb-4">Key Highlights</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <i className="bi bi-volume-up text-2xl text-teal-600 mb-2 block"></i>
                        <h5 className="font-semibold">Superior Audio</h5>
                        <p className="text-sm text-gray-500">Ut enim ad minima veniam quis nostrum exercitationem</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <i className="bi bi-battery-charging text-2xl text-teal-600 mb-2 block"></i>
                        <h5 className="font-semibold">Long Battery</h5>
                        <p className="text-sm text-gray-500">Excepteur sint occaecat cupidatat non proident</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <i className="bi bi-wifi text-2xl text-teal-600 mb-2 block"></i>
                        <h5 className="font-semibold">Wireless Tech</h5>
                        <p className="text-sm text-gray-500">Duis aute irure dolor in reprehenderit</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl text-center">
                        <i className="bi bi-person-check text-2xl text-teal-600 mb-2 block"></i>
                        <h5 className="font-semibold">Comfort Fit</h5>
                        <p className="text-sm text-gray-500">Lorem ipsum dolor sit amet consectetur</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl">
                    <h4 className="text-lg font-semibold mb-4">Package Contents</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2"><i className="bi bi-check-circle text-teal-600"></i> Premium Audio Device</li>
                      <li className="flex items-center gap-2"><i className="bi bi-check-circle text-teal-600"></i> Premium Carrying Case</li>
                      <li className="flex items-center gap-2"><i className="bi bi-check-circle text-teal-600"></i> USB-C Fast Charging Cable</li>
                      <li className="flex items-center gap-2"><i className="bi bi-check-circle text-teal-600"></i> 3.5mm Audio Connector</li>
                      <li className="flex items-center gap-2"><i className="bi bi-check-circle text-teal-600"></i> Quick Start Guide</li>
                      <li className="flex items-center gap-2"><i className="bi bi-check-circle text-teal-600"></i> Warranty Documentation</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Technical Details Tab */}
              {activeTab === 'technical' && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Audio Specifications</h4>
                    <div className="bg-gray-50 rounded-xl divide-y">
                      <div className="flex justify-between p-3"><span className="text-gray-600">Frequency Range</span><span className="font-medium">15Hz - 25kHz</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Driver Diameter</span><span className="font-medium">50mm Dynamic</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Sensitivity</span><span className="font-medium">98dB SPL</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Impedance</span><span className="font-medium">24 Ohm</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">THD</span><span className="font-medium">&lt; 0.5%</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Connectivity & Power</h4>
                    <div className="bg-gray-50 rounded-xl divide-y">
                      <div className="flex justify-between p-3"><span className="text-gray-600">Wireless Protocol</span><span className="font-medium">Bluetooth 5.3</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Range</span><span className="font-medium">Up to 30ft (10m)</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Battery Capacity</span><span className="font-medium">800mAh Li-ion</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Usage Time</span><span className="font-medium">35+ hours</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Charge Time</span><span className="font-medium">2.5 hours</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Physical Dimensions</h4>
                    <div className="bg-gray-50 rounded-xl divide-y">
                      <div className="flex justify-between p-3"><span className="text-gray-600">Weight</span><span className="font-medium">285g</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Dimensions</span><span className="font-medium">190 x 165 x 82mm</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Ear Cup Material</span><span className="font-medium">Memory Foam</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Headband</span><span className="font-medium">Adjustable Steel</span></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Advanced Features</h4>
                    <div className="bg-gray-50 rounded-xl divide-y">
                      <div className="flex justify-between p-3"><span className="text-gray-600">Noise Cancellation</span><span className="font-medium">Hybrid ANC</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Voice Assistant</span><span className="font-medium">Siri & Google</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Microphone Type</span><span className="font-medium">Dual Array</span></div>
                      <div className="flex justify-between p-3"><span className="text-gray-600">Water Rating</span><span className="font-medium">IPX5</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div>
                  {/* Rating Overview */}
                  <div className="flex flex-col md:flex-row gap-8 mb-10 p-6 bg-gray-50 rounded-xl">
                    <div className="text-center md:w-1/3">
                      <div className="text-5xl font-bold text-gray-800">{product.rating}</div>
                      <div className="flex justify-center my-2">{renderStars(product.rating)}</div>
                      <div className="text-gray-500 text-sm">{product.reviewCount} customer reviews</div>
                    </div>
                    <div className="flex-1 space-y-2">
                      {ratingDistribution.map((item) => (
                        <div key={item.stars} className="flex items-center gap-3">
                          <span className="text-sm w-8">{item.stars}★</span>
                          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${item.width}%` }}></div>
                          </div>
                          <span className="text-sm text-gray-500 w-8">{item.count}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-center md:w-1/3">
                      <h4 className="font-semibold">Share Your Experience</h4>
                      <p className="text-sm text-gray-500 mb-3">Help others make informed decisions</p>
                      <button className="bg-teal-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-700">Write Review</button>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex gap-4 mb-3">
                          <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <div className="font-semibold">{review.name}</div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {renderStars(review.rating)}
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <h5 className="font-semibold text-lg mb-2">{review.headline}</h5>
                        <p className="text-gray-600 mb-3">{review.text}</p>
                        <div className="flex gap-4">
                          <button className="text-sm text-gray-500 hover:text-teal-600 flex items-center gap-1"><i className="bi bi-hand-thumbs-up"></i> Helpful ({review.helpful})</button>
                          <button className="text-sm text-gray-500 hover:text-teal-600 flex items-center gap-1"><i className="bi bi-chat-dots"></i> Reply</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center mt-6">
                    <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">Show More Reviews</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetails;