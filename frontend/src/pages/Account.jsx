// src/pages/Account.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AccountSidebar from '../components/AccountSidebar';
import OrdersTab from '../components/OrdersTab';
import WishlistTab from '../components/WishlistTab';
import PaymentMethodsTab from '../components/PaymentMethodsTab';
import ReviewsTab from '../components/ReviewsTab';
import AddressesTab from '../components/AddressesTab';
import SettingsTab from '../components/SettingsTab';

const Account = () => {
  const [activeTab, setActiveTab] = useState('orders');

  const renderTab = () => {
    switch (activeTab) {
      case 'orders': return <OrdersTab />;
      case 'wishlist': return <WishlistTab />;
      case 'payment': return <PaymentMethodsTab />;
      case 'reviews': return <ReviewsTab />;
      case 'addresses': return <AddressesTab />;
      case 'settings': return <SettingsTab />;
      default: return <OrdersTab />;
    }
  };

  return (
    <>
      {/* Page Title (همان قبلی) */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Account</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Account</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Account Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <AccountSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </div>
            <div className="lg:col-span-2">
              {renderTab()}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Account;