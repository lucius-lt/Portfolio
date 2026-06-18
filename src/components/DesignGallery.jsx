import React, { useState, useContext } from 'react';
import { CMSContext } from '../context/CMSContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ArrowLeft, ArrowRight, Layers } from 'lucide-react';

const DesignGallery = () => {
  const { projects } = useContext(CMSContext);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Filter for design works (Graphic Design, Branding, Experimental)
  const designCategories = ['Graphic Design', 'Branding', 'Experimental'];
  const designWorks = projects.filter(p => designCategories.includes(p.category));

  // Extract subcategories (e.g. Tags) for sub-filtering
  const subCategories = ['All', ...new Set(designWorks.flatMap(w => w.tags || []))];

  const filteredWorks = designWorks.filter(work => {
    return activeCategory === 'All' || (work.tags && work.tags.includes(activeCategory));
  });

  // Split into columns for vertical masonry layout (3 columns on desktop, 2 on tablet, 1 on mobile)
  const col1 = filteredWorks.filter((_, idx) => idx % 3 === 0);
  const col2 = filteredWorks.filter((_, idx) => idx % 3 === 1);
  const col3 = filteredWorks.filter((_, idx) => idx % 3 === 2);

  const openLightbox = (index) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'unset';
  };

  const navigateLightbox = (direction) => {
    if (lightboxIndex === null) return;
    let newIndex = lightboxIndex + direction;
    if (newIndex < 0) newIndex = filteredWorks.length - 1;
    if (newIndex >= filteredWorks.length) newIndex = 0;
    setLightboxIndex(newIndex);
  };

  const currentWork = lightboxIndex !== null ? filteredWorks[lightboxIndex] : null;

  return (
    <section id="design-gallery" className="py-24 relative bg-background">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <span className="font-handwriting text-3xl text-primary inline-block transform -rotate-2 mb-2">Visual Works</span>
          <h2 className="text-4xl md:text-6xl font-editorial font-bold text-heading">Design Gallery</h2>
        </div>

        {/* Sub-filtering */}
        <div className="flex flex-wrap gap-2 mt-6 md:mt-0 max-w-2xl justify-start md:justify-end">
          {subCategories.slice(0, 8).map(tag => (
            <button
              key={tag}
              onClick={() => setActiveCategory(tag)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-hover ${
                activeCategory === tag 
                  ? 'bg-primary border-primary text-white scale-105 shadow' 
                  : 'bg-surface border-border text-body hover:border-primary'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Masonry Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1 */}
        <div className="grid gap-6">
          {col1.map((work) => {
            const globalIndex = filteredWorks.findIndex(w => w.id === work.id);
            return (
              <MasonryCard 
                key={work.id} 
                work={work} 
                onClick={() => openLightbox(globalIndex)} 
              />
            );
          })}
        </div>

        {/* Column 2 */}
        <div className="grid gap-6">
          {col2.map((work) => {
            const globalIndex = filteredWorks.findIndex(w => w.id === work.id);
            return (
              <MasonryCard 
                key={work.id} 
                work={work} 
                onClick={() => openLightbox(globalIndex)} 
              />
            );
          })}
        </div>

        {/* Column 3 */}
        <div className="grid gap-6">
          {col3.map((work) => {
            const globalIndex = filteredWorks.findIndex(w => w.id === work.id);
            return (
              <MasonryCard 
                key={work.id} 
                work={work} 
                onClick={() => openLightbox(globalIndex)} 
              />
            );
          })}
        </div>
      </div>

      {filteredWorks.length === 0 && (
        <div className="text-center py-20 text-body font-handwriting text-2xl opacity-60">
          No design works found matching this tag.
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentWork && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 md:p-8"
          >
            {/* Background click to close */}
            <div className="absolute inset-0 cursor-zoom-out" onClick={closeLightbox}></div>

            {/* Top Bar Actions */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center text-white z-10">
              <div className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-widest text-primary font-mono">{currentWork.category}</span>
                <h3 className="text-xl font-bold font-editorial">{currentWork.title}</h3>
              </div>
              <button 
                onClick={closeLightbox}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-hover"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Left Nav Button */}
            <button 
              onClick={() => navigateLightbox(-1)}
              className="absolute left-4 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white z-10 transition-colors cursor-hover hidden md:block"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Lightbox Image Container */}
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="max-w-4xl max-h-[75vh] w-full flex items-center justify-center relative overflow-hidden"
            >
              {currentWork.imageUrls?.[0] ? (
                <img 
                  src={currentWork.imageUrls[0]} 
                  alt={currentWork.title} 
                  className="w-auto h-auto max-w-full max-h-[75vh] rounded-lg object-contain shadow-2xl" 
                />
              ) : (
                <div className="w-[600px] h-[400px] bg-neutral-900 flex items-center justify-center text-white">
                  No preview available
                </div>
              )}
            </motion.div>

            {/* Right Nav Button */}
            <button 
              onClick={() => navigateLightbox(1)}
              className="absolute right-4 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white z-10 transition-colors cursor-hover hidden md:block"
            >
              <ArrowRight className="w-6 h-6" />
            </button>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-6 left-6 right-6 text-center text-white/80 max-w-2xl mx-auto z-10">
              <p className="text-sm font-light leading-relaxed mb-4">
                {currentWork.shortDescription}
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {currentWork.tags?.map(t => (
                  <span key={t} className="px-2.5 py-1 bg-white/10 text-white rounded text-[10px] font-semibold tracking-wider font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const MasonryCard = ({ work, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-surface cursor-hover shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex flex-col justify-end p-6 text-white">
        <span className="text-[10px] font-bold tracking-widest text-primary uppercase font-mono mb-1">{work.category}</span>
        <h4 className="text-xl font-bold font-editorial mb-2">{work.title}</h4>
        <p className="text-xs text-white/80 font-light truncate mb-3">{work.shortDescription}</p>
        <div className="flex items-center text-xs font-bold text-primary">
          <ZoomIn className="w-4 h-4 mr-1.5" /> View Project
        </div>
      </div>

      <div className="w-full overflow-hidden bg-background">
        {work.imageUrls?.[0] ? (
          <img 
            src={work.imageUrls[0]} 
            alt={work.title} 
            className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
            loading="lazy"
          />
        ) : (
          <div className="w-full aspect-[4/3] flex items-center justify-center text-body font-handwriting">
            *sketch illustration*
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DesignGallery;
