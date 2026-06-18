import React, { useState, useContext } from 'react';
import { CMSContext } from '../context/CMSContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ProjectCard from './ProjectCard';

const ProjectGrid = ({ onProjectClick }) => {
  const { projects, cmsLoading } = useContext(CMSContext);
  const [filter, setFilter] = useState('All');

  // Filter out Graphic Design / Branding from general engineering works
  const designCategories = ['Graphic Design', 'Branding', 'Experimental'];
  const devProjects = projects.filter(p => !designCategories.includes(p.category));

  const categories = [
    'All',
    'UI/UX',
    'Frontend',
    'Backend',
    'Fullstack'
  ];

  const filteredProjects = filter === 'All' 
    ? devProjects 
    : devProjects.filter(p => p.category === filter);

  return (
    <section id="projects" className="py-24 relative bg-background">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <span className="font-handwriting text-3xl text-primary inline-block transform -rotate-2 mb-2">Selected Works</span>
          <h2 className="text-4xl md:text-6xl font-editorial font-bold text-heading">Featured Cases</h2>
        </div>
        
        {/* Filtering System */}
        <div className="flex flex-wrap gap-2 mt-6 md:mt-0 max-w-2xl justify-start md:justify-end">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-hover ${
                filter === cat 
                ? 'bg-primary border-primary text-white scale-105 shadow' 
                : 'bg-surface border-border text-body hover:border-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {cmsLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ProjectCard project={project} idx={idx} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
      
      {filteredProjects.length === 0 && !cmsLoading && (
        <div className="text-center py-20 text-body font-handwriting text-2xl opacity-60">
          No cases found in this category.
        </div>
      )}
    </section>
  );
};

export default ProjectGrid;
