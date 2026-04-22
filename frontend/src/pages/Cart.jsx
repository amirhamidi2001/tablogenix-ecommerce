// src/pages/Cart.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  // داده‌های اولیه سبد خرید (مشابه قالب)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Lorem ipsum dolor sit amet',
      image: '/assets/img/product/product-1.webp',
      price: 89.99,
      quantity: 1,
      color: 'Black',
      size: 'M',
      hasDiscount: false,
    },
    {
      id: 2,
      name: 'Consectetur adipiscing elit',
      image: '/assets/img/product/product-3.webp',
      price: 79.99,
      salePrice: 64.99,
      quantity: 2,
      color: 'White',
      size: 'L',
      hasDiscount: true,
    },
    {
      id: 3,
      name: 'Sed do eiusmod tempor',
      image: '/assets/img/product/product-5.webp',
      price: 49.99,
      quantity: 1,
      color: 'Blue',
      size: 'S',
      hasDiscount: false,
    },
  ]);

  // روش ارسال انتخاب شده
  const [shippingMethod, setShippingMethod] = useState('standard'); // standard, express, free
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // محاسبه جمع جزء (subtotal)
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = item.hasDiscount ? item.salePrice : item.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  // تعیین هزینه ارسال بر اساس روش انتخاب شده و جمع جزء
  const getShippingCost = () => {
    if (shippingMethod === 'standard') return 4.99;
    if (shippingMethod === 'express') return 12.99;
    if (shippingMethod === 'free') return subtotal >= 300 ? 0 : 12.99; // شرط رایگان بالای ۳۰۰ دلار
    return 0;
  };

  const shippingCost = getShippingCost();
  const tax = subtotal * 0.1; // فرض ۱۰٪ مالیات
  const total = subtotal + shippingCost + tax - discount;

  // تغییر تعداد آیتم
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) newQuantity = 1;
    if (newQuantity > 10) newQuantity = 10;
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  // حذف آیتم از سبد
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  // پاک کردن کل سبد
  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCartItems([]);
    }
  };

  // اعمال کوپن (مثال: کد "DISCOUNT20" برای ۲۰ دلار تخفیف)
  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'DISCOUNT20' && !couponApplied) {
      setDiscount(20);
      setCouponApplied(true);
      alert('Coupon applied! $20 discount added.');
    } else if (couponApplied) {
      alert('Coupon already applied.');
    } else {
      alert('Invalid coupon code.');
    }
  };

  // به‌روزرسانی سبد (در اینجا فقط اعمال مجدد کوپن یا ریست؟ طبق قالب دکمه Update Cart وجود دارد)
  // ما همان دکمه را برای رفرش یا اعمال تغییرات (اگر نیاز باشد) می‌گذاریم.
  const updateCart = () => {
    // در این دمو فقط یک alert نشان می‌دهیم.
    alert('Cart updated (quantities saved).');
  };

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Cart</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Cart</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Cart Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items - Left Column */}
            <div className="lg:w-2/3">
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 md:p-6">
                {/* Header - Hidden on mobile */}
                <div className="hidden md:grid grid-cols-12 gap-4 pb-3 mb-4 border-b border-gray-100 text-gray-500 text-sm font-medium">
                  <div className="col-span-6">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Quantity</div>
                  <div className="col-span-2 text-center">Total</div>
                </div>

                {/* Cart Items List */}
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="bi bi-cart3 text-6xl text-gray-300"></i>
                    <p className="text-gray-500 mt-4">Your cart is empty.</p>
                    <Link to="/category" className="inline-block mt-4 bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <>
                    {cartItems.map((item) => {
                      const itemPrice = item.hasDiscount ? item.salePrice : item.price;
                      const itemTotal = itemPrice * item.quantity;
                      return (
                        <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 py-5 border-b border-gray-100">
                          {/* Product Info */}
                          <div className="flex gap-4 md:col-span-6">
                            <div className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h6 className="font-semibold text-gray-800">{item.name}</h6>
                              <div className="text-sm text-gray-500 mt-1">
                                <span>Color: {item.color}</span> | <span>Size: {item.size}</span>
                              </div>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 text-sm mt-2 flex items-center gap-1 hover:text-red-700 transition"
                              >
                                <i className="bi bi-trash"></i> Remove
                              </button>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="flex items-center justify-between md:justify-center md:col-span-2">
                            <span className="md:hidden text-gray-500">Price:</span>
                            <div>
                              {item.hasDiscount ? (
                                <>
                                  <span className="text-gray-400 line-through text-sm">${item.price.toFixed(2)}</span>
                                  <span className="font-semibold ml-1">${item.salePrice.toFixed(2)}</span>
                                </>
                              ) : (
                                <span className="font-semibold">${item.price.toFixed(2)}</span>
                              )}
                            </div>
                          </div>

                          {/* Quantity */}
                          <div className="flex items-center justify-between md:justify-center md:col-span-2">
                            <span className="md:hidden text-gray-500">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="px-2 py-1 hover:bg-gray-100 transition"
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-12 text-center border-x border-gray-300 py-1 outline-none"
                                min="1"
                                max="10"
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="px-2 py-1 hover:bg-gray-100 transition"
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>

                          {/* Total */}
                          <div className="flex items-center justify-between md:justify-center md:col-span-2">
                            <span className="md:hidden text-gray-500">Total:</span>
                            <span className="font-bold text-gray-800">${itemTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Cart Actions */}
                    <div className="flex flex-col md:flex-row justify-between gap-4 mt-6 pt-4 border-t border-gray-100">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Coupon code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 w-40 md:w-auto focus:outline-none focus:border-teal-500"
                        />
                        <button
                          onClick={applyCoupon}
                          className="border border-teal-600 text-teal-600 px-4 py-2 rounded-lg hover:bg-teal-50 transition"
                        >
                          Apply Coupon
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={updateCart}
                          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
                        >
                          <i className="bi bi-arrow-clockwise"></i> Update Cart
                        </button>
                        <button
                          onClick={clearCart}
                          className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
                        >
                          <i className="bi bi-trash"></i> Clear Cart
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Summary - Right Column */}
            {cartItems.length > 0 && (
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-xl p-6 shadow-sm sticky top-24">
                  <h4 className="text-xl font-bold text-gray-800 pb-3 border-b border-gray-200">Order Summary</h4>

                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    {/* Shipping Options */}
                    <div className="border-t border-gray-200 pt-3">
                      <div className="text-gray-600 mb-2">Shipping</div>
                      <div className="space-y-2">
                        <label className="flex justify-between items-center cursor-pointer">
                          <span className="text-sm">Standard Delivery - $4.99</span>
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                            className="form-radio text-teal-600"
                          />
                        </label>
                        <label className="flex justify-between items-center cursor-pointer">
                          <span className="text-sm">Express Delivery - $12.99</span>
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'express'}
                            onChange={() => setShippingMethod('express')}
                            className="form-radio text-teal-600"
                          />
                        </label>
                        <label className="flex justify-between items-center cursor-pointer">
                          <span className="text-sm">Free Shipping (Orders over $300)</span>
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'free'}
                            onChange={() => setShippingMethod('free')}
                            className="form-radio text-teal-600"
                          />
                        </label>
                      </div>
                      {shippingMethod === 'free' && subtotal < 300 && (
                        <p className="text-xs text-orange-500 mt-1">Add ${(300 - subtotal).toFixed(2)} more to qualify for free shipping.</p>
                      )}
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (10%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-teal-600">
                        <span>Discount</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>

                    <Link
                      to="/checkout"
                      className="block w-full bg-teal-600 text-white text-center py-3 rounded-lg hover:bg-teal-700 transition mt-4"
                    >
                      Proceed to Checkout <i className="bi bi-arrow-right"></i>
                    </Link>

                    <Link to="/category" className="block w-full text-center text-teal-600 text-sm mt-2 hover:underline">
                      <i className="bi bi-arrow-left"></i> Continue Shopping
                    </Link>

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">We Accept</p>
                      <div className="flex justify-center gap-3 text-2xl text-gray-500 mt-2">
                        <i className="bi bi-credit-card"></i>
                        <i className="bi bi-paypal"></i>
                        <i className="bi bi-wallet2"></i>
                        <i className="bi bi-bank"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;