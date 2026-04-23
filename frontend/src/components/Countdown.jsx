// src/components/Countdown.jsx
import { useState, useEffect } from 'react';

const Countdown = () => {
  const targetDate = new Date('2025-12-31T23:59:59').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <section className="py-20 bg-gradient-to-r from-teal-50 to-pink-50 relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-4 py-2 rounded-full mb-6">
            <span className="text-sm font-semibold">Limited Time</span>
            <span className="text-xl font-bold">50% OFF</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Exclusive Flash Sale</h2>
          <p className="text-gray-600 text-lg mb-8">
            Don't miss out on our biggest sale of the year. Premium quality products at unbeatable prices for the next 48 hours only.
          </p>

          <div className="flex justify-center gap-4 mb-10">
            <div className="bg-white rounded-xl shadow-md p-4 w-24">
              <div className="text-3xl font-bold text-teal-700">{timeLeft.days}</div>
              <div className="text-xs uppercase text-gray-500">Days</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 w-24">
              <div className="text-3xl font-bold text-teal-700">{timeLeft.hours}</div>
              <div className="text-xs uppercase text-gray-500">Hours</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 w-24">
              <div className="text-3xl font-bold text-teal-700">{timeLeft.minutes}</div>
              <div className="text-xs uppercase text-gray-500">Minutes</div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 w-24">
              <div className="text-3xl font-bold text-teal-700">{timeLeft.seconds}</div>
              <div className="text-xs uppercase text-gray-500">Seconds</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#" className="bg-teal-700 text-white px-8 py-3 rounded-full font-semibold hover:bg-teal-800 transition">
              Shop Now
            </a>
            <a href="#" className="border border-gray-300 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition">
              View All Deals
            </a>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          {/* 4 product showcases */}
          <div className="bg-white rounded-xl p-4 text-center shadow"><img src="/assets/img/product/product-5.webp" alt="Product" className="h-32 mx-auto object-contain" /><h6 className="font-semibold mt-2">Premium Wireless Headphones</h6><div className="flex justify-center items-baseline gap-2 mt-1"><span className="text-gray-400 line-through text-sm">$129</span><span className="text-teal-700 font-bold">$71</span></div><div className="flex justify-center text-yellow-400 text-sm mt-1"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><span className="text-gray-400 text-xs ml-1">(324)</span></div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow"><img src="/assets/img/product/product-7.webp" alt="Product" className="h-32 mx-auto object-contain" /><h6 className="font-semibold mt-2">Smart Fitness Tracker</h6><div className="flex justify-center items-baseline gap-2 mt-1"><span className="text-gray-400 line-through text-sm">$89</span><span className="text-teal-700 font-bold">$36</span></div><div className="flex justify-center text-yellow-400 text-sm mt-1"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-half"></i><span className="text-gray-400 text-xs ml-1">(198)</span></div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow"><img src="/assets/img/product/product-11.webp" alt="Product" className="h-32 mx-auto object-contain" /><h6 className="font-semibold mt-2">Luxury Travel Backpack</h6><div className="flex justify-center items-baseline gap-2 mt-1"><span className="text-gray-400 line-through text-sm">$159</span><span className="text-teal-700 font-bold">$103</span></div><div className="flex justify-center text-yellow-400 text-sm mt-1"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><span className="text-gray-400 text-xs ml-1">(267)</span></div></div>
          <div className="bg-white rounded-xl p-4 text-center shadow"><img src="/assets/img/product/product-1.webp" alt="Product" className="h-32 mx-auto object-contain" /><h6 className="font-semibold mt-2">Artisan Coffee Mug Set</h6><div className="flex justify-center items-baseline gap-2 mt-1"><span className="text-gray-400 line-through text-sm">$75</span><span className="text-teal-700 font-bold">$34</span></div><div className="flex justify-center text-yellow-400 text-sm mt-1"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star"></i><span className="text-gray-400 text-xs ml-1">(142)</span></div></div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-200 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full opacity-20 translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default Countdown;