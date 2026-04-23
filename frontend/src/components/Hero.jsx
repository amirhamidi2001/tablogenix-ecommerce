const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-emerald-50 to-white py-20">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
        <div className="flex-1 text-center md:text-left" data-aos="fade-up">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            TabloGenix E-Commerce
          </h1>
          <p className="text-gray-600 mt-4 text-lg">
            Smart electrical panel e-commerce platform – Built with Django (Backend) & React (Frontend)
          </p>
          <div className="mt-8 flex gap-4 justify-center md:justify-start">
            <a href="#" className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition">
              Shop Now
            </a>
            <a href="#" className="border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 transition">
              Browse Categories
            </a>
          </div>
          <div className="flex gap-6 mt-8 justify-center md:justify-start">
            <div className="flex items-center gap-2"><i className="bi bi-truck"></i><span>Free Shipping</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-award"></i><span>Quality Guarantee</span></div>
            <div className="flex items-center gap-2"><i className="bi bi-headset"></i><span>24/7 Support</span></div>
          </div>
        </div>
        <div className="flex-1 relative" data-aos="fade-left">
          <div className="bg-white rounded-2xl shadow-xl p-4 relative z-10">
            <img src="/assets/img/product/product-2.webp" alt="Featured Product" className="w-full max-w-md mx-auto" />
            <div className="absolute top-4 right-4 bg-teal-600 text-white text-xs font-bold px-2 py-1 rounded">Best Seller</div>
            <div className="mt-4 text-center">
              <h4 className="font-bold text-lg">Premium Wireless Headphones</h4>
              <div className="flex justify-center items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-teal-700">$299</span>
                <span className="text-gray-400 line-through">$399</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;