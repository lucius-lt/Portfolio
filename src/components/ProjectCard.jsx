import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ project, idx = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className="w-full"
    >
      <Link 
        to={`/project/${project.slug}`}
        className="block group p-8 rounded-2xl bg-surface border border-border hover:border-primary/80 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5 cursor-hover relative overflow-hidden"
      >
        <div className="absolute -right-4 -top-4 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>
        
        {/* Category & Action icon */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[10px] font-bold tracking-widest text-primary uppercase font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {project.category}
          </span>
          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-body group-hover:text-primary group-hover:border-primary transition-colors duration-300">
            <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        <h3 className="text-3xl font-bold font-editorial text-heading mb-4 group-hover:text-primary transition-colors leading-tight">
          {project.title}
        </h3>
        
        <p className="text-body font-light text-base mb-8 leading-relaxed">
          {project.shortDescription}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {project.tags?.map((t, i) => (
            <span 
              key={i} 
              className="px-3 py-1 bg-background border border-border rounded-md text-xs font-semibold text-body font-mono"
            >
              #{t}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProjectCard;
