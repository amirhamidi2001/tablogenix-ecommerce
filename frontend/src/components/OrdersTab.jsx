// src/components/OrdersTab.jsx
import { useState } from 'react';

const OrderCard = ({ order }) => {
  const [trackingOpen, setTrackingOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const statusColors = {
    processing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-blue-100 text-blue-700',
    delivered: 'bg-teal-100 text-teal-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
        <div>
          <span className="text-gray-500 text-sm">Order ID:</span>
          <span className="font-medium ml-1">{order.id}</span>
        </div>
        <div className="text-gray-400 text-sm">{order.date}</div>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex gap-2">
          {order.products.map((product, idx) => (
            <img key={idx} src={product.image} alt="" className="w-16 h-16 object-cover rounded-lg border" />
          ))}
          {order.moreCount > 0 && (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 text-sm">
              +{order.moreCount}
            </div>
          )}
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Status</span>
            <div className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Items</span>
            <div className="font-medium">{order.itemCount} items</div>
          </div>
          <div>
            <span className="text-gray-500">Total</span>
            <div className="font-bold text-gray-800">{order.total}</div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-3">
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <button
            onClick={() => setTrackingOpen(!trackingOpen)}
            className="flex-1 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition"
          >
            Track Order
          </button>
        )}
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className="flex-1 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
        >
          View Details
        </button>
        {order.status === 'delivered' && (
          <button className="flex-1 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition">
            Write Review
          </button>
        )}
        {order.status === 'cancelled' && (
          <button className="flex-1 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition">
            Reorder
          </button>
        )}
      </div>

      {/* Tracking Timeline */}
      {trackingOpen && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="relative pl-8 space-y-5">
            {order.tracking.map((step, idx) => (
              <div key={idx} className="relative">
                <div className={`absolute -left-6 w-4 h-4 rounded-full ${
                  step.completed ? 'bg-teal-500' : step.active ? 'bg-teal-500 animate-pulse' : 'bg-gray-300'
                }`}></div>
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
                {step.date && <div className="text-xs text-gray-400 mt-1">{step.date}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details */}
      {detailsOpen && (
        <div className="mt-5 pt-4 border-t border-gray-100">
          <div className="space-y-4">
            <div>
              <h5 className="font-semibold">Order Information</h5>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div><span className="text-gray-500">Payment Method:</span> {order.paymentMethod}</div>
                <div><span className="text-gray-500">Shipping Method:</span> {order.shippingMethod}</div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold">Items</h5>
              <div className="space-y-2 mt-2">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-center border-b border-gray-50 pb-2">
                    <img src={item.image} alt="" className="w-12 h-12 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400">SKU: {item.sku} | Qty: {item.qty}</div>
                    </div>
                    <div className="font-semibold">{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-semibold">Price Details</h5>
              <div className="space-y-1 mt-2 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>{order.subtotal}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{order.shippingCost}</span></div>
                <div className="flex justify-between"><span>Tax</span><span>{order.tax}</span></div>
                <div className="flex justify-between font-bold pt-2 border-t"><span>Total</span><span>{order.total}</span></div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold">Shipping Address</h5>
              <div className="text-sm mt-1">{order.address}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersTab = () => {
  // دیتای نمونه سفارشات
  const orders = [
    {
      id: '#ORD-2024-1278',
      date: 'Feb 20, 2025',
      products: ['/assets/img/product/product-1.webp', '/assets/img/product/product-2.webp', '/assets/img/product/product-3.webp'],
      moreCount: 0,
      status: 'processing',
      itemCount: 3,
      total: '$789.99',
      paymentMethod: 'Credit Card (**** 4589)',
      shippingMethod: 'Express Delivery (2-3 days)',
      subtotal: '$1,929.93',
      shippingCost: '$15.99',
      tax: '$159.98',
      address: 'Sarah Anderson<br>123 Main Street, Apt 4B<br>New York, NY 10001',
      orderItems: [
        { name: 'Lorem ipsum dolor sit amet', sku: 'PRD-001', qty: 1, price: '$899.99', image: '/assets/img/product/product-1.webp' },
        { name: 'Consectetur adipiscing elit', sku: 'PRD-002', qty: 2, price: '$599.95', image: '/assets/img/product/product-2.webp' },
        { name: 'Sed do eiusmod tempor', sku: 'PRD-003', qty: 1, price: '$129.99', image: '/assets/img/product/product-3.webp' },
      ],
      tracking: [
        { title: 'Order Confirmed', description: 'Your order has been received', date: 'Feb 20, 2025 - 10:30 AM', completed: true },
        { title: 'Processing', description: 'Your order is being prepared', date: 'Feb 20, 2025 - 2:45 PM', completed: true },
        { title: 'Packaging', description: 'Your items are being packaged', date: 'Feb 20, 2025 - 4:15 PM', completed: false, active: true },
        { title: 'In Transit', description: 'Expected to ship within 24 hours', completed: false },
        { title: 'Delivery', description: 'Estimated delivery: Feb 22, 2025', completed: false },
      ],
    },
    {
      id: '#ORD-2024-1265',
      date: 'Feb 15, 2025',
      products: ['/assets/img/product/product-4.webp', '/assets/img/product/product-5.webp'],
      moreCount: 0,
      status: 'shipped',
      itemCount: 2,
      total: '$459.99',
      paymentMethod: 'Credit Card (**** 7821)',
      shippingMethod: 'Standard Shipping (3-5 days)',
      subtotal: '$459.98',
      shippingCost: '$9.99',
      tax: '$38.02',
      address: 'Sarah Anderson<br>123 Main Street, Apt 4B<br>New York, NY 10001',
      orderItems: [
        { name: 'Ut enim ad minim veniam', sku: 'PRD-004', qty: 1, price: '$299.99', image: '/assets/img/product/product-4.webp' },
        { name: 'Quis nostrud exercitation', sku: 'PRD-005', qty: 1, price: '$159.99', image: '/assets/img/product/product-5.webp' },
      ],
      tracking: [
        { title: 'Order Confirmed', description: 'Order received', date: 'Feb 15, 2025 - 9:15 AM', completed: true },
        { title: 'Processing', description: 'Preparing for shipment', date: 'Feb 15, 2025 - 11:30 AM', completed: true },
        { title: 'Packaging', description: 'Packaged for shipping', date: 'Feb 15, 2025 - 2:45 PM', completed: true },
        { title: 'In Transit', description: 'Package in transit', date: 'Feb 16, 2025 - 10:20 AM', completed: false, active: true },
        { title: 'Delivery', description: 'Estimated: Feb 18, 2025', completed: false },
      ],
    },
    {
      id: '#ORD-2024-1252',
      date: 'Feb 10, 2025',
      products: ['/assets/img/product/product-6.webp'],
      moreCount: 0,
      status: 'delivered',
      itemCount: 1,
      total: '$129.99',
      paymentMethod: 'Credit Card (**** 1234)',
      shippingMethod: 'Standard Shipping',
      subtotal: '$129.99',
      shippingCost: '$0.00',
      tax: '$0.00',
      address: 'Sarah Anderson<br>123 Main Street, Apt 4B<br>New York, NY 10001',
      orderItems: [
        { name: 'Wireless Earbuds', sku: 'PRD-006', qty: 1, price: '$129.99', image: '/assets/img/product/product-6.webp' },
      ],
      tracking: [],
    },
    {
      id: '#ORD-2024-1245',
      date: 'Feb 5, 2025',
      products: ['/assets/img/product/product-7.webp', '/assets/img/product/product-8.webp', '/assets/img/product/product-9.webp'],
      moreCount: 2,
      status: 'cancelled',
      itemCount: 5,
      total: '$1,299.99',
      paymentMethod: 'Credit Card (**** 5678)',
      shippingMethod: 'Express Delivery',
      subtotal: '$1,299.99',
      shippingCost: '$0.00',
      tax: '$0.00',
      address: 'Sarah Anderson<br>123 Main Street, Apt 4B<br>New York, NY 10001',
      orderItems: [],
      tracking: [],
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center flex-wrap gap-3 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
        <div className="flex gap-2">
          <div className="relative">
            <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input type="text" placeholder="Search orders..." className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-teal-500" />
          </div>
          <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white">
            <option>All Orders</option>
            <option>Processing</option>
            <option>Shipped</option>
            <option>Delivered</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>
      <div className="space-y-5">
        {orders.map((order, idx) => (
          <OrderCard key={idx} order={order} />
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <button className="px-3 py-1 border rounded-md disabled:opacity-50" disabled>‹</button>
        <button className="px-3 py-1 bg-teal-600 text-white rounded-md">1</button>
        <button className="px-3 py-1 border rounded-md">2</button>
        <button className="px-3 py-1 border rounded-md">3</button>
        <span className="px-2">...</span>
        <button className="px-3 py-1 border rounded-md">12</button>
        <button className="px-3 py-1 border rounded-md">›</button>
      </div>
    </div>
  );
};

export default OrdersTab;