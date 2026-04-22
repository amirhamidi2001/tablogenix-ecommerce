// src/components/SettingsTab.jsx
const SettingsTab = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
      <div className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className="block text-sm font-medium mb-1">First Name</label><input type="text" defaultValue="Sarah" className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Last Name</label><input type="text" defaultValue="Anderson" className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" defaultValue="sarah@example.com" className="w-full border rounded-lg px-3 py-2" /></div>
              <div><label className="block text-sm font-medium mb-1">Phone</label><input type="tel" defaultValue="+1 (555) 123-4567" className="w-full border rounded-lg px-3 py-2" /></div>
            </div>
            <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Save Changes</button>
          </form>
        </div>

        {/* Email Preferences */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Email Preferences</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center"><div><div className="font-medium">Order Updates</div><div className="text-sm text-gray-500">Receive notifications about your order status</div></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label></div>
            <div className="flex justify-between items-center"><div><div className="font-medium">Promotions</div><div className="text-sm text-gray-500">Receive emails about new promotions and deals</div></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label></div>
            <div className="flex justify-between items-center"><div><div className="font-medium">Newsletter</div><div className="text-sm text-gray-500">Subscribe to our weekly newsletter</div></div><label className="relative inline-flex items-center cursor-pointer"><input type="checkbox" defaultChecked className="sr-only peer" /><div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div></label></div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Security</h3>
          <form className="space-y-4">
            <div><label className="block text-sm font-medium mb-1">Current Password</label><input type="password" className="w-full border rounded-lg px-3 py-2" /></div>
            <div className="grid md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-1">New Password</label><input type="password" className="w-full border rounded-lg px-3 py-2" /></div><div><label className="block text-sm font-medium mb-1">Confirm Password</label><input type="password" className="w-full border rounded-lg px-3 py-2" /></div></div>
            <button type="submit" className="px-5 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Update Password</button>
          </form>
        </div>

        {/* Danger Zone */}
        <div className="border border-red-200 rounded-xl p-6 bg-red-50/30">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
          <p className="text-gray-600 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
          <button className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Delete Account</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;