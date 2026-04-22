// src/pages/OrderConfirmation.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  // State for collapsible cards (all open by default)
  const [openShipping, setOpenShipping] = useState(true);
  const [openPayment, setOpenPayment] = useState(true);
  const [openItems, setOpenItems] = useState(true);

  // Mock order data
  const order = {
    id: '#ORD-935721',
    date: 'March 2, 2025',
    subtotal: 219.97,
    shipping: 0.00,
    tax: 18.70,
    total: 238.67,
    estimatedDelivery: 'March 7-9, 2025',
    shippingMethod: 'Free Shipping',
    customer: {
      name: 'Michael Thompson',
      address: '789 Oakwood Lane<br>Seattle, WA 98101<br>United States',
      email: 'michael.t@example.com',
      phone: '(206) 555-1234',
    },
    payment: {
      type: 'American Express',
      lastFour: '3782',
    },
    items: [
      {
        id: 1,
        name: 'Wireless Bluetooth Speaker',
        image: '/assets/img/product/product-7.webp',
        color: 'Navy Blue',
        quantity: 1,
        price: 129.99,
      },
      {
        id: 2,
        name: 'Smart Fitness Tracker',
        image: '/assets/img/product/product-9.webp',
        color: 'Black',
        size: 'Medium',
        quantity: 1,
        price: 89.98,
      },
    ],
    recommended: [
      { id: 1, name: 'Wireless Earbuds', price: 59.99, image: '/assets/img/product/product-11.webp' },
      { id: 2, name: 'Portable Phone Charger', price: 34.99, image: '/assets/img/product/product-10.webp' },
      { id: 3, name: 'Smart Watch', price: 149.99, image: '/assets/img/product/product-8.webp' },
    ],
  };

  // Stepper steps
  const steps = [
    { name: 'Confirmed', completed: true },
    { name: 'Processing', completed: true, current: true },
    { name: 'Shipped', completed: false },
    { name: 'Delivered', completed: false },
  ];

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Order Confirmation</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Order Confirmation</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Order Confirmation Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row rounded-xl overflow-hidden shadow-lg border border-gray-100">
            {/* Sidebar - Left */}
            <div className="lg:w-1/3 bg-gradient-to-br from-teal-800 to-teal-900 text-white p-6 md:p-8">
              {/* Success Animation */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center relative">
                  <div className="absolute w-24 h-24 rounded-full bg-white/10 animate-ping"></div>
                  <i className="bi bi-check-lg text-4xl text-white"></i>
                </div>
              </div>

              {/* Order ID & Date */}
              <div className="text-center mb-8 pb-6 border-b border-white/20">
                <h4 className="text-xl font-bold">{order.id}</h4>
                <div className="text-white/80 text-sm mt-1">{order.date}</div>
              </div>

              {/* Stepper */}
              <div className="mb-8">
                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          step.completed
                            ? 'bg-teal-500 text-white'
                            : step.current
                            ? 'bg-white text-teal-800 ring-4 ring-white/30'
                            : 'bg-white/20 text-white/70'
                        }`}
                      >
                        {step.completed ? <i className="bi bi-check-lg text-xs"></i> : idx + 1}
                      </div>
                      <div className={`flex-1 ${step.current ? 'font-semibold' : 'text-white/70'}`}>
                        {step.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Summary */}
              <div className="mb-8">
                <h5 className="text-lg font-semibold mb-3">Order Summary</h5>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></li>
                  <li className="flex justify-between"><span>Shipping</span><span>${order.shipping.toFixed(2)}</span></li>
                  <li className="flex justify-between"><span>Tax</span><span>${order.tax.toFixed(2)}</span></li>
                  <li className="flex justify-between text-lg font-bold pt-2 border-t border-white/20 mt-2">
                    <span>Total</span><span>${order.total.toFixed(2)}</span>
                  </li>
                </ul>
              </div>

              {/* Delivery Info */}
              <div className="mb-8">
                <h5 className="text-lg font-semibold mb-3">Delivery Information</h5>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2"><i className="bi bi-calendar-check"></i> <span>Estimated delivery: {order.estimatedDelivery}</span></p>
                  <p className="flex items-center gap-2"><i className="bi bi-truck"></i> <span>{order.shippingMethod}</span></p>
                </div>
              </div>

              {/* Customer Service */}
              <div>
                <h5 className="text-lg font-semibold mb-3">Need Help?</h5>
                <div className="space-y-2">
                  <Link to="/contact" className="flex items-center gap-2 text-white/80 hover:text-white transition">
                    <i className="bi bi-chat-dots"></i> <span>Contact Support</span>
                  </Link>
                  <Link to="/faq" className="flex items-center gap-2 text-white/80 hover:text-white transition">
                    <i className="bi bi-question-circle"></i> <span>FAQs</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content - Right */}
            <div className="lg:w-2/3 p-6 md:p-8 bg-white">
              {/* Thank You Message */}
              <div className="mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Thanks for your order!</h1>
                <p className="text-gray-600 mt-2">
                  We've received your order and will begin processing it right away.
                  We'll send you updates via email as your order progresses.
                </p>
              </div>

              {/* Shipping Details Card */}
              <div className="border border-gray-200 rounded-xl mb-5 overflow-hidden">
                <button
                  onClick={() => setOpenShipping(!openShipping)}
                  className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <i className="bi bi-geo-alt text-teal-600"></i> Shipping Details
                  </h3>
                  <i className={`bi bi-chevron-${openShipping ? 'up' : 'down'} text-gray-500 transition-transform`}></i>
                </button>
                {openShipping && (
                  <div className="p-5 border-t border-gray-100">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Ship To</label>
                        <address className="not-italic text-gray-700" dangerouslySetInnerHTML={{ __html: order.customer.address }} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Contact</label>
                        <div className="space-y-1">
                          <p><i className="bi bi-envelope mr-2 text-gray-400"></i> {order.customer.email}</p>
                          <p><i className="bi bi-telephone mr-2 text-gray-400"></i> {order.customer.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Details Card */}
              <div className="border border-gray-200 rounded-xl mb-5 overflow-hidden">
                <button
                  onClick={() => setOpenPayment(!openPayment)}
                  className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <i className="bi bi-credit-card text-teal-600"></i> Payment Details
                  </h3>
                  <i className={`bi bi-chevron-${openPayment ? 'up' : 'down'} text-gray-500 transition-transform`}></i>
                </button>
                {openPayment && (
                  <div className="p-5 border-t border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <i className="bi bi-credit-card-2-front text-teal-600 text-2xl"></i>
                      </div>
                      <div>
                        <div className="font-semibold">{order.payment.type}</div>
                        <div className="text-gray-600 text-sm">•••• •••• •••• {order.payment.lastFour}</div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100">
                      <h5 className="font-medium">Billing Address</h5>
                      <p className="text-gray-600 text-sm mt-1">Same as shipping address</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items Card */}
              <div className="border border-gray-200 rounded-xl mb-8 overflow-hidden">
                <button
                  onClick={() => setOpenItems(!openItems)}
                  className="w-full flex justify-between items-center p-5 bg-gray-50 hover:bg-gray-100 transition"
                >
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <i className="bi bi-bag-check text-teal-600"></i> Order Items
                  </h3>
                  <i className={`bi bi-chevron-${openItems ? 'up' : 'down'} text-gray-500 transition-transform`}></i>
                </button>
                {openItems && (
                  <div className="p-5 border-t border-gray-100 space-y-5">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border" />
                        <div className="flex-1">
                          <h4 className="font-semibold">{item.name}</h4>
                          <div className="text-sm text-gray-500 mt-1">
                            {item.color && <span>Color: {item.color}</span>}
                            {item.size && <span className="ml-2">Size: {item.size}</span>}
                          </div>
                          <div className="flex justify-between mt-2">
                            <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                            <span className="font-medium">${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid md:grid-cols-2 gap-4 mb-10">
                <Link to="/category" className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition">
                  <i className="bi bi-arrow-left"></i> Return to Shop
                </Link>
                <Link to="/account" className="flex items-center justify-center gap-2 bg-teal-600 text-white py-3 rounded-lg hover:bg-teal-700 transition">
                  View in Account <i className="bi bi-arrow-right"></i>
                </Link>
              </div>

              {/* Recommended Products */}
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:left-0 after:w-12 after:h-1 after:bg-teal-600">
                  You Might Also Like
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {order.recommended.map((product) => (
                    <div key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group">
                      <div className="h-40 overflow-hidden">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      </div>
                      <div className="p-3 text-center">
                        <h5 className="font-medium text-sm line-clamp-2">{product.name}</h5>
                        <div className="text-teal-600 font-bold text-sm mt-1">${product.price.toFixed(2)}</div>
                        <button className="mt-2 w-full bg-teal-50 text-teal-600 py-1.5 rounded-lg text-xs font-semibold hover:bg-teal-600 hover:text-white transition">
                          <i className="bi bi-plus"></i> Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default OrderConfirmation;