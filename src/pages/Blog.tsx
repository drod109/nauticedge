import React from 'react';
import { Calendar, User2, Clock, ArrowUpRight, Search, Filter, Tag } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/footer/Footer';

const Blog = () => {
  const featuredPost = {
    title: 'The Future of Digital Marine Surveys',
    excerpt: 'How technology is revolutionizing the marine survey industry with digital tools and real-time collaboration.',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=2000&h=800',
    author: 'James Wilson',
    date: 'January 23, 2024',
    readTime: '8 min read',
    category: 'Industry Trends'
  };

  const posts = [
    {
      title: 'Best Practices for Hull Inspections',
      excerpt: 'A comprehensive guide to conducting thorough and efficient hull inspections using modern techniques.',
      image: 'https://images.unsplash.com/photo-1544979590-37e9b47eb705?auto=format&fit=crop&q=80&w=800&h=500',
      author: 'Sarah Chen',
      date: 'January 22, 2024',
      readTime: '6 min read',
      category: 'Technical'
    },
    {
      title: 'Sustainable Maritime Practices',
      excerpt: 'Exploring eco-friendly approaches in marine surveying and vessel maintenance.',
      image: 'https://images.unsplash.com/photo-1530539595977-0aa9890547c4?auto=format&fit=crop&q=80&w=800&h=500',
      author: 'Robert Martinez',
      date: 'January 21, 2024',
      readTime: '5 min read',
      category: 'Sustainability'
    },
    {
      title: 'AI in Marine Surveys',
      excerpt: 'How artificial intelligence is enhancing the accuracy and efficiency of marine surveys.',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=500',
      author: 'Emily Johnson',
      date: 'January 20, 2024',
      readTime: '7 min read',
      category: 'Technology'
    },
    {
      title: 'Maritime Regulations Update 2024',
      excerpt: 'Key changes in maritime regulations and their impact on the survey industry.',
      image: 'https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?auto=format&fit=crop&q=80&w=800&h=500',
      author: 'Michael Brown',
      date: 'January 19, 2024',
      readTime: '10 min read',
      category: 'Regulations'
    },
    {
      title: 'Digital Documentation Tips',
      excerpt: 'Streamline your survey documentation process with these digital tools and techniques.',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&h=500',
      author: 'Lisa Anderson',
      date: 'January 18, 2024',
      readTime: '4 min read',
      category: 'Best Practices'
    },
    {
      title: 'Safety Protocols at Sea',
      excerpt: 'Essential safety guidelines for marine surveyors working on vessels.',
      image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=800&h=500',
      author: 'David Thompson',
      date: 'January 17, 2024',
      readTime: '6 min read',
      category: 'Safety'
    }
  ];

  const categories = [
    'All',
    'Industry Trends',
    'Technical',
    'Technology',
    'Sustainability',
    'Regulations',
    'Safety',
    'Best Practices'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <Navigation />

      {/* Featured Post */}
      <div className="relative min-h-[600px] bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-dark-900 dark:via-dark-950 dark:to-dark-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-cover bg-center opacity-20 animate-ken-burns" style={{ backgroundImage: `url(${featuredPost.image})` }}></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-blue-600/20 dark:from-blue-500/10 dark:via-transparent dark:to-blue-500/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-3xl animate-fade-in">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 mb-4">
              {featuredPost.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-white dark:via-blue-400 dark:to-white animate-gradient mb-6">
              {featuredPost.title}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {featuredPost.excerpt}
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <User2 className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">{featuredPost.author}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">{featuredPost.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
                <span className="text-gray-600 dark:text-gray-400">{featuredPost.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <select className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white/50 dark:bg-dark-800/50 backdrop-blur-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              {categories.map((category) => (
                <option key={category} value={category.toLowerCase()}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className="group bg-white/80 dark:bg-dark-800/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-dark-700/50 overflow-hidden hover:shadow-xl transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <span className="absolute bottom-4 left-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100/90 dark:bg-blue-900/90 text-blue-800 dark:text-blue-400 backdrop-blur-sm">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <User2 className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 dark:text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{post.readTime}</span>
                    </div>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-12 text-center">
          <button className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors group">
            Load More Articles
            <ArrowUpRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;