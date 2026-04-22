// src/components/AddressesTab.jsx
const AddressesTab = () => {
  const addresses = [
    {
      id: 1,
      label: 'Home',
      isDefault: true,
      address: '123 Main Street<br>Apt 4B<br>New York, NY 10001<br>United States',
      name: 'Sarah Anderson',
      phone: '+1 (555) 123-4567',
    },
    {
      id: 2,
      label: 'Office',
      isDefault: false,
      address: '456 Business Ave<br>Suite 200<br>San Francisco, CA 94107<br>United States',
      name: 'Sarah Anderson',
      phone: '+1 (555) 987-6543',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Addresses</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
          <i className="bi bi-plus-lg"></i>
          Add New Address
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition ${
              addr.isDefault ? 'border-teal-500' : 'border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-lg">{addr.label}</h4>
              {addr.isDefault && <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Default</span>}
            </div>
            <div className="text-gray-600 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: addr.address }} />
            <div className="mt-3 text-sm text-gray-500">
              <div><i className="bi bi-person mr-2"></i>{addr.name}</div>
              <div><i className="bi bi-telephone mr-2"></i>{addr.phone}</div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <i className="bi bi-pencil"></i> Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                <i className="bi bi-trash"></i> Remove
              </button>
              {!addr.isDefault && (
                <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition">
                  Make Default
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressesTab;