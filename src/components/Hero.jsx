import { motion } from 'framer-motion';
import { ArrowDownRight, PenTool } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="py-20 md:py-32 flex flex-col items-center justify-center text-center relative mt-8 min-h-[70vh]">

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-10 md:left-32 opacity-70 hidden md:block"
      >
        <span className="font-handwriting text-2xl text-label transform -rotate-12 inline-block">
          *sketches here*
        </span>
        <svg width="40" height="40" viewBox="0 0 100 100" className="text-primary mt-2 transform rotate-45">
          <path d="M20 80 Q 50 20 80 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-20 right-10 md:right-32 opacity-70 hidden md:block"
      >
        <span className="font-handwriting text-2xl text-primary transform rotate-12 inline-block px-3 py-1 bg-highlightYellow/20 rounded-md">
          Pixel perfect
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl z-10"
      >
        <div className="flex items-center justify-center space-x-3 mb-8">
          <span className="bg-highlightPink text-pink-900 px-4 py-1.5 font-bold text-xs uppercase tracking-wider rounded-full transform -rotate-2 shadow-sm border border-pink-200">
            Available for work
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-heading font-editorial mb-8 relative">
          UI/UX Designer & <br className="hidden md:block" />
          <span className="relative inline-block cursor-hover group">
            <span className="relative z-10">Frontend</span>
            <span className="absolute bottom-2 left-0 w-full h-4 bg-highlightYellow/40 -z-10 transform -rotate-1 group-hover:bg-highlightYellow transition-colors"></span>
          </span>{' '}
          Developer.
        </h1>

        <p className="text-lg md:text-2xl mb-12 leading-relaxed font-light text-body max-w-2xl mx-auto">
          Building products from idea to implementation.
        </p>

        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center justify-center px-8 py-4 bg-[#3B3632] text-[#F8F4EE] rounded-full font-medium hover:bg-[#4A443F] hover:scale-105 transition-all duration-300 shadow-lg cursor-hover"
          >
            Explore Work
            <ArrowDownRight className="w-5 h-5 ml-2 group-hover:animate-bounce" />
          </button>

          <button
            onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
            className="group flex items-center justify-center px-8 py-4 border border-border text-heading rounded-full font-medium hover:bg-surface transition-colors cursor-hover"
          >
            <PenTool className="w-5 h-5 mr-2 text-primary" />
            Let's Talk
          </button>
        </div>
      </motion.div>
    </section>
  )
}

export default HeroSection
