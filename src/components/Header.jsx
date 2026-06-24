import { useContext } from 'react';
import { Sun, Moon, Download } from 'lucide-react';
import { Github, Linkedin, Dribbble } from './SocialIcons';
import { ThemeContext } from '../context/ThemeContext';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const scrollToSection = (id) => {
    if (isHome) {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-40 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center py-6 md:h-24 gap-4">
          <Link to="/" className="flex flex-col cursor-hover group text-center md:text-left">
            <span className="font-editorial font-bold text-2xl md:text-3xl text-heading tracking-tight group-hover:text-primary transition-colors">
              Niyati Soni
            </span>
            <span className="font-handwriting text-primary text-xl transform -rotate-2 -mt-1 ml-2 opacity-80">
              designer & developer
            </span>
          </Link>
          
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {isHome ? (
              <>
                <button 
                  onClick={() => scrollToSection('projects')} 
                  className="text-sm font-semibold text-body hover:text-primary transition-colors cursor-hover bg-transparent border-none"
                >
                  Works
                </button>
                <button 
                  onClick={() => scrollToSection('design-gallery')} 
                  className="text-sm font-semibold text-body hover:text-primary transition-colors cursor-hover bg-transparent border-none"
                >
                  Gallery
                </button>
              </>
            ) : (
              <>
                <Link to="/" className="text-sm font-semibold text-body hover:text-primary transition-colors cursor-hover">
                  Works
                </Link>
                <Link to="/" className="text-sm font-semibold text-body hover:text-primary transition-colors cursor-hover">
                  Gallery
                </Link>
              </>
            )}
            
            <Link to="/blog" className="text-sm font-semibold text-body hover:text-primary transition-colors cursor-hover">
              Journal
            </Link>
            
            <Link to="/admin" className="text-sm font-semibold text-body hover:text-primary transition-colors cursor-hover">
              Admin
            </Link>

            <div className="w-[1px] h-4 bg-border hidden sm:block"></div>

            <div className="flex items-center space-x-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-body hover:text-primary transition-colors cursor-hover">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-body hover:text-primary transition-colors cursor-hover">
                <Linkedin className="w-4 h-4" />
              </a>
              
              <button onClick={toggleTheme} className="text-body hover:text-primary transition-colors cursor-hover p-1 bg-transparent border-none">
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </button>

              <a
                href="/resume.pdf"
                download
                className="flex items-center text-xs font-bold text-background px-4 py-2 bg-heading hover:bg-primary rounded-full transition-all cursor-hover"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                Resume
              </a>
            </div>
          </nav>
        </div>
        {/* Decorative line */}
        <div className="w-full h-[1px] bg-border/40 transition-colors duration-500"></div>
      </div>
    </header>
  );
};

export default Header;
