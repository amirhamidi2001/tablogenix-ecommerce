// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log('Reset password requested for:', email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Forgot Password</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Forgot Password</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8">
              <div className="text-center mb-6">
                <i className="bi bi-lock text-4xl text-teal-600 mb-2 block"></i>
                <h3 className="text-2xl font-bold text-gray-800">Forgot Password?</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="relative">
                    <i className="bi bi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-teal-500"
                      placeholder="Email address"
                      required
                    />
                  </div>
                  {error && <p className="text-red-500 text-sm -mt-2">{error}</p>}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
                  >
                    {isLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-4">
                  <i className="bi bi-check-circle-fill text-5xl text-emerald-500"></i>
                  <p className="text-gray-700">
                    If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
                  </p>
                  <Link
                    to="/login"
                    className="inline-block text-teal-600 font-medium hover:underline"
                  >
                    Back to Login
                  </Link>
                </div>
              )}

              <div className="text-center mt-6 text-sm">
                <Link to="/login" className="text-teal-600 hover:underline">
                  <i className="bi bi-arrow-left me-1"></i> Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;