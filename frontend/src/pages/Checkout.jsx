// src/pages/Checkout.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Checkout = () => {
  // ========== State for Form Fields ==========
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    saveAddress: false,
    billingSame: true,
    terms: false,
  });

  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardName: '',
  });

  // Promo code
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Mock cart data (should come from context/state in real app)
  const cartItems = [
    {
      id: 1,
      name: 'Lorem Ipsum Dolor',
      image: '/assets/img/product/product-1.webp',
      price: 89.99,
      quantity: 1,
      color: 'Black',
      size: 'M',
    },
    {
      id: 2,
      name: 'Sit Amet Consectetur',
      image: '/assets/img/product/product-2.webp',
      price: 59.99,
      quantity: 2,
      color: 'White',
      size: 'L',
    },
  ];

  // Calculate order totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 9.99;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax - discount;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Apply promo code
  const applyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE20' && !couponApplied) {
      setDiscount(20);
      setCouponApplied(true);
      alert('Promo code applied! $20 discount added.');
    } else if (couponApplied) {
      alert('Promo code already applied.');
    } else {
      alert('Invalid promo code.');
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    if (!formData.terms) {
      alert('Please agree to the Terms and Conditions.');
      return;
    }
    // In real app, send data to backend
    alert('Order placed successfully! (Demo)');
    // Here you could redirect to order confirmation page
  };

  // Helper to format card number
  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(raw)) {
      setCardDetails((prev) => ({ ...prev, cardNumber: raw }));
    }
  };

  // Format expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setCardDetails((prev) => ({ ...prev, expiry: value }));
  };

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Checkout</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Checkout</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Checkout Form - Left Column */}
            <div className="lg:w-7/12">
              <form onSubmit={handleSubmit}>
                {/* Customer Information */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6 overflow-hidden">
                  <div className="flex items-center gap-3 p-5 bg-gray-50 border-b">
                    <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <h3 className="text-lg font-semibold">Customer Information</h3>
                  </div>
                  <div className="p-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">First Name *</label>
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Last Name *</label>
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500" required />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500" required />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Phone Number *</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:border-teal-500" required />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6 overflow-hidden">
                  <div className="flex items-center gap-3 p-5 bg-gray-50 border-b">
                    <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                  </div>
                  <div className="p-6">
                    <div className="mt-2">
                      <label className="block text-sm font-medium mb-1">Street Address *</label>
                      <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" required />
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Apartment, Suite, etc. (optional)</label>
                      <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">City *</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">State *</label>
                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" required />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">ZIP Code *</label>
                        <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" required />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1">Country *</label>
                      <select name="country" value={formData.country} onChange={handleInputChange} className="w-full border rounded-lg px-3 py-2" required>
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                      </select>
                    </div>
                    <div className="mt-4 space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="saveAddress" checked={formData.saveAddress} onChange={handleInputChange} className="rounded text-teal-600" />
                        <span className="text-sm">Save this address for future orders</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" name="billingSame" checked={formData.billingSame} onChange={handleInputChange} className="rounded text-teal-600" />
                        <span className="text-sm">Billing address same as shipping</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6 overflow-hidden">
                  <div className="flex items-center gap-3 p-5 bg-gray-50 border-b">
                    <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <h3 className="text-lg font-semibold">Payment Method</h3>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-4 mb-6">
                      {['credit-card', 'paypal', 'apple-pay'].map((method) => (
                        <label key={method} className={`flex-1 min-w-[120px] border rounded-xl p-3 text-center cursor-pointer transition ${paymentMethod === method ? 'border-teal-600 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                          <input type="radio" name="paymentMethod" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} className="hidden" />
                          <i className={`bi ${method === 'credit-card' ? 'bi-credit-card-2-front' : method === 'paypal' ? 'bi-paypal' : 'bi-apple'} text-2xl block mb-1`}></i>
                          <span className="text-sm capitalize">{method === 'credit-card' ? 'Credit / Debit Card' : method === 'paypal' ? 'PayPal' : 'Apple Pay'}</span>
                        </label>
                      ))}
                    </div>

                    {paymentMethod === 'credit-card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Card Number *</label>
                          <div className="relative">
                            <input type="text" value={formatCardNumber(cardDetails.cardNumber)} onChange={handleCardNumberChange} className="w-full border rounded-lg px-3 py-2 pr-16" placeholder="1234 5678 9012 3456" required />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 text-gray-400">
                              <i className="bi bi-credit-card-2-front"></i>
                              <i className="bi bi-credit-card"></i>
                            </div>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-1">Expiration Date *</label>
                            <input type="text" name="expiry" value={cardDetails.expiry} onChange={handleExpiryChange} placeholder="MM/YY" className="w-full border rounded-lg px-3 py-2" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Security Code (CVV) *</label>
                            <div className="relative">
                              <input type="text" name="cvv" value={cardDetails.cvv} onChange={handleCardChange} placeholder="123" className="w-full border rounded-lg px-3 py-2 pr-10" required />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-help" title="3-digit code on the back of your card">
                                <i className="bi bi-question-circle"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Name on Card *</label>
                          <input type="text" name="cardName" value={cardDetails.cardName} onChange={handleCardChange} className="w-full border rounded-lg px-3 py-2" required />
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">You will be redirected to PayPal to complete your purchase securely.</div>
                    )}
                    {paymentMethod === 'apple-pay' && (
                      <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600">You will be prompted to authorize payment with Apple Pay.</div>
                    )}
                  </div>
                </div>

                {/* Review & Place Order */}
                <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 p-5 bg-gray-50 border-b">
                    <div className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                    <h3 className="text-lg font-semibold">Review & Place Order</h3>
                  </div>
                  <div className="p-6">
                    <label className="flex items-start gap-2 mb-6">
                      <input type="checkbox" name="terms" checked={formData.terms} onChange={handleInputChange} className="mt-1 rounded text-teal-600" required />
                      <span className="text-sm">I agree to the <button type="button" className="text-teal-600 hover:underline" onClick={() => document.getElementById('termsModal')?.showModal?.()}>Terms and Conditions</button> and <button type="button" className="text-teal-600 hover:underline" onClick={() => document.getElementById('privacyModal')?.showModal?.()}>Privacy Policy</button></span>
                    </label>
                    <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex justify-between items-center px-6">
                      <span>Place Order</span>
                      <span className="bg-white/20 px-3 py-1 rounded-lg">${total.toFixed(2)}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Order Summary - Right Column */}
            <div className="lg:w-5/12">
              <div className="bg-gray-50 rounded-xl p-6 sticky top-24">
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                  <h3 className="text-xl font-bold">Order Summary</h3>
                  <span className="text-sm text-gray-500">{cartItems.length} Items</span>
                </div>

                {/* Cart Items */}
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-xs text-gray-500">Color: {item.color} | Size: {item.size}</p>
                        <div className="flex justify-between mt-1">
                          <span className="text-sm">{item.quantity} × ${item.price.toFixed(2)}</span>
                          <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="flex gap-2 mb-6">
                  <input type="text" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promo Code" className="flex-1 border rounded-lg px-3 py-2 text-sm" />
                  <button onClick={applyPromo} className="border border-teal-600 text-teal-600 px-4 py-2 rounded-lg text-sm hover:bg-teal-50">Apply</button>
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t pt-4">
                  <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span>${shipping.toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Tax</span><span>${tax.toFixed(2)}</span></div>
                  {discount > 0 && (
                    <div className="flex justify-between text-teal-600"><span>Discount</span><span>-${discount.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
                </div>

                {/* Secure Checkout */}
                <div className="mt-6 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-2">
                    <i className="bi bi-shield-lock"></i> <span>Secure Checkout</span>
                  </div>
                  <div className="flex justify-center gap-3 text-2xl text-gray-500">
                    <i className="bi bi-credit-card-2-front"></i>
                    <i className="bi bi-credit-card"></i>
                    <i className="bi bi-paypal"></i>
                    <i className="bi bi-apple"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals (simple dialogs using native HTML dialog) - you can replace with React Modal if desired */}
      <dialog id="termsModal" className="rounded-xl shadow-xl p-0 backdrop:bg-black/50">
        <div className="max-w-md w-[90vw] p-6">
          <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
          <div className="text-sm text-gray-600 space-y-2 max-h-96 overflow-y-auto">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
            <p>Suspendisse in orci enim. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={() => document.getElementById('termsModal').close()} className="bg-teal-600 text-white px-4 py-2 rounded-lg">I Understand</button>
          </div>
        </div>
      </dialog>

      <dialog id="privacyModal" className="rounded-xl shadow-xl p-0 backdrop:bg-black/50">
        <div className="max-w-md w-[90vw] p-6">
          <h2 className="text-xl font-bold mb-4">Privacy Policy</h2>
          <div className="text-sm text-gray-600 space-y-2 max-h-96 overflow-y-auto">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim.</p>
            <p>Suspendisse in orci enim. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={() => document.getElementById('privacyModal').close()} className="bg-teal-600 text-white px-4 py-2 rounded-lg">I Understand</button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Checkout;