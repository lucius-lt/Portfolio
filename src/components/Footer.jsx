import { Star } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center space-x-2">
        <Star className="w-6 h-6 fill-primary text-primary" />
        <span className="font-bold text-xl text-heading">Niyati Soni Portfolio</span>
      </div>

      {/* <div className="flex items-center space-x-4">
        <a href="#" className="bg-surface border border-gray-200 text-body text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-50 hover:text-primary transition-all shadow-sm">
          Twitter X
        </a>
        <a href="#" className="bg-surface border border-gray-200 text-body text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-50 hover:text-primary transition-all shadow-sm">
          LinkedIn
        </a>
        <a href="#" className="bg-surface border border-gray-200 text-body text-xs font-bold px-4 py-2 rounded-xl hover:bg-gray-50 hover:text-primary transition-all shadow-sm">
          Instagram
        </a>
      </div> */}

      <div className="flex flex-col items-start md:items-end text-[10px] font-medium text-label md:text-right space-y-1">
        <p>Designed in Figma. Built with React + Tailwind.</p>
        <p>Powered by Firebase. Animated with Framer Motion.</p>
      </div>
    </footer>
  )
}

export default Footer
