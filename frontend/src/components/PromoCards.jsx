// src/components/PromoCards.jsx
const PromoCards = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* کارت بزرگ سمت چپ */}
          <div className="relative bg-teal-50 rounded-2xl overflow-hidden group">
            <div className="absolute right-0 top-0 w-1/2 h-full">
              <img
                src="/assets/img/product/product-3.webp"
                alt="Women's Collection"
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative z-10 p-8 md:p-10 max-w-md">
              <span className="inline-block bg-teal-100 text-teal-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
                Trending Now
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                New Summer Collection
              </h2>
              <p className="text-gray-600 mb-6">
                Discover our latest arrivals designed for the modern lifestyle.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 bg-teal-700 text-white px-5 py-2 rounded-full hover:bg-teal-800 transition"
              >
                Explore Collection <span>→</span>
              </a>
            </div>
          </div>

          {/* شبکه چهار کارتی سمت راست */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* کارت 1: Men's Wear */}
            <div className="relative bg-blue-50 rounded-2xl overflow-hidden group h-56">
              <div className="absolute right-0 top-0 w-1/2 h-full">
                <img
                  src="/assets/img/product/product-m-5.webp"
                  alt="Men's Fashion"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative p-6 w-1/2 h-full flex flex-col justify-center">
                <h4 className="text-xl font-bold">Men's Wear</h4>
                <p className="text-sm text-gray-500">242 products</p>
                <a href="#" className="mt-2 text-teal-700 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition">
                  Shop Now <span>→</span>
                </a>
              </div>
            </div>

            {/* کارت 2: Kid's Fashion */}
            <div className="relative bg-yellow-50 rounded-2xl overflow-hidden group h-56">
              <div className="absolute right-0 top-0 w-1/2 h-full">
                <img
                  src="/assets/img/product/product-8.webp"
                  alt="Kid's Fashion"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative p-6 w-1/2 h-full flex flex-col justify-center">
                <h4 className="text-xl font-bold">Kid's Fashion</h4>
                <p className="text-sm text-gray-500">185 products</p>
                <a href="#" className="mt-2 text-teal-700 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition">
                  Shop Now <span>→</span>
                </a>
              </div>
            </div>

            {/* کارت 3: Beauty Products */}
            <div className="relative bg-pink-50 rounded-2xl overflow-hidden group h-56">
              <div className="absolute right-0 top-0 w-1/2 h-full">
                <img
                  src="/assets/img/product/product-f-2.webp"
                  alt="Cosmetics"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative p-6 w-1/2 h-full flex flex-col justify-center">
                <h4 className="text-xl font-bold">Beauty Products</h4>
                <p className="text-sm text-gray-500">127 products</p>
                <a href="#" className="mt-2 text-teal-700 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition">
                  Shop Now <span>→</span>
                </a>
              </div>
            </div>

            {/* کارت 4: Accessories */}
            <div className="relative bg-teal-50 rounded-2xl overflow-hidden group h-56">
              <div className="absolute right-0 top-0 w-1/2 h-full">
                <img
                  src="/assets/img/product/product-12.webp"
                  alt="Accessories"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="relative p-6 w-1/2 h-full flex flex-col justify-center">
                <h4 className="text-xl font-bold">Accessories</h4>
                <p className="text-sm text-gray-500">308 products</p>
                <a href="#" className="mt-2 text-teal-700 font-medium inline-flex items-center gap-1 group-hover:gap-2 transition">
                  Shop Now <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoCards;