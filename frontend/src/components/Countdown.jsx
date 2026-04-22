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
      </div>

      {/* عناصر تزئینی (اختیاری) */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-teal-200 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-200 rounded-full opacity-20 translate-x-1/2 translate-y-1/2"></div>
    </section>
  );
};

export default Countdown;