// src/pages/BlogDetails.jsx
import { useState } from "react";

const BlogDetails = () => {
  const [commentForm, setCommentForm] = useState({
    name: "",
    email: "",
    website: "",
    comment: "",
  });

  const handleCommentChange = (e) => {
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    console.log("Comment submitted:", commentForm);
  };

  return (
    <main className="bg-white">
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">
            Blog Details
          </h1>
          <nav className="text-sm">
            <ol className="flex space-x-2">
              <li>
                <a href="/" className="text-gray-500 hover:text-blue-600">
                  Home
                </a>
              </li>
              <li className="text-gray-700">/</li>
              <li className="text-gray-900 font-semibold">Blog Details</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Details Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <article className="max-w-5xl mx-auto">
            {/* Article Header */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2 mb-4">
                <a href="#" className="text-blue-600 text-sm font-semibold">
                  Technology
                </a>
                <a href="#" className="text-blue-600 text-sm font-semibold">
                  Innovation
                </a>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Evolution of User Interface Design: From Skeuomorphism to
                Neumorphism
              </h1>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src="/assets/img/person/person-f-1.webp"
                    alt="Author"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">David Wilson</h4>
                    <span className="text-sm text-gray-500">
                      UI/UX Design Lead
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span>
                    <i className="bi bi-calendar4-week mr-1"></i> April 15, 2025
                  </span>
                  <span>
                    <i className="bi bi-clock mr-1"></i> 10 min read
                  </span>
                  <span>
                    <i className="bi bi-chat-square-text mr-1"></i> 32 Comments
                  </span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-12">
              <img
                src="/assets/img/person/person-f-2.webp"
                alt="UI Design Evolution"
                className="w-full rounded-lg shadow-md"
              />
            </div>

            {/* Article Wrapper (Table of Contents + Content) */}
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Table of Contents - Sidebar */}
              <aside className="lg:w-1/3">
                <div className="sticky top-24 bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
                  <nav>
                    <ul className="space-y-2">
                      <li>
                        <a
                          href="#introduction"
                          className="text-blue-600 font-medium"
                        >
                          Introduction
                        </a>
                      </li>
                      <li>
                        <a href="#skeuomorphism" className="text-gray-600 hover:text-blue-600">
                          The Skeuomorphic Era
                        </a>
                      </li>
                      <li>
                        <a href="#flat-design" className="text-gray-600 hover:text-blue-600">
                          Flat Design Revolution
                        </a>
                      </li>
                      <li>
                        <a href="#material-design" className="text-gray-600 hover:text-blue-600">
                          Material Design
                        </a>
                      </li>
                      <li>
                        <a href="#neumorphism" className="text-gray-600 hover:text-blue-600">
                          Rise of Neumorphism
                        </a>
                      </li>
                      <li>
                        <a href="#future" className="text-gray-600 hover:text-blue-600">
                          Future Trends
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="lg:w-2/3 space-y-12">
                {/* Introduction */}
                <section id="introduction">
                  <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The journey of user interface design has been marked by
                    significant shifts in aesthetic approaches, each era
                    bringing its own unique perspective on how digital
                    interfaces should look and feel.
                  </p>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    From the early days of graphical user interfaces to today's
                    sophisticated design systems, the evolution of UI design
                    reflects not just technological advancement, but also
                    changing user expectations and cultural shifts in how we
                    interact with digital products.
                  </p>
                  <div className="bg-gray-50 border-l-4 border-blue-500 p-5 italic mb-8">
                    <blockquote>
                      <p className="text-gray-700">
                        "Design is not just what it looks like and feels like.
                        Design is how it works."
                      </p>
                      <cite className="text-sm text-gray-500 block mt-2">
                        Steve Jobs
                      </cite>
                    </blockquote>
                  </div>
                </section>

                {/* Skeuomorphic Era */}
                <section id="skeuomorphism">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    The Skeuomorphic Era
                  </h2>
                  <div className="float-right ml-6 mb-4 w-64">
                    <img
                      src="/assets/img/person/person-f-3.webp"
                      alt="Skeuomorphic Design Example"
                      className="rounded-lg shadow"
                    />
                    <figcaption className="text-xs text-gray-400 mt-1 text-center">
                      Early iOS design showcasing skeuomorphic elements
                    </figcaption>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Skeuomorphic design dominated the early years of digital
                    interfaces, attempting to mirror real-world objects in
                    digital form. This approach helped users transition from
                    physical to digital interactions through familiar visual
                    metaphors.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                    <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                      <i className="bi bi-layers text-2xl text-blue-500"></i>
                      <div>
                        <h4 className="font-bold">Realistic Textures</h4>
                        <p className="text-sm text-gray-600">
                          Detailed representations of materials like leather,
                          metal, and paper
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 p-4 bg-gray-50 rounded-lg">
                      <i className="bi bi-lightbulb text-2xl text-blue-500"></i>
                      <div>
                        <h4 className="font-bold">Familiar Metaphors</h4>
                        <p className="text-sm text-gray-600">
                          Digital elements mimicking their physical counterparts
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Flat Design Revolution */}
                <section id="flat-design">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    The Flat Design Revolution
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    As users became more comfortable with digital interfaces,
                    design began moving towards simplification. Flat design
                    emerged as a reaction to the ornate details of
                    skeuomorphism, emphasizing clarity and efficiency.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                    <div className="border rounded-lg p-5 shadow-sm">
                      <div className="text-green-500 mb-2">
                        <i className="bi bi-check-circle text-2xl"></i>
                      </div>
                      <h4 className="font-bold text-lg mb-2">Advantages</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Improved loading times</li>
                        <li>Better scalability</li>
                        <li>Cleaner visual hierarchy</li>
                      </ul>
                    </div>
                    <div className="border rounded-lg p-5 shadow-sm">
                      <div className="text-red-500 mb-2">
                        <i className="bi bi-exclamation-circle text-2xl"></i>
                      </div>
                      <h4 className="font-bold text-lg mb-2">Challenges</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600">
                        <li>Reduced visual cues</li>
                        <li>Potential usability issues</li>
                        <li>Limited depth perception</li>
                      </ul>
                    </div>
                  </div>
                </section>

                {/* Material Design */}
                <section id="material-design">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Material Design: Finding Balance
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Google's Material Design emerged as a comprehensive design
                    system that combined the simplicity of flat design with
                    subtle depth cues, creating a more intuitive user experience
                    while maintaining modern aesthetics.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="text-center p-4 border rounded-lg">
                      <span className="text-3xl font-bold text-blue-600 block mb-2">
                        01
                      </span>
                      <h4 className="font-bold">Physical Properties</h4>
                      <p className="text-sm text-gray-600">
                        Surfaces and edges provide meaningful interaction cues
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <span className="text-3xl font-bold text-blue-600 block mb-2">
                        02
                      </span>
                      <h4 className="font-bold">Bold Graphics</h4>
                      <p className="text-sm text-gray-600">
                        Deliberate color choices and intentional white space
                      </p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <span className="text-3xl font-bold text-blue-600 block mb-2">
                        03
                      </span>
                      <h4 className="font-bold">Meaningful Motion</h4>
                      <p className="text-sm text-gray-600">
                        Animation informs and reinforces user actions
                      </p>
                    </div>
                  </div>
                </section>

                {/* Neumorphism */}
                <section id="neumorphism">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    The Rise of Neumorphism
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Neumorphism represents the latest evolution in UI design,
                    combining aspects of skeuomorphism with modern minimal
                    aesthetics. This style creates soft, extruded surfaces that
                    appear to emerge from the background.
                  </p>
                  <div className="flex gap-4 p-5 bg-blue-50 rounded-lg border border-blue-200">
                    <i className="bi bi-info-circle text-2xl text-blue-600"></i>
                    <div>
                      <h4 className="font-bold text-gray-800">
                        Key Characteristics
                      </h4>
                      <p className="text-gray-600">
                        Neumorphic design relies on subtle shadow work to create
                        the illusion of elements either protruding from or being
                        pressed into their background surface.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Future Trends */}
                <section id="future">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Looking to the Future
                  </h2>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    As we look ahead, UI design continues to evolve with new
                    technologies and user expectations. The future may bring more
                    personalized, adaptive interfaces that respond to individual
                    user preferences and contexts.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                    <div className="text-center p-4">
                      <i className="bi bi-phone text-4xl text-blue-500 block mb-3"></i>
                      <h4 className="font-bold">Adaptive Interfaces</h4>
                      <p className="text-sm text-gray-600">
                        Interfaces that automatically adjust based on user
                        behavior
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <i className="bi bi-eye text-4xl text-blue-500 block mb-3"></i>
                      <h4 className="font-bold">Immersive Experiences</h4>
                      <p className="text-sm text-gray-600">
                        Integration of AR and VR elements in everyday interfaces
                      </p>
                    </div>
                    <div className="text-center p-4">
                      <i className="bi bi-hand-index text-4xl text-blue-500 block mb-3"></i>
                      <h4 className="font-bold">Gesture Controls</h4>
                      <p className="text-sm text-gray-600">
                        Advanced motion and gesture-based interactions
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Article Footer: Share & Tags */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="mb-8">
                <h4 className="text-lg font-bold mb-4">Share this article</h4>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    <i className="bi bi-twitter-x"></i> Share on X
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-full hover:bg-blue-800 transition"
                  >
                    <i className="bi bi-facebook"></i> Share on Facebook
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition"
                  >
                    <i className="bi bi-linkedin"></i> Share on LinkedIn
                  </a>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-bold mb-4">Related Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {["UI Design", "User Experience", "Design Trends", "Innovation", "Technology"].map(
                    (tag) => (
                      <a
                        key={tag}
                        href="#"
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition"
                      >
                        {tag}
                      </a>
                    )
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Community Feedback</h3>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">12</span>
                <span className="text-gray-500">Comments</span>
              </div>
            </div>

            {/* Comment Thread */}
            <div className="space-y-6">
              {/* Main Comment */}
              <div className="border-b border-gray-100 pb-6">
                <div className="flex gap-4">
                  <img
                    src="/assets/img/person/person-f-4.webp"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">
                          Thomas Anderson
                        </h4>
                        <span className="text-xs text-gray-400">
                          <i className="bi bi-clock mr-1"></i> 2 hours ago
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        <i className="bi bi-heart mr-1"></i> 24
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Nullam ac urna eu felis dapibus condimentum sit amet a
                      augue. Sed non neque elit. Sed ut imperdiet nisi. Proin
                      condimentum fermentum nunc.
                    </p>
                    <div className="flex gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                        <i className="bi bi-heart"></i> Like
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                        <i className="bi bi-chat"></i> Reply
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                        <i className="bi bi-share"></i> Share
                      </button>
                    </div>

                    {/* Replies */}
                    <div className="mt-4 pl-6 border-l-2 border-gray-200 space-y-4">
                      <div className="flex gap-4">
                        <img
                          src="/assets/img/person/person-f-5.webp"
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-800">
                                Maria Rodriguez
                              </h4>
                              <span className="text-xs text-gray-400">
                                1 hour ago
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              <i className="bi bi-heart mr-1"></i> 8
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            Vivamus elementum semper nisi. Aenean vulputate
                            eleifend tellus.
                          </p>
                          <div className="flex gap-4 text-sm mt-2">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                              <i className="bi bi-heart"></i> Like
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                              <i className="bi bi-chat"></i> Reply
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <img
                          src="/assets/img/person/person-f-6.webp"
                          alt="Avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-gray-800">
                                Alex Chen
                              </h4>
                              <span className="text-xs text-gray-400">
                                30 minutes ago
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              <i className="bi bi-heart mr-1"></i> 5
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mt-1">
                            Cras dapibus. Vivamus elementum semper nisi.
                          </p>
                          <div className="flex gap-4 text-sm mt-2">
                            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                              <i className="bi bi-heart"></i> Like
                            </button>
                            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                              <i className="bi bi-chat"></i> Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Another Main Comment */}
              <div className="pb-4">
                <div className="flex gap-4">
                  <img
                    src="/assets/img/person/person-f-7.webp"
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">
                          Emily Watson
                        </h4>
                        <span className="text-xs text-gray-400">
                          <i className="bi bi-clock mr-1"></i> 3 hours ago
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        <i className="bi bi-heart mr-1"></i> 15
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Maecenas tempus, tellus eget condimentum rhoncus, sem quam
                      semper libero, sit amet adipiscing sem neque sed ipsum.
                    </p>
                    <div className="flex gap-4 text-sm">
                      <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
                        <i className="bi bi-heart"></i> Like
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                        <i className="bi bi-chat"></i> Reply
                      </button>
                      <button className="flex items-center gap-1 text-gray-500 hover:text-green-600">
                        <i className="bi bi-share"></i> Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Leave a Comment</h3>
              <p className="text-gray-500 text-sm">
                Your email address will not be published. Required fields are
                marked *
              </p>
            </div>
            <form onSubmit={handleCommentSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={commentForm.name}
                    onChange={handleCommentChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={commentForm.email}
                    onChange={handleCommentChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={commentForm.website}
                  onChange={handleCommentChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your website (optional)"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Comment *
                </label>
                <textarea
                  name="comment"
                  rows="5"
                  required
                  value={commentForm.comment}
                  onChange={handleCommentChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Write your thoughts here..."
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogDetails;
