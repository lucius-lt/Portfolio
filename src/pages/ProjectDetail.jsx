import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CMSContext } from '../context/CMSContext';
import { ArrowLeft, ExternalLink, Loader2, Target, Cpu, CheckCircle, Eye } from 'lucide-react';
import { Github } from '../components/SocialIcons';
import { motion } from 'framer-motion';

const ProjectDetail = () => {
  const { slug } = useParams();
  const { projects, cmsLoading } = useContext(CMSContext);
  const [project, setProject] = useState(null);

  useEffect(() => {
    if (!cmsLoading) {
      const foundProject = projects.find(p => p.slug === slug);
      setProject(foundProject || null);
    }
  }, [slug, projects, cmsLoading]);

  if (cmsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-background">
        <h1 className="text-4xl font-editorial font-bold mb-4 text-heading">Case Study Not Found</h1>
        <p className="text-body mb-8">It seems this sketch was erased or hasn't been drawn yet.</p>
        <Link to="/" className="text-primary hover:underline flex items-center cursor-hover font-semibold">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
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
      className="max-w-4xl mx-auto py-16 px-4 md:px-0 bg-background text-body"
    >
      <Link to="/" className="inline-flex items-center text-body hover:text-primary transition-colors mb-12 cursor-hover font-semibold">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Home
      </Link>

      {/* Case Study Header */}
      <header className="mb-16">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-primary font-mono bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            {project.category || 'UX/UI Case Study'}
          </span>
          <div className="h-[1px] w-12 bg-border"></div>
          <span className="font-handwriting text-2xl text-primary transform -rotate-2">Case Study</span>
        </div>
        
        <h1 className="text-4xl md:text-7xl font-bold font-editorial mb-6 text-heading leading-tight">
          {project.title}
        </h1>
        
        <p className="text-xl md:text-2xl text-body font-light max-w-3xl leading-relaxed mb-8">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-4">
          {project.demoLink && (
            <a 
              href={project.demoLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-6 py-3 bg-heading text-background rounded-full font-bold hover:bg-primary hover:text-white transition-colors cursor-hover shadow-md"
            >
              Live Project <ExternalLink className="w-4 h-4 ml-2" />
            </a>
          )}
          {project.githubLink && (
            <a 
              href={project.githubLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-6 py-3 border border-border bg-surface text-heading rounded-full font-bold hover:border-primary transition-colors cursor-hover"
            >
              Source Code <Github className="w-4 h-4 ml-2" />
            </a>
          )}
        </div>
      </header>

      {/* Main Cover Image */}
      {project.imageUrls && project.imageUrls.length > 0 && (
        <div className="rounded-2xl overflow-hidden mb-20 shadow-2xl border border-border relative">
          <img src={project.imageUrls[0]} alt={project.title} className="w-full h-auto object-cover max-h-[60vh]" />
        </div>
      )}

      {/* Brief / Metadata Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20 border-t border-b border-border py-12">
        <div className="md:col-span-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-heading mb-4 font-mono">Tech Stack</h3>
          <div className="flex flex-wrap gap-2 md:flex-col md:items-start">
            {project.tags?.map((tech, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-surface border border-border rounded text-xs font-mono text-body">
                {tech}
              </span>
            ))}
          </div>

          <div className="mt-8 hidden md:block opacity-50 transform -rotate-3">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M10,20 Q40,5 70,20 T90,50" />
            </svg>
            <p className="font-handwriting text-primary text-sm mt-1">Design + Build</p>
          </div>
        </div>

        <div className="md:col-span-3 prose prose-lg dark:prose-invert max-w-none text-body font-light leading-relaxed prose-headings:font-editorial">
          {project.fullDescription ? (
            <div dangerouslySetInnerHTML={{ __html: project.fullDescription }} />
          ) : (
            <p className="text-body italic">Description is currently being drafted...</p>
          )}
        </div>
      </div>

      {/* UX CASE STUDY SECTIONS */}
      <div className="space-y-20">
        
        {/* Problem Statement */}
        {project.problemStatement && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            <div className="md:col-span-4 flex items-center md:items-start space-x-3 md:space-x-0 md:flex-col md:space-y-2">
              <Target className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-editorial font-bold text-heading">01 / The Problem</h2>
            </div>
            <div className="md:col-span-8 bg-surface p-8 rounded-2xl border border-border shadow-sm text-body font-light leading-relaxed">
              <p>{project.problemStatement}</p>
            </div>
          </motion.section>
        )}

        {/* Process */}
        {project.process && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            <div className="md:col-span-4 flex items-center md:items-start space-x-3 md:space-x-0 md:flex-col md:space-y-2">
              <Cpu className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-editorial font-bold text-heading">02 / The Process</h2>
            </div>
            <div className="md:col-span-8 text-body font-light leading-relaxed">
              <p className="mb-4">{project.process}</p>
              {project.architecture && (
                <div className="mt-6 p-6 bg-surface border border-dashed border-border rounded-xl font-mono text-sm">
                  <span className="block font-bold text-heading mb-2">Systems Architecture:</span>
                  {project.architecture}
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Wireframes & Ideation */}
        {project.wireframes && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            <div className="md:col-span-4 flex items-center md:items-start space-x-3 md:space-x-0 md:flex-col md:space-y-2">
              <Eye className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-editorial font-bold text-heading">03 / Wireframes</h2>
            </div>
            <div className="md:col-span-8">
              <div className="p-4 bg-surface rounded-2xl border border-border shadow-md overflow-hidden relative">
                {/* Polaroid Binder tape */}
                <div className="absolute top-0 right-12 w-16 h-5 bg-white/5 border border-white/10 transform rotate-6 z-10"></div>
                <img src={project.wireframes} alt="Wireframes Scan" className="w-full h-auto rounded-lg" loading="lazy" />
              </div>
            </div>
          </motion.section>
        )}

        {/* Final Designs */}
        {project.finalDesigns && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8"
          >
            <div className="md:col-span-4 flex items-center md:items-start space-x-3 md:space-x-0 md:flex-col md:space-y-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-editorial font-bold text-heading">04 / Final Interface</h2>
            </div>
            <div className="md:col-span-8">
              <div className="p-4 bg-surface rounded-2xl border border-border shadow-md overflow-hidden">
                <img src={project.finalDesigns} alt="Final UI Designs" className="w-full h-auto rounded-lg" loading="lazy" />
              </div>
            </div>
          </motion.section>
        )}

        {/* Outcomes */}
        {project.outcomes && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            <div className="md:col-span-4 flex items-center md:items-start space-x-3 md:space-x-0 md:flex-col md:space-y-2">
              <CheckCircle className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-editorial font-bold text-heading">05 / The Outcome</h2>
            </div>
            <div className="md:col-span-8 bg-surface p-8 rounded-2xl border border-border shadow-sm text-body font-light leading-relaxed">
              <p>{project.outcomes}</p>
            </div>
          </motion.section>
        )}

      </div>

      {/* Additional Showcase Images */}
      {project.imageUrls && project.imageUrls.length > 1 && (
        <div className="space-y-16 mt-32">
          <h2 className="text-3xl font-editorial font-bold text-center mb-8 text-heading">Visual Gallery</h2>
          {project.imageUrls.slice(1).map((imgUrl, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-4 bg-surface rounded-2xl border border-border shadow-xl overflow-hidden max-w-3xl mx-auto"
            >
              <img src={imgUrl} alt={`Showcase ${idx + 1}`} className="w-full h-auto rounded-lg" loading="lazy" />
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Footer reflection */}
      <div className="mt-32 text-center pb-20 border-t border-border pt-16">
        <p className="font-handwriting text-3xl text-body mb-8">"Every pixel tells a story."</p>
        <Link to="/" className="inline-block border-b border-primary text-heading font-bold pb-1 hover:text-primary transition-colors cursor-hover">
          Explore More Works
        </Link>
      </div>

    </motion.article>
  );
};

export default ProjectDetail;
