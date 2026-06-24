import React, { useContext, useState, useCallback } from 'react';
import { CMSContext } from '../context/CMSContext';
import { motion } from 'framer-motion';
import SketchbookLightbox from './SketchbookLightbox';

const SketchbookSection = () => {
  const { sketches, cmsLoading } = useContext(CMSContext);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Only show the first 6 sketches in the grid
  const displayedSketches = sketches.slice(0, 6);

  const handleCardClick = useCallback((idx) => {
    setSelectedIndex(idx);
    setLightboxOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const handleNavigate = useCallback((newIndex) => {
    setSelectedIndex(newIndex);
  }, []);

  return (
    <section id="sketchbook" className="py-24 overflow-hidden relative bg-background">
      <div className="absolute top-1/2 left-0 right-0 h-[400px] bg-primary/5 -skew-y-6 -z-10"></div>
      
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-editorial font-bold text-heading">The Sketchbook</h2>
        <p className="text-body mt-4 font-handwriting text-2xl">Messy layouts, rough wireframes, and random ideas.</p>
      </div>

      <div className="flex flex-wrap justify-center gap-10 relative px-4 max-w-6xl mx-auto">
        {cmsLoading ? (
          <div className="py-12 text-center text-body font-handwriting text-xl">
            Opening pages...
          </div>
        ) : (
          displayedSketches.map((sketch, idx) => {
            const rotations = [-4, 3, -1, 4, -3, 2];
            const rotate = rotations[idx % rotations.length];
            return (
              <motion.div 
                key={sketch.id || idx}
                initial={{ opacity: 0, y: 50, rotate: rotate - 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: rotate }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative w-72 flex-shrink-0 cursor-pointer group"
                onClick={() => handleCardClick(idx)}
                role="button"
                tabIndex={0}
                aria-label={`View artwork: ${sketch.title}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(idx);
                  }
                }}
              >
                {/* Tape decoration */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-white/10 backdrop-blur-md border border-white/10 transform rotate-1 z-10 shadow-sm"></div>
                
                <div className="bg-surface p-4 pb-6 rounded-sm shadow-xl border border-border flex flex-col justify-between h-[360px] transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-1 group-hover:border-primary/30">
                  {/* Hover shine overlay */}
                  <div className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>

                  <div className="w-full h-[240px] overflow-hidden rounded-sm bg-background border border-border">
                    <img 
                      src={sketch.imageUrl} 
                      alt={sketch.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      loading="lazy" 
                    />
                  </div>
                  <div>
                    <p className="font-handwriting text-heading mt-1 text-center text-xl truncate" title={sketch.title}>
                      {sketch.title}
                    </p>
                    {sketch.caption && (
                      <p className="text-[10px] text-body text-center font-mono mt-1 opacity-70" title={sketch.caption}>
                        {sketch.caption}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <SketchbookLightbox
        sketches={displayedSketches}
        selectedIndex={selectedIndex}
        isOpen={lightboxOpen}
        onClose={handleClose}
        onNavigate={handleNavigate}
      />
    </section>
  );
};

export default SketchbookSection;
