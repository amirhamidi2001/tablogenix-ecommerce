// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState('login'); // 'login' or 'register'

  // State for login form
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // State for register form
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    // Basic validation
    if (!loginData.email || !loginData.password) {
      alert('Please fill in all fields.');
      return;
    }
    // Simulate API call
    console.log('Login:', loginData);
    alert('Login successful! (Demo)');
    // Redirect to home or account page
    navigate('/');
  };

  // Handle register form submission
  const handleRegister = (e) => {
    e.preventDefault();
    if (!registerData.firstName || !registerData.lastName || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      alert('Please fill in all fields.');
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!registerData.terms) {
      alert('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    console.log('Register:', registerData);
    alert('Registration successful! Please login.');
    setActiveForm('login');
    // Optionally clear register form
  };

  // Social login handlers (demo)
  const handleGoogleLogin = () => {
    alert('Google login demo. Implement OAuth in real app.');
  };

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">
            {activeForm === 'login' ? 'Login' : 'Register'}
          </h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">{activeForm === 'login' ? 'Login' : 'Register'}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Auth Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              {/* Login Form */}
              {activeForm === 'login' && (
                <div className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Welcome Back</h3>
                    <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
                  </div>

                  <form onSubmit={handleLogin}>
                    {/* Email Field */}
                    <div className="relative mb-4">
                      <i className="bi bi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-teal-500"
                        placeholder="Email address"
                        required
                      />
                    </div>

                    {/* Password Field with Toggle */}
                    <div className="relative mb-4">
                      <i className="bi bi-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-teal-500"
                        placeholder="Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600"
                      >
                        <i className={`bi ${showLoginPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>

                    {/* Options Row */}
                    <div className="flex justify-between items-center mb-6 text-sm">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={loginData.remember}
                          onChange={(e) => setLoginData({ ...loginData, remember: e.target.checked })}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-gray-600">Remember me</span>
                      </label>
                      <Link to="/forgot-password" className="text-teal-600 hover:underline">
                        Forgot password?
                      </Link>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2">
                      Sign In <i className="bi bi-arrow-right"></i>
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    {/* Social Login */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <i className="bi bi-google"></i> Continue with Google
                    </button>

                    {/* Switch to Register */}
                    <div className="text-center mt-6 text-sm">
                      <span className="text-gray-500">Don't have an account?</span>
                      <button
                        type="button"
                        onClick={() => setActiveForm('register')}
                        className="ml-2 text-teal-600 font-medium hover:underline"
                      >
                        Create account
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Register Form */}
              {activeForm === 'register' && (
                <div className="p-6 md:p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-800">Create Account</h3>
                    <p className="text-gray-500 text-sm mt-1">Join us today and get started</p>
                  </div>

                  <form onSubmit={handleRegister}>
                    {/* First and Last Name Row */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                      <div className="relative flex-1">
                        <i className="bi bi-person absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="text"
                          value={registerData.firstName}
                          onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-teal-500"
                          placeholder="First name"
                          required
                        />
                      </div>
                      <div className="relative flex-1">
                        <i className="bi bi-person absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input
                          type="text"
                          value={registerData.lastName}
                          onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-teal-500"
                          placeholder="Last name"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="relative mb-4">
                      <i className="bi bi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-3 focus:outline-none focus:border-teal-500"
                        placeholder="Email address"
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="relative mb-4">
                      <i className="bi bi-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-teal-500"
                        placeholder="Create password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600"
                      >
                        <i className={`bi ${showRegPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="relative mb-4">
                      <i className="bi bi-lock-fill absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                      <input
                        type={showRegConfirmPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-10 py-3 focus:outline-none focus:border-teal-500"
                        placeholder="Confirm password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-600"
                      >
                        <i className={`bi ${showRegConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="mb-6">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={registerData.terms}
                          onChange={(e) => setRegisterData({ ...registerData, terms: e.target.checked })}
                          className="mt-1 rounded text-teal-600 focus:ring-teal-500"
                          required
                        />
                        <span className="text-sm text-gray-600">
                          I agree to the <Link to="/tos" className="text-teal-600 hover:underline">Terms of Service</Link> and{' '}
                          <Link to="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition flex items-center justify-center gap-2">
                      Create Account <i className="bi bi-arrow-right"></i>
                    </button>

                    {/* Divider */}
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-gray-500">or</span>
                      </div>
                    </div>

                    {/* Social Signup */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                    >
                      <i className="bi bi-google"></i> Sign up with Google
                    </button>

                    {/* Switch to Login */}
                    <div className="text-center mt-6 text-sm">
                      <span className="text-gray-500">Already have an account?</span>
                      <button
                        type="button"
                        onClick={() => setActiveForm('login')}
                        className="ml-2 text-teal-600 font-medium hover:underline"
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;