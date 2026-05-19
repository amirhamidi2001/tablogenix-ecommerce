// src/pages/Blog.jsx
import { useState } from "react";

const tabPostsData = {
  topStories: [
    { id: 1, category: "Science", title: "Maximizing ROI Through Strategic Resource Allocation", author: "Michael Davidson", img: "/assets/img/person/person-f-6.webp" },
    { id: 2, category: "Travel", title: "Leveraging Big Data Analytics for Market Intelligence", author: "Emily Richardson", img: "/assets/img/person/person-f-2.webp" },
    { id: 3, category: "Politics", title: "Enhancing Customer Experience Through Digital Innovation", author: "Daniel Cooper", img: "/assets/img/person/person-f-3.webp" },
    { id: 4, category: "Technology", title: "Transforming Business Models Through Digital Innovation", author: "Rachel Stevens", img: "/assets/img/person/person-f-4.webp" },
    { id: 5, category: "Finance", title: "Strategic Investment Planning for Sustainable Growth", author: "Andrew Phillips", img: "/assets/img/person/person-f-5.webp" },
  ],
  trending: [
    { id: 1, category: "Science", title: "Implementing Sustainable Business Practices", author: "Alexandra Foster", img: "/assets/img/person/person-f-4.webp" },
    { id: 2, category: "Style", title: "Optimizing Supply Chain Management", author: "Christopher Wells", img: "/assets/img/person/person-f-5.webp" },
    { id: 3, category: "Politics", title: "Developing Strategic Partnerships", author: "Victoria Palmer", img: "/assets/img/person/person-f-6.webp" },
    { id: 4, category: "Marketing", title: "Enhancing Brand Value Through Customer-Centric Strategies", author: "Sophia Rodriguez", img: "/assets/img/person/person-f-7.webp" },
    { id: 5, category: "Leadership", title: "Building High-Performance Teams", author: "Nathan Brooks", img: "/assets/img/person/person-f-8.webp" },
  ],
  latest: [
    { id: 1, category: "Health", title: "Accelerating Innovation Through Cross-functional Collaboration", author: "Benjamin Carter", img: "/assets/img/person/person-f-7.webp" },
    { id: 2, category: "Business", title: "Driving Business Growth Through Strategic Digital Initiatives", author: "Olivia Martinez", img: "/assets/img/person/person-f-8.webp" },
    { id: 3, category: "Sports", title: "Maximizing Operational Efficiency Through Process Optimization", author: "William Turner", img: "/assets/img/person/person-f-9.webp" },
    { id: 4, category: "Innovation", title: "Leveraging AI Solutions for Business Process Automation", author: "Isabella Clark", img: "/assets/img/person/person-f-10.webp" },
    { id: 5, category: "Strategy", title: "Implementing Agile Framework for Project Management Excellence", author: "Marcus Henderson", img: "/assets/img/person/person-f-6.webp" },
  ],
};

const blogPosts = [
  { id: 1, category: "Politics", title: "Dolorum optio tempore voluptas dignissimos", author: "Maria Doe", date: "Jan 1, 2022", img: "/assets/img/person/person-f-2.webp", authorImg: "/assets/img/person/person-f-2.webp" },
  { id: 2, category: "Sports", title: "Nisi magni odit consequatur autem nulla dolorem", author: "Allisa Mayer", date: "Jun 5, 2022", img: "/assets/img/person/person-f-6.webp", authorImg: "/assets/img/person/person-f-6.webp" },
  { id: 3, category: "Entertainment", title: "Possimus soluta ut id suscipit ea ut in quo quia et soluta", author: "Mark Dower", date: "Jun 22, 2022", img: "blog/blog-post-3.webp", authorImg: "person/person-m-10.webp" },
  { id: 4, category: "Sports", title: "Non rem rerum nam cum quo minus olor distincti", author: "Lisa Neymar", date: "Jun 30, 2022", img: "blog/blog-post-4.webp", authorImg: "person/person-f-14.webp" },
  { id: 5, category: "Politics", title: "Accusamus quaerat aliquam qui debitis facilis consequatur", author: "Denis Peterson", date: "Jan 30, 2022", img: "blog/blog-post-5.webp", authorImg: "person/person-m-11.webp" },
  { id: 6, category: "Entertainment", title: "Distinctio provident quibusdam numquam aperiam aut", author: "Mika Lendon", date: "Feb 14, 2022", img: "blog/blog-post-6.webp", authorImg: "person/person-f-15.webp" },
];

const Blog = () => {
  const [activeTab, setActiveTab] = useState("topStories");

  const getTabData = () => {
    if (activeTab === "topStories") return tabPostsData.topStories;
    if (activeTab === "trending") return tabPostsData.trending;
    return tabPostsData.latest;
  };

  return (
    <main className="bg-white">
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 md:mb-0">Blog</h1>
          <nav className="text-sm">
            <ol className="flex space-x-2">
              <li><a href="/" className="text-gray-500 hover:text-blue-600">Home</a></li>
              <li className="text-gray-700">/</li>
              <li className="text-gray-900 font-semibold">Blog</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Blog Hero Section - Featured + Secondary + Sidebar */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area (2/3 width on lg) */}
            <div className="lg:col-span-2">
              {/* Featured Article */}
              <article className="relative mb-8 rounded-lg overflow-hidden shadow-lg group">
                <img src="/assets/img/person/person-f-6.webp" alt="Featured post" className="w-full h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="flex items-center space-x-2 text-sm mb-2">
                      <span className="bg-red-600 px-2 py-1 rounded text-xs">Politics</span>
                      <span>02/15/2024</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      <a href="#" className="hover:underline">Optimizing Strategic Initiatives Through Cross-Functional Collaboration</a>
                    </h2>
                    <p className="text-gray-200 mb-3">Leveraging core competencies to drive sustainable growth...</p>
                    <div className="text-sm">by <a href="#" className="hover:underline">Jennifer Mitchell</a></div>
                  </div>
                </div>
              </article>

              {/* Secondary Articles (2 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2].map((item) => (
                  <article key={item} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition">
                    <img src={`/assets/img/person/person-f-6.webp`} alt="Post" className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <span className="text-blue-600 font-semibold">{item === 1 ? "Politics" : "Business"}</span>
                        <span>{item === 1 ? "03/21/2024" : "01/30/2024"}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">
                        <a href="#" className="hover:text-blue-600">
                          {item === 1 ? "Implementing Agile Methodologies for Enhanced Business Performance" : "Streamlining Operations Through Digital Transformation Solutions"}
                        </a>
                      </h3>
                      <div className="text-sm text-gray-600">by <a href="#" className="hover:text-blue-600">{item === 1 ? "Robert Anderson" : "Sarah Thompson"}</a></div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar with Tabs */}
            <div>
              <div className="bg-white rounded-lg shadow-md p-5">
                {/* Tabs Header */}
                <div className="flex border-b border-gray-200 mb-4">
                  {[
                    { id: "topStories", label: "Top stories" },
                    { id: "trending", label: "Trending News" },
                    { id: "latest", label: "Latest News" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 py-2 text-center font-semibold transition ${activeTab === tab.id
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  {getTabData().map((post) => (
                    <article key={post.id} className="flex gap-3 items-center">
                      <div className="w-1/3">
                        <img src={`/assets/img/${post.img}`} alt={post.title} className="w-full h-20 object-cover rounded-md" />
                      </div>
                      <div className="w-2/3">
                        <span className="text-xs text-blue-600 font-semibold">{post.category}</span>
                        <h4 className="text-sm font-bold mt-1"><a href="#" className="hover:text-blue-600 line-clamp-2">{post.title}</a></h4>
                        <div className="text-xs text-gray-500 mt-1">by {post.author}</div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <img src={`/assets/img/${post.img}`} alt={post.title} className="w-full h-56 object-cover" />
                <div className="p-5">
                  <p className="text-blue-600 text-sm font-semibold mb-2">{post.category}</p>
                  <h2 className="text-xl font-bold mb-3">
                    <a href="#" className="hover:text-blue-600">{post.title}</a>
                  </h2>
                  <div className="flex items-center gap-3">
                    <img src={`/assets/img/${post.authorImg}`} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium">{post.author}</p>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <nav className="flex justify-center">
            <ul className="flex items-center space-x-1">
              <li>
                <a href="#" className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center gap-1">
                  <i className="bi bi-arrow-left"></i>
                  <span className="hidden sm:inline">Previous</span>
                </a>
              </li>
              {[1, 2, 3, "...", 8, 9, 10].map((page, idx) => (
                <li key={idx}>
                  {page === "..." ? (
                    <span className="px-3 py-2">...</span>
                  ) : (
                    <a href="#" className={`px-3 py-2 rounded-md border ${page === 1 ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 hover:bg-gray-100"}`}>
                      {page}
                    </a>
                  )}
                </li>
              ))}
              <li>
                <a href="#" className="px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 flex items-center gap-1">
                  <span className="hidden sm:inline">Next</span>
                  <i className="bi bi-arrow-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </section>
    </main>
  );
};

export default Blog;
