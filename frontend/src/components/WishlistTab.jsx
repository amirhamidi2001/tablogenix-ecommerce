// src/components/WishlistTab.jsx
const WishlistTab = () => {
  const wishlistItems = [
    { id: 1, name: 'Lorem ipsum dolor sit amet', price: '$79.99', oldPrice: '$99.99', rating: 4.5, image: '/assets/img/product/product-1.webp', sale: true },
    { id: 2, name: 'Consectetur adipiscing elit', price: '$149.99', oldPrice: null, rating: 4.0, image: '/assets/img/product/product-2.webp', sale: false },
    { id: 3, name: 'Sed do eiusmod tempor', price: '$199.99', oldPrice: null, rating: 5.0, image: '/assets/img/product/product-3.webp', sale: false, outOfStock: true },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Wishlist</h2>
        <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">Add All to Cart</button>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map(item => (
          <div key={item.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
            <div className="relative">
              <img src={item.image} alt={item.name} className="w-full h-56 object-cover" />
              <button className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-red-50">
                <i className="bi bi-trash text-red-500"></i>
              </button>
              {item.sale && <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">-20%</span>}
              {item.outOfStock && <span className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-medium">Out of Stock</span>}
            </div>
            <div className="p-4">
              <h4 className="font-semibold line-clamp-2">{item.name}</h4>
              <div className="flex items-center gap-1 text-yellow-400 text-sm mt-1">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`bi ${i < Math.floor(item.rating) ? 'bi-star-fill' : i < item.rating ? 'bi-star-half' : 'bi-star'}`}></i>
                ))}
                <span className="text-gray-400 text-xs ml-1">({item.rating})</span>
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold">{item.price}</span>
                {item.oldPrice && <span className="text-sm text-gray-400 line-through ml-2">{item.oldPrice}</span>}
              </div>
              <button className="w-full mt-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition" disabled={item.outOfStock}>
                {item.outOfStock ? 'Notify When Available' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WishlistTab;