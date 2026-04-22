// src/components/AccountSidebar.jsx
import { Link } from 'react-router-dom';

const AccountSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'orders', label: 'My Orders', icon: 'bi-box-seam', badge: '3' },
    { id: 'wishlist', label: 'Wishlist', icon: 'bi-heart', badge: '12' },
    { id: 'payment', label: 'Payment Methods', icon: 'bi-wallet2' },
    { id: 'reviews', label: 'My Reviews', icon: 'bi-star' },
    { id: 'addresses', label: 'Addresses', icon: 'bi-geo-alt' },
    { id: 'settings', label: 'Account Settings', icon: 'bi-gear' },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      {/* User Info */}
      <div className="text-center pb-6 mb-6 border-b border-gray-100">
        <div className="relative w-24 h-24 mx-auto mb-4">
          <img
            src="/assets/img/person/person-f-1.webp"
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
          />
          <span className="absolute bottom-0 right-0 bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-4 border-white">
            <i className="bi bi-shield-check text-xs"></i>
          </span>
        </div>
        <h4 className="font-semibold text-gray-800">Sarah Anderson</h4>
        <div className="inline-flex items-center gap-1 bg-teal-50 text-teal-700 text-xs px-3 py-1 rounded-full mt-2">
          <i className="bi bi-award"></i>
          <span>Premium Member</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition ${
              activeTab === item.id
                ? 'bg-teal-600 text-white'
                : 'text-gray-700 hover:bg-teal-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <i className={`${item.icon} text-lg`}></i>
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                activeTab === item.id
                  ? 'bg-white text-teal-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer Links */}
      <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
        <Link to="/support" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-teal-600 transition">
          <i className="bi bi-question-circle"></i>
          <span>Help Center</span>
        </Link>
        <button className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition">
          <i className="bi bi-box-arrow-right"></i>
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
};

export default AccountSidebar;