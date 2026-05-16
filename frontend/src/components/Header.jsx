import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

  // ── FIX: read auth state from context, not a local fetch ───────────────
  // Previously Header had its own isAuthenticated/userName/loading state
  // with a fetchUserProfile() that called /auth/profile/ independently.
  // That state was always out of sync with AuthContext, so the dropdown
  // showed "Welcome to TabloGenix" even when the user was logged in, and
  // handleLogout only called clearTokens() without nulling AuthContext.user.
  const { user, isAuthenticated, logout, loading } = useAuth();

  // Derive display name from the context user object
  const userName = user
    ? (`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email?.split('@')[0] || 'User')
    : '';

  // ── FIX: logout through context so AuthContext.user is set to null ──────
  // Without this, ProtectedRoute still sees the old user object and doesn't
  // redirect, leaving the app in a half-logged-out state.
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Get live cart count from CartContext (unchanged)
  const { cartCount } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* ========== Top Bar ========== */}
      <div className="hidden lg:block bg-emerald-100 text-sm py-2 border-b border-emerald-200">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <i className="bi bi-telephone-fill text-emerald-600"></i>
            <span className="text-emerald-600">Need help? Call us:</span>
            <a href="tel:+1234567890" className="text-teal-700 hover:underline">+1 (234) 567-890</a>
          </div>

          <div className="flex gap-6">
            <div className="overflow-hidden h-6">
              <div className="animate-marquee whitespace-nowrap text-teal-700 font-medium">
                🚚 Free shipping on orders over $50 &nbsp;&nbsp;|&nbsp;&nbsp;
                💰 30 days money back guarantee &nbsp;&nbsp;|&nbsp;&nbsp;
                🎁 20% off on your first order
              </div>
            </div>

            <div className="flex gap-3">
              <div className="dropdown relative group">
                <button className="flex items-center gap-1 text-emerald-700 hover:text-teal-700">
                  <i className="bi bi-translate"></i> EN <i className="bi bi-chevron-down text-xs"></i>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-emerald-100">English</a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-emerald-100">Español</a>
                </div>
              </div>
              <div className="dropdown relative group">
                <button className="flex items-center gap-1 text-emerald-700 hover:text-teal-700">
                  <i className="bi bi-currency-dollar"></i> USD <i className="bi bi-chevron-down text-xs"></i>
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md hidden group-hover:block z-10">
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-emerald-100">USD</a>
                  <a href="#" className="block px-4 py-2 text-sm hover:bg-emerald-100">EUR</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========== Main Header ========== */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-emerald-800">
          TabloGenix
        </Link>

        <form className="hidden md:flex border border-emerald-300 rounded-full overflow-hidden w-96 shadow-sm">
          <input
            type="text"
            placeholder="Search for products"
            className="flex-1 px-5 py-2 outline-none text-sm"
          />
          <button type="submit" className="bg-teal-700 text-white px-5 hover:bg-teal-800 transition">
            <i className="bi bi-search"></i>
          </button>
        </form>

        <div className="flex items-center gap-4">
          <button
            className="md:hidden text-emerald-700 text-xl"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
          >
            <i className="bi bi-search"></i>
          </button>

          {/* ── Account dropdown ───────────────────────────────────────── */}
          <div className="dropdown relative group">
            <button className="text-emerald-700 text-xl hover:text-teal-700">
              <i className="bi bi-person"></i>
            </button>

            <div className="absolute right-0 mt-3 w-64 bg-white shadow-xl rounded-lg hidden group-hover:block z-10 border border-emerald-100 before:content-[''] before:absolute before:-top-3 before:left-0 before:w-full before:h-3">
              {/* Show nothing while AuthContext is still re-hydrating */}
              {!loading && (
                <>
                  {isAuthenticated ? (
                    <>
                      <div className="p-4 border-b">
                        <h6 className="font-semibold">Welcome back, {userName}!</h6>
                        <p className="text-xs text-emerald-500">Manage your account &amp; orders</p>
                      </div>
                      <div className="py-2">
                        {/*
                          FIX: ?tab= deep links now work because Account.jsx
                          reads useSearchParams() and sets the initial active
                          tab from the URL on mount.
                        */}
                        <Link to="/account?tab=orders" className="block px-4 py-2 text-sm hover:bg-emerald-50">Orders</Link>
                        <Link to="/account?tab=wishlist" className="block px-4 py-2 text-sm hover:bg-emerald-50">Wishlist</Link>
                        <Link to="/account?tab=addresses" className="block px-4 py-2 text-sm hover:bg-emerald-50">Addresses</Link>
                        <Link to="/account?tab=settings" className="block px-4 py-2 text-sm hover:bg-emerald-50">Settings</Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                        >
                          <i className="bi bi-box-arrow-right me-1"></i> Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-4 border-b">
                        <h6 className="font-semibold">Welcome to TabloGenix</h6>
                        <p className="text-xs text-emerald-500">Access account &amp; manage orders</p>
                      </div>
                      <div className="py-2">
                        <Link to="/login" className="block px-4 py-2 text-sm hover:bg-emerald-50">Sign In</Link>
                        <Link to="/login?mode=register" className="block px-4 py-2 text-sm hover:bg-emerald-50">Register</Link>
                      </div>
                      <div className="p-4 border-t bg-emerald-50 flex gap-2">
                        <Link to="/login" className="flex-1 text-center bg-teal-700 text-white py-1 rounded text-sm">Sign In</Link>
                        <Link to="/login?mode=register" className="flex-1 text-center border border-teal-700 text-teal-700 py-1 rounded text-sm">Register</Link>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Wishlist */}
          <Link to="/account?tab=wishlist" className="relative text-emerald-700 text-xl hover:text-teal-700">
            <i className="bi bi-heart"></i>
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">0</span>
          </Link>

          {/* Cart — live count from CartContext */}
          <Link to="/cart" className="relative text-emerald-700 text-xl hover:text-teal-700">
            <i className="bi bi-cart3"></i>
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          <button
            className="md:hidden text-emerald-700 text-2xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="bi bi-list"></i>
          </button>
        </div>
      </div>

      {/* ========== Desktop Navigation ========== */}
      <nav className="hidden md:block bg-emerald-800 text-white">
        <div className="container mx-auto px-4">
          <ul className="flex space-x-6">
            <li><NavLink to="/" className={({ isActive }) => `block py-3 ${isActive ? 'text-teal-400' : 'hover:text-teal-400'}`}>Home</NavLink></li>
            <li><NavLink to="/about" className="block py-3 hover:text-teal-400">About</NavLink></li>
            <li><NavLink to="/category" className="block py-3 hover:text-teal-400">Category</NavLink></li>
            <li><NavLink to="/cart" className="block py-3 hover:text-teal-400">Cart</NavLink></li>
            <li><NavLink to="/checkout" className="block py-3 hover:text-teal-400">Checkout</NavLink></li>
            <li className="relative group">
              <button className="py-3 hover:text-teal-400 flex items-center gap-1">
                Dropdown <i className="bi bi-chevron-down text-xs"></i>
              </button>
              <ul className="absolute left-0 mt-0 w-48 bg-white text-emerald-800 shadow-lg rounded-b hidden group-hover:block z-10">
                <li><a href="#" className="block px-4 py-2 hover:bg-emerald-100">Dropdown 1</a></li>
                <li><a href="#" className="block px-4 py-2 hover:bg-emerald-100">Dropdown 2</a></li>
              </ul>
            </li>
            <li><NavLink to="/contact" className="block py-3 hover:text-teal-400">Contact</NavLink></li>
          </ul>
        </div>
      </nav>

      {/* ========== Mobile Search ========== */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-white p-4 border-t shadow-lg">
          <form className="flex border border-emerald-300 rounded-full overflow-hidden">
            <input type="text" placeholder="Search for products" className="flex-1 px-4 py-2 outline-none text-sm" />
            <button type="submit" className="bg-teal-700 text-white px-4">
              <i className="bi bi-search"></i>
            </button>
          </form>
        </div>
      )}

      {/* ========== Mobile Menu ========== */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-lg p-4">
          <ul className="space-y-3">
            <li><Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-800">Home</Link></li>
            <li><Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-800">About</Link></li>
            <li><Link to="/category" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-800">Category</Link></li>
            <li><Link to="/product-details" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-800">Product Details</Link></li>
            <li><Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-800">Cart</Link></li>
            <li><Link to="/checkout" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-800">Checkout</Link></li>
            <li>
              <details className="group">
                <summary className="cursor-pointer list-none flex justify-between items-center text-emerald-800">
                  Dropdown <i className="bi bi-chevron-down group-open:rotate-180 transition"></i>
                </summary>
                <ul className="pl-4 mt-2 space-y-2">
                  <li><a href="#" className="block text-emerald-600">Dropdown 1</a></li>
                  <li><a href="#" className="block text-emerald-600">Dropdown 2</a></li>
                </ul>
              </details>
            </li>
            <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-emerald-800">Contact</Link></li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
