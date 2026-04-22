// src/pages/Contact.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  // State for form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error'

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      alert('Please fill in all fields.');
      return;
    }

    // Simulate API call (replace with actual fetch to your backend)
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Form submitted:', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      alert('Your message has been sent. Thank you!');
    } catch (error) {
      setSubmitStatus('error');
      alert('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Page Title */}
      <div className="bg-gray-50 py-12 border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 md:mb-0">Contact</h1>
          <nav className="text-sm">
            <ol className="flex gap-2">
              <li><Link to="/" className="text-teal-700 hover:underline">Home</Link></li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-600">Contact</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Contact Info Boxes */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Address Box */}
            <div className="bg-gray-50 rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition">
              <div className="bg-teal-100 text-teal-700 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="bi bi-geo-alt text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Our Address</h4>
                <p className="text-gray-600 text-sm">1842 Maple Avenue, Portland, Oregon 97204</p>
              </div>
            </div>
            {/* Email Box */}
            <div className="bg-gray-50 rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition">
              <div className="bg-teal-100 text-teal-700 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="bi bi-envelope text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Email Address</h4>
                <p className="text-gray-600 text-sm">info@example.com</p>
                <p className="text-gray-600 text-sm">contact@example.com</p>
              </div>
            </div>
            {/* Hours Box */}
            <div className="bg-gray-50 rounded-xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition">
              <div className="bg-teal-100 text-teal-700 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="bi bi-headset text-xl"></i>
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Hours of Operation</h4>
                <p className="text-gray-600 text-sm">Sunday-Fri: 9 AM - 6 PM</p>
                <p className="text-gray-600 text-sm">Saturday: 9 AM - 4 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <div className="w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
          width="100%"
          height="500"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Map"
          className="w-full"
        ></iframe>
      </div>

      {/* Contact Form Overlapping Container */}
      <div className="container mx-auto px-4 relative -mt-20 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="relative">
                  <i className="bi bi-person absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>
                <div className="relative">
                  <i className="bi bi-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <i className="bi bi-text-left absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Subject"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  required
                />
              </div>
              <div className="relative">
                <i className="bi bi-chat-dots absolute left-3 top-4 text-gray-400"></i>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write Message..."
                  rows="5"
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;