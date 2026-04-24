// src/pages/ChangePassword.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!formData.newPassword) newErrors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Password changed:', formData);
      setSuccess(true);
      setTimeout(() => navigate('/account'), 2000);
    } catch (err) {
      alert('Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Change Password</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li><Link to="/account" className="text-teal-700 hover:underline">Account</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Change Password</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="text-center mb-6">
                <i className="bi bi-shield-lock text-4xl text-teal-600 mb-2 block"></i>
                <h3 className="text-2xl font-bold text-gray-800">Change Password</h3>
                <p className="text-gray-500 text-sm mt-1">Update your account password.</p>
              </div>

              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <i className="bi bi-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-teal-500"
                      placeholder="Current password"
                      required
                    />
                    {errors.currentPassword && <p className="text-red-500 text-xs mt-1">{errors.currentPassword}</p>}
                  </div>
                  <div className="relative">
                    <i className="bi bi-key text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"></i>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-teal-500"
                      placeholder="New password"
                      required
                    />
                    {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword}</p>}
                  </div>
                  <div className="relative">
                    <i className="bi bi-lock-fill absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-teal-500"
                      placeholder="Confirm new password"
                      required
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <i className="bi bi-check-circle-fill text-5xl text-emerald-500"></i>
                  <p className="text-gray-700">Your password has been changed successfully!</p>
                  <p className="text-gray-500 text-sm">Redirecting to account...</p>
                </div>
              )}

              <div className="text-center mt-6 text-sm">
                <Link to="/account" className="text-teal-600 hover:underline">
                  <i className="bi bi-arrow-left me-1"></i> Back to Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ChangePassword;