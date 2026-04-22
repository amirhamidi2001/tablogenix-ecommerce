// src/components/Cards.jsx
const CardColumn = ({ title, icon, products }) => {
  return (
    <div className="bg-gray-50 p-5 rounded-xl">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-5">
        <i className={`bi ${icon} text-teal-700`}></i> {title}
      </h3>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="flex gap-3 items-center group">
            <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 group-hover:text-teal-700 transition line-clamp-2">
                {product.name}
              </h4>
              <div className="flex items-center gap-1 text-xs text-yellow-500 mt-1">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`bi ${i < product.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                ))}
                <span className="text-gray-400 ml-1">({product.reviews})</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-semibold">{product.price}</span>
                {product.oldPrice && (
                  <span className="text-sm text-gray-400 line-through">{product.oldPrice}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Cards = () => {
  const trendingProducts = [
    { id: 1, name: "Premium Leather Tote", image: "/assets/img/product/product-1.webp", rating: 4.5, reviews: 24, price: "$87.50", badge: "New" },
    { id: 2, name: "Statement Earrings", image: "/assets/img/product/product-3.webp", rating: 5, reviews: 41, price: "$39.99" },
    { id: 3, name: "Organic Cotton Shirt", image: "/assets/img/product/product-5.webp", rating: 4, reviews: 18, price: "$45.00" },
  ];

  const bestSellersProducts = [
    { id: 4, name: "Slim Fit Denim", image: "/assets/img/product/product-2.webp", rating: 5, reviews: 87, price: "$68.00", oldPrice: "$80.00", badge: "-15%" },
    { id: 5, name: "Designer Handbag", image: "/assets/img/product/product-6.webp", rating: 4.5, reviews: 56, price: "$129.99" },
    { id: 6, name: "Leather Crossbody", image: "/assets/img/product/product-8.webp", rating: 5, reviews: 112, price: "$95.50", badge: "Hot" },
  ];

  const featuredProducts = [
    { id: 7, name: "Pleated Midi Skirt", image: "/assets/img/product/product-7.webp", rating: 4, reviews: 32, price: "$75.00" },
    { id: 8, name: "Geometric Earrings", image: "/assets/img/product/product-4.webp", rating: 4.5, reviews: 47, price: "$42.99", badge: "Limited" },
    { id: 9, name: "Structured Satchel", image: "/assets/img/product/product-9.webp", rating: 5, reviews: 64, price: "$89.99" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardColumn title="Trending Now" icon="bi-fire" products={trendingProducts} />
          <CardColumn title="Best Sellers" icon="bi-award" products={bestSellersProducts} />
          <CardColumn title="Featured Items" icon="bi-star" products={featuredProducts} />
        </div>
      </div>
    </section>
  );
};

export default Cards;