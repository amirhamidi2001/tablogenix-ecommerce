// src/components/PaymentMethodsTab.jsx
const PaymentMethodsTab = () => {
  const cards = [
    {
      id: 1,
      type: 'Visa',
      number: '•••• •••• •••• 4589',
      expiry: '09/2026',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Mastercard',
      number: '•••• •••• •••• 7821',
      expiry: '05/2025',
      isDefault: false,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment Methods</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition">
          <i className="bi bi-plus-lg"></i>
          Add New Card
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className={`bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition ${
              card.isDefault ? 'border-teal-500' : 'border-gray-100'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <i className="bi bi-credit-card text-2xl text-gray-600"></i>
              <div className="flex gap-2">
                {card.isDefault && (
                  <span className="bg-teal-100 text-teal-700 text-xs px-2 py-1 rounded-full">Default</span>
                )}
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{card.type}</span>
              </div>
            </div>
            <div className="mb-4">
              <div className="font-mono text-lg tracking-wider">{card.number}</div>
              <div className="text-sm text-gray-500 mt-1">Expires {card.expiry}</div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <i className="bi bi-pencil"></i> Edit
              </button>
              <button className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition">
                <i className="bi bi-trash"></i> Remove
              </button>
              {!card.isDefault && (
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

export default PaymentMethodsTab;