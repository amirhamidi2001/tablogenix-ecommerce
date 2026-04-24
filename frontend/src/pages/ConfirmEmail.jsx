// src/pages/ConfirmEmail.jsx
import { Link, useSearchParams } from 'react-router-dom';

const ConfirmEmail = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'success'; // 'success', 'error', 'already_confirmed'
  const email = searchParams.get('email') || '';

  const getContent = () => {
    switch (status) {
      case 'success':
        return {
          icon: 'bi-check-circle-fill',
          iconColor: 'text-emerald-500',
          title: 'Email Confirmed!',
          message: 'Your email address has been successfully verified.',
          buttonText: 'Go to Login',
          buttonLink: '/login',
        };
      case 'already_confirmed':
        return {
          icon: 'bi-info-circle-fill',
          iconColor: 'text-yellow-500',
          title: 'Already Confirmed',
          message: 'This email address has already been verified. You can log in to your account.',
          buttonText: 'Go to Login',
          buttonLink: '/login',
        };
      case 'error':
      default:
        return {
          icon: 'bi-exclamation-triangle-fill',
          iconColor: 'text-red-500',
          title: 'Verification Failed',
          message: 'The verification link is invalid or has expired. Please request a new verification email.',
          buttonText: 'Back to Home',
          buttonLink: '/',
        };
    }
  };

  const content = getContent();

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Confirm Email</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Confirm Email</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            {/* Icon */}
            <i className={`bi ${content.icon} text-6xl ${content.iconColor} mb-4`}></i>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              {content.title}
            </h2>

            {/* Message */}
            <p className="text-gray-600 mb-6">
              {content.message}
              {email && <span className="block text-sm text-gray-500 mt-2">({email})</span>}
            </p>

            {/* Action Button */}
            <Link
              to={content.buttonLink}
              className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              {content.buttonText}
            </Link>

            {/* Additional Links (optional) */}
            <div className="mt-6 text-sm">
              <Link to="/" className="text-teal-600 hover:underline">
                <i className="bi bi-house-door me-1"></i> Return to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfirmEmail;