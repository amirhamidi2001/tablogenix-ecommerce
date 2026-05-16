import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { cartAPI, dashboardAPI } from "../services/api";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const WishlistTab = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);
  const [addingToCart, setAddingToCart] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    dashboardAPI
      .getWishlist()
      .then(({ data }) => setItems(data.results ?? data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id) => {
    setRemoving(id);
    try {
      await dashboardAPI.removeFromWishlist(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast("Removed from wishlist");
    } catch {
      showToast("Failed to remove item", "error");
    } finally {
      setRemoving(null);
    }
  };

  const handleAddToCart = async (item) => {
    setAddingToCart(item.id);
    try {
      await cartAPI.addItem({ product: item.product.id, quantity: 1 });
      showToast(`${item.product.name} added to cart`);
    } catch {
      showToast("Could not add to cart", "error");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleAddAll = async () => {
    const available = items.filter((i) => i.product.stock > 0);
    for (const item of available) {
      try {
        await cartAPI.addItem({ product: item.product.id, quantity: 1 });
      } catch { /* continue */ }
    }
    showToast(`${available.length} item(s) added to cart`);
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.type === "error" ? "bg-red-500" : "bg-teal-600"
            }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-gray-800">My Wishlist</h2>
        {items.length > 0 && (
          <button
            onClick={handleAddAll}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm font-medium"
          >
            Add All to Cart
          </button>
        )}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <i className="bi bi-heart text-5xl mb-4 block"></i>
          <p className="text-lg font-medium">Your wishlist is empty</p>
          <Link
            to="/products"
            className="mt-4 inline-block px-5 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const p = item.product;
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                {/* Image */}
                <div className="relative">
                  <Link to={`/products/${p.slug}`}>
                    <img
                      src={p.thumbnail_url || "/assets/img/product/product-1.webp"}
                      alt={p.name}
                      className="w-full h-52 object-cover"
                    />
                  </Link>
                  <button
                    onClick={() => handleRemove(item.id)}
                    disabled={removing === item.id}
                    className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-red-50 transition"
                  >
                    {removing === item.id ? (
                      <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <i className="bi bi-trash text-red-500 text-sm"></i>
                    )}
                  </button>
                  {p.is_sale && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded font-semibold">
                      -{p.discount_percent}%
                    </span>
                  )}
                  {p.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm font-medium">
                      Out of Stock
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <Link to={`/products/${p.slug}`}>
                    <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 hover:text-teal-600 transition">
                      {p.name}
                    </h4>
                  </Link>
                  {p.category_name && (
                    <p className="text-xs text-gray-400 mt-0.5">{p.category_name}</p>
                  )}

                  {/* Rating */}
                  <div className="flex items-center gap-1 text-yellow-400 text-xs mt-1">
                    {[...Array(5)].map((_, i) => (
                      <i
                        key={i}
                        className={`bi ${i < Math.floor(p.rating)
                            ? "bi-star-fill"
                            : i < p.rating
                              ? "bi-star-half"
                              : "bi-star"
                          }`}
                      ></i>
                    ))}
                    <span className="text-gray-400 ml-1">({p.reviews_count})</span>
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-base font-bold text-gray-800">
                      {fmt(p.price)}
                    </span>
                    {p.original_price && (
                      <span className="text-sm text-gray-400 line-through">
                        {fmt(p.original_price)}
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => handleAddToCart(item)}
                    disabled={p.stock === 0 || addingToCart === item.id}
                    className="w-full mt-3 py-2 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {addingToCart === item.id ? (
                      <span className="inline-flex items-center gap-2">
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding…
                      </span>
                    ) : p.stock === 0 ? (
                      "Out of Stock"
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
