import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500); // Wait a bit after reaching 100%
          return 100;
        }
        return prev + 5; // Fast progression for demo
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-background text-heading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, y: '-100vh', transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } }}
    >
      <div className="text-4xl md:text-6xl font-editorial italic mb-8 overflow-hidden">
        <motion.span
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="inline-block"
        >
          Niyati Soni
        </motion.span>
      </div>
      
      {/* Progress Line */}
      <div className="w-64 h-1 bg-border rounded-full overflow-hidden relative">
        <motion.div
          className="absolute top-0 left-0 h-full bg-primary"
          initial={{ width: '0%' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>
      <div className="mt-4 font-sans text-sm font-medium">{progress}%</div>
    </motion.div>
  );
};

export default Preloader;
