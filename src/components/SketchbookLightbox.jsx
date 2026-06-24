import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SketchbookLightbox = ({ sketches, selectedIndex, isOpen, onClose, onNavigate }) => {
  const overlayRef = useRef(null);
  const closeBtnRef = useRef(null);

  const currentSketch = sketches[selectedIndex] || null;

  // Navigate helpers
  const goNext = useCallback(() => {
    if (selectedIndex < sketches.length - 1) {
      onNavigate(selectedIndex + 1);
    }
  }, [selectedIndex, sketches.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (selectedIndex > 0) {
      onNavigate(selectedIndex - 1);
    }
  }, [selectedIndex, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          goNext();
          break;
        case 'ArrowLeft':
          goPrev();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goNext, goPrev]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = '0';
      document.body.style.right = '0';
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Focus management: trap focus and focus close button on open
  useEffect(() => {
    if (isOpen && closeBtnRef.current) {
      closeBtnRef.current.focus();
    }
  }, [isOpen, selectedIndex]);

  // Click outside image to close
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  // Swipe support for mobile
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const contentVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 30 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300, mass: 0.8 },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: { duration: 0.25, ease: 'easeIn' },
    },
  };

  const navButtonVariants = {
    rest: { scale: 1, opacity: 0.7 },
    hover: { scale: 1.15, opacity: 1 },
    tap: { scale: 0.95 },
  };

  const hasPrev = selectedIndex > 0;
  const hasNext = selectedIndex < sketches.length - 1;

  return (
    <AnimatePresence>
      {isOpen && currentSketch && (
        <motion.div
          ref={overlayRef}
          className="lightbox-overlay"
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={handleOverlayClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing artwork: ${currentSketch.title}`}
        >
          {/* Close button */}
          <motion.button
            ref={closeBtnRef}
            className="lightbox-close-btn"
            onClick={onClose}
            aria-label="Close lightbox"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Previous arrow */}
          {hasPrev && (
            <motion.button
              className="lightbox-nav-btn lightbox-nav-prev"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous artwork"
              variants={navButtonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </motion.button>
          )}

          {/* Next arrow */}
          {hasNext && (
            <motion.button
              className="lightbox-nav-btn lightbox-nav-next"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next artwork"
              variants={navButtonVariants}
              initial="rest"
              whileHover="hover"
              whileTap="tap"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </motion.button>
          )}

          {/* Content container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              className="lightbox-content"
              variants={contentVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="lightbox-image-wrapper">
                <img
                  src={currentSketch.imageUrl}
                  alt={currentSketch.title}
                  className="lightbox-image"
                  draggable={false}
                />
              </div>

              {/* Info */}
              <motion.div
                className="lightbox-info"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
              >
                <h3 className="lightbox-title">{currentSketch.title}</h3>
                {currentSketch.caption && (
                  <p className="lightbox-caption">{currentSketch.caption}</p>
                )}
                <p className="lightbox-counter">
                  {selectedIndex + 1} / {sketches.length}
                </p>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SketchbookLightbox;
