// src/components/ReviewsTab.jsx
const ReviewsTab = () => {
  const reviews = [
    {
      id: 1,
      productName: 'Lorem ipsum dolor sit amet',
      productImage: '/assets/img/product/product-1.webp',
      rating: 5,
      date: 'Feb 15, 2025',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    },
    {
      id: 2,
      productName: 'Consectetur adipiscing elit',
      productImage: '/assets/img/product/product-2.webp',
      rating: 4,
      date: 'Feb 10, 2025',
      comment: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Reviews</h2>
        <select className="px-4 py-2 border border-gray-200 rounded-lg bg-white text-sm">
          <option>Sort by: Recent</option>
          <option>Highest Rating</option>
          <option>Lowest Rating</option>
        </select>
      </div>
      <div className="space-y-5">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
            <div className="flex gap-4">
              <img src={review.productImage} alt={review.productName} className="w-20 h-20 object-cover rounded-lg border" />
              <div className="flex-1">
                <h4 className="font-semibold text-lg">{review.productName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bi ${i < review.rating ? 'bi-star-fill' : 'bi-star'}`}></i>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">({review.rating}.0)</span>
                  <span className="text-sm text-gray-400">• {review.date}</span>
                </div>
                <p className="text-gray-600 mt-3 text-sm">{review.comment}</p>
                <div className="flex gap-3 mt-4">
                  <button className="text-sm text-teal-600 hover:bg-teal-50 px-3 py-1 rounded-lg transition">Edit Review</button>
                  <button className="text-sm text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg transition">Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsTab;