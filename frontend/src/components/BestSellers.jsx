// src/components/BestSellers.jsx
const ProductCard = ({ product }) => {
  return (
    <div className="group bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span className={`absolute top-4 left-4 text-xs font-semibold px-2 py-1 rounded ${product.badgeColor}`}>
            {product.badge}
          </span>
        )}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
            <i className="bi bi-heart"></i>
          </button>
          <button className="bg-white p-2 rounded-full shadow hover:bg-gray-100">
            <i className="bi bi-arrow-left-right"></i>
          </button>
        </div>
        <button className="absolute bottom-4 left-4 right-4 bg-white text-gray-800 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition transform translate-y-2 group-hover:translate-y-0">
          Select Options
        </button>
      </div>
      <div className="p-4">
        <div className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</div>
        <h4 className="font-semibold text-lg mt-1 line-clamp-2">{product.name}</h4>
        <div className="flex items-center gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <i key={i} className={`bi ${i < product.rating ? 'bi-star-fill' : 'bi-star'} text-yellow-400 text-sm`}></i>
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>
        <div className="mt-2 text-lg font-bold text-gray-900">{product.price}</div>
        {product.oldPrice && (
          <div className="text-sm text-gray-400 line-through">{product.oldPrice}</div>
        )}
        <div className="flex gap-2 mt-3">
          {product.colors.map((color, idx) => (
            <span
              key={idx}
              className="w-5 h-5 rounded-full border border-gray-300 cursor-pointer"
              style={{ backgroundColor: color }}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

const BestSellers = () => {
  const products = [
    {
      id: 1,
      name: "Mauris blandit aliquet elit",
      category: "Premium Collection",
      image: "/assets/img/product/product-1.webp",
      rating: 4,
      reviews: 24,
      price: "$189.00",
      colors: ["#2563eb", "#059669", "#dc2626"],
      badge: "Limited",
      badgeColor: "bg-gray-800 text-white",
    },
    {
      id: 2,
      name: "Sed do eiusmod tempor incididunt",
      category: "Best Sellers",
      image: "/assets/img/product/product-4.webp",
      rating: 4.5,
      reviews: 38,
      price: "$180.00",
      oldPrice: "$240.00",
      colors: ["#1f2937", "#f59e0b", "#8b5cf6"],
      badge: "25% Off",
      badgeColor: "bg-red-500 text-white",
    },
    {
      id: 3,
      name: "Lorem ipsum dolor sit amet consectetur",
      category: "New Arrivals",
      image: "/assets/img/product/product-7.webp",
      rating: 3,
      reviews: 12,
      price: "$95.00",
      colors: ["#ef4444", "#06b6d4", "#10b981"],
    },
    {
      id: 4,
      name: "Ut enim ad minim veniam quis",
      category: "Designer Series",
      image: "/assets/img/product/product-10.webp",
      rating: 5,
      reviews: 56,
      price: "$165.00",
      colors: ["#64748b", "#7c3aed", "#f59e0b"],
      badge: "Trending",
      badgeColor: "bg-teal-600 text-white",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Best Sellers</h2>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Necessitatibus eius consequatur ex aliquid fuga eum quidem sint consectetur velit
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;