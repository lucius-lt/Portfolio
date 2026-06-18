import { motion } from 'framer-motion';
import { Pencil, Eye, Code, Layout } from 'lucide-react';

const WhatIDoSection = () => {
  const skills = [
    {
      title: 'UI/UX Design',
      desc: 'Crafting intuitive, accessible, and beautiful user interfaces that solve real problems.',
      icon: <Eye className="w-8 h-8 text-highlightBlue" />,
      bg: 'bg-[#1E2A2F]', // Dark navy
      textColor: 'text-[#F9F6F0]',
      tag: 'Figma / FigJam'
    },
    {
      title: 'Graphic Design',
      desc: 'Creating strong brand identities, posters, and visual communication materials.',
      icon: <Layout className="w-8 h-8 text-highlightPink" />,
      bg: 'bg-[#F9F6F0]', // Warm beige
      textColor: 'text-[#1E2A2F]',
      tag: 'Illustrator / PS'
    },
    {
      title: 'Frontend Dev',
      desc: 'Translating designs into responsive, interactive, and performant web applications.',
      icon: <Code className="w-8 h-8 text-primary" />,
      bg: 'bg-[#1a1a1a]', // Almost black
      textColor: 'text-white',
      tag: 'React / JS / CSS'
    },
    {
      title: 'Sketch & Concept',
      desc: 'Brainstorming, wireframing, and rapid prototyping to validate ideas quickly.',
      icon: <Pencil className="w-8 h-8 text-amber-600" />,
      bg: 'bg-[#ffeed4]', // Very light yellow/orange
      textColor: 'text-[#59390a]',
      tag: 'Pen & Paper'
    }
  ];

  return (
    <section id="what-i-do" className="py-24 mt-12 relative">
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-end">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-editorial font-bold text-heading">
            Multidisciplinary <br/><span className="italic font-handwriting text-primary text-4xl transform -rotate-2 inline-block">creative</span>
          </h2>
        </div>
        <div className="max-w-md">
           <p className="text-body font-medium leading-relaxed">
            I don't just specialize in one thing. I believe that understanding the entire product lifecycle—from the first sketch to the final line of code—results in better experiences.
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {skills.map((skill, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 }}
            className={`${skill.bg} ${skill.textColor} p-8 rounded-2xl flex flex-col h-[320px] shadow-sm hover:-translate-y-2 transition-transform cursor-hover border border-border/20`}
          >
            <div className="flex justify-between items-start mb-auto">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                {skill.icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm">
                {skill.tag}
              </span>
            </div>
            
            <div>
              <h3 className="font-editorial font-bold text-2xl mb-3 leading-tight">{skill.title}</h3>
              <p className="font-medium text-sm opacity-80 leading-relaxed">{skill.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default WhatIDoSection
