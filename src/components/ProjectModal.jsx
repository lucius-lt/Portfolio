import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ExternalLink } from 'lucide-react'
import { Github } from './SocialIcons'

const ProjectModal = ({ project, onClose }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!project) return null

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative bg-surface w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl border border-gray-100 animate-in zoom-in-95 duration-200">
        
        <div className="p-6 md:p-10">
          <div className="flex justify-between items-start mb-8 gap-4 flex-wrap">
            <h2 className="text-3xl sm:text-4xl font-extrabold inline-block bg-highlightYellow/30 text-amber-900 rounded-lg px-3 py-1 transform -rotate-1">
              {project.title}
            </h2>
            <button 
              onClick={onClose}
              className="bg-gray-100 text-body font-bold px-6 py-2 rounded-xl hover:bg-gray-200 transition-colors whitespace-nowrap"
            >
              Back to Home
            </button>
          </div>

          <div className="bg-gray-100 rounded-xl aspect-[21/9] sm:aspect-video mb-8 overflow-hidden relative shadow-inner">
            <img 
              src={project.imageUrls?.[0] || 'https://picsum.photos/seed/placeholder/600/400'} 
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags?.map(tech => (
              <span key={tech} className="px-3 py-1 bg-gray-50 border border-gray-200 text-label text-xs font-bold rounded-full">
                {tech}
              </span>
            ))}
          </div>

          <div 
            className="prose prose-lg max-w-none mb-10 text-body font-medium leading-relaxed prose-headings:font-editorial prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primaryHover transition-colors"
            dangerouslySetInnerHTML={{ __html: project.fullDescription }}
          />

          <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-100">
            {project.demoLink && (
              <a 
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primaryHover text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <ExternalLink size={18} className="mr-2" />
                Live Demo
              </a>
            )}
            {project.githubLink && (
              <a 
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-surface hover:bg-gray-50 text-heading font-bold border border-gray-200 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <Github size={18} className="mr-2" />
                Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(
    modalContent,
    document.getElementById('modal-root')
  )
}

export default ProjectModal
