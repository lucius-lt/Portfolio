import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CMSContext } from '../context/CMSContext';
import { ArrowLeft, Calendar, Tag, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const BlogDetail = () => {
  const { slug } = useParams();
  const { blogs, cmsLoading } = useContext(CMSContext);
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    if (!cmsLoading) {
      const foundBlog = blogs.find(b => b.slug === slug);
      setBlog(foundBlog || null);
    }
  }, [slug, blogs, cmsLoading]);

  if (cmsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
        <h1 className="text-4xl font-editorial font-bold mb-4 text-heading">Article Not Found</h1>
        <p className="text-body mb-8">This page in the journal seems to be blank.</p>
        <Link to="/blog" className="text-primary hover:underline flex items-center cursor-hover font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
        </Link>
      </div>
    );
  }

  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto py-16 px-4 md:px-0 bg-background"
    >
      <Link to="/blog" className="inline-flex items-center text-body hover:text-primary transition-colors mb-12 cursor-hover font-semibold">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Journal
      </Link>

      <header className="mb-12">
        <div className="flex items-center space-x-3 text-xs text-body font-semibold mb-6">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 opacity-70" />
            {new Date(blog.createdAt).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
          <span>•</span>
          <span className="flex items-center">
            <Tag className="w-4 h-4 mr-2 opacity-70" />
            {blog.tags?.join(', ')}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold font-editorial text-heading leading-tight mb-8">
          {blog.title}
        </h1>

        <p className="text-lg md:text-xl text-body font-light leading-relaxed border-l-2 border-primary/40 pl-6 italic">
          {blog.shortDescription}
        </p>
      </header>

      {blog.coverImage && (
        <div className="rounded-2xl overflow-hidden mb-12 shadow-xl border border-border">
          <img src={blog.coverImage} alt={blog.title} className="w-full h-auto object-cover max-h-[50vh]" />
        </div>
      )}

      {/* Markdown Body Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none text-body font-light leading-relaxed prose-headings:font-editorial prose-headings:text-heading prose-headings:font-bold prose-a:text-primary hover:prose-a:text-opacity-80 prose-code:bg-surface prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-primary prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-pre:p-4 prose-pre:rounded-xl">
        <ReactMarkdown>{blog.content}</ReactMarkdown>
      </div>

      <div className="mt-20 pt-8 border-t border-border flex justify-between items-center">
        <div>
          <h4 className="font-editorial text-xl font-bold text-heading">Niyati Soni</h4>
          <p className="text-xs text-body font-semibold">UX/UI Designer & Creative Developer</p>
        </div>
        <Link to="/blog" className="inline-block border-b border-primary text-heading hover:text-primary transition-colors pb-1 cursor-hover font-semibold">
          Read more thoughts
        </Link>
      </div>
    </motion.article>
  );
};

export default BlogDetail;
