import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import { ThemeProvider } from './context/ThemeContext'
import CustomCursor from './components/CustomCursor'
import Preloader from './components/Preloader'
import { AnimatePresence, motion } from 'framer-motion'

// Layout & Components
import Header from './components/Header'
import HeroSection from './components/Hero'
import WhatIDoSection from './components/WhatIDo'
import ProjectGrid from './components/ProjectGrid'
import ContactSection from './components/ContactSection'
import Footer from './components/Footer'

// New Sections
import AboutSection from './components/AboutSection'
import DesignProcessSection from './components/DesignProcessSection'
import SketchbookSection from './components/SketchbookSection'
import DesignGallery from './components/DesignGallery'

// Context
import { CMSProvider } from './context/CMSContext'

// Pages
import AdminDashboard from './pages/AdminDashboard'
import AdminLogin from './pages/AdminLogin'
import ProjectDetail from './pages/ProjectDetail'

import ProtectedRoute from './components/admin/ProtectedRoute'

const SectionWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const MainPortfolio = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.6 }}
      className="space-y-12 md:space-y-24"
    >
      <HeroSection />
      <SectionWrapper><WhatIDoSection /></SectionWrapper>
      <SectionWrapper><AboutSection /></SectionWrapper>
      <SectionWrapper><DesignProcessSection /></SectionWrapper>
      <SectionWrapper><ProjectGrid /></SectionWrapper>
      <SectionWrapper><DesignGallery /></SectionWrapper>
      <SectionWrapper><SketchbookSection /></SectionWrapper>
      <SectionWrapper><ContactSection /></SectionWrapper>
    </motion.div>
  )
}

function App() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  // Initialize Lenis for smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <ThemeProvider>
      <CMSProvider>
        {/* Fix exit transition by keeping AnimatePresence in App.jsx */}
        <AnimatePresence>
          {loading && !isAdminRoute && (
            <Preloader onComplete={() => setLoading(false)} />
          )}
        </AnimatePresence>

        {!isAdminRoute && <CustomCursor />}

        <div className="min-h-screen bg-background text-body relative transition-colors duration-500">
          {/* Grain Overlay */}
          <div className="grain-overlay"></div>

          {/* Floating subtle doodle */}
          {!isAdminRoute && (
            <div className="fixed top-1/4 right-8 md:right-16 opacity-10 pointer-events-none animate-pulse" style={{ animationDuration: '4s' }}>
              <svg width="60" height="60" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M20,50 Q40,20 60,50 T90,30" />
                <path d="M30,70 Q50,90 70,70 T100,50" />
                <circle cx="20" cy="30" r="3" fill="currentColor" />
                <circle cx="80" cy="80" r="2" fill="currentColor" />
              </svg>
            </div>
          )}

          {!isAdminRoute && (
            <>
              {/* Decorative vertical line */}
              <div className="hidden md:block absolute left-4 lg:left-8 top-12 bottom-12 w-[1px] bg-border/40 z-0 transition-colors duration-500">
                <div className="absolute top-0 -left-[3.5px] w-2 h-2 rounded-full bg-border transition-colors duration-500"></div>
                <div className="absolute bottom-0 -left-[3.5px] w-2 h-2 rounded-full bg-border transition-colors duration-500"></div>
              </div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative min-h-screen flex flex-col z-10">
                <Header />
                <main className="flex-grow pt-24">
                  <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                      <Route path="/" element={<MainPortfolio />} />
                      <Route path="/project/:slug" element={<ProjectDetail />} />

                    </Routes>
                  </AnimatePresence>
                </main>

                {/* Decorative horizontal line above footer */}
                <div className="w-[90%] mx-auto h-[1px] bg-border/40 mt-16 mb-8 transition-colors duration-500"></div>
              </div>
              <div className="bg-surface/50 pb-8 transition-colors duration-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <Footer />
                </div>
              </div>
            </>
          )}

          {/* Admin Protected Dashboard Routes */}
          {isAdminRoute && (
            <Routes>
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
            </Routes>
          )}
        </div>
      </CMSProvider>
    </ThemeProvider>
  )
}

export default App
