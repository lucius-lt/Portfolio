import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CMSContext } from '../context/CMSContext';
import { Search, Calendar, Tag, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BlogList = () => {
  const { blogs, cmsLoading } = useContext(CMSContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Extract all unique tags
  const allTags = ['All', ...new Set(blogs.flatMap(blog => blog.tags || []))];

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = 
      selectedTag === 'All' || 
      (blog.tags && blog.tags.includes(selectedTag));

    return matchesSearch && matchesTag;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto py-16 px-4 md:px-0"
    >
      {/* Editorial Header */}
      <header className="mb-20">
        <div className="flex items-center space-x-3 mb-6">
          <span className="font-handwriting text-2xl text-primary transform -rotate-2">
            Thoughts & Processes
          </span>
          <div className="h-[1px] w-12 bg-border"></div>
        </div>
        <h1 className="text-6xl md:text-8xl font-editorial font-bold text-heading leading-tight mb-8">
          The Journal
        </h1>
        <p className="text-xl md:text-2xl text-body font-light max-w-2xl leading-relaxed">
          Scribbles, design systems, technical breakdowns, and bridging the gap between design and front-end engineering.
        </p>
      </header>

      {/* Filter / Search Bar */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-16 pb-8 border-b border-border">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-body opacity-50" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-surface border border-border rounded-full py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading text-sm"
          />
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-hover ${
                selectedTag === tag 
                  ? 'bg-primary border-primary text-white scale-105 shadow' 
                  : 'bg-surface border-border text-body hover:border-primary hover:text-heading'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Cards */}
      {cmsLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <AnimatePresence mode="popLayout">
            {filteredBlogs.map((blog, idx) => (
              <motion.article 
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={blog.id}
                className="group relative flex flex-col h-full"
              >
                {/* Visual Cover image */}
                <Link to={`/blog/${blog.slug}`} className="block overflow-hidden rounded-2xl aspect-video bg-surface mb-6 border border-border cursor-hover relative">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors z-10"></div>
                  {blog.coverImage ? (
                    <img 
                      src={blog.coverImage} 
                      alt={blog.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-body text-sm font-handwriting">
                      *scribble drawing goes here*
                    </div>
                  )}
                </Link>

                <div className="flex items-center space-x-3 text-xs text-body font-semibold mb-4">
                  <span className="flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <Tag className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                    {blog.tags?.slice(0, 2).join(', ') || 'General'}
                  </span>
                </div>

                <h2 className="text-3xl font-editorial font-bold text-heading mb-4 group-hover:text-primary transition-colors leading-tight">
                  <Link to={`/blog/${blog.slug}`} className="cursor-hover">
                    {blog.title}
                  </Link>
                </h2>

                <p className="text-body font-light leading-relaxed mb-6 flex-grow">
                  {blog.shortDescription}
                </p>

                <div>
                  <Link 
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center font-bold text-heading group-hover:text-primary transition-colors border-b border-heading group-hover:border-primary pb-1 cursor-hover"
                  >
                    Read Article 
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {!cmsLoading && filteredBlogs.length === 0 && (
        <div className="text-center py-24">
          <p className="font-handwriting text-3xl text-body opacity-60">
            No journal entries match your query.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BlogList;
