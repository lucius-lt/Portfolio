import { motion } from 'framer-motion';
import { Pencil, Eye, Code, Layout } from 'lucide-react';

const WhatIDoSection = () => {
  const skills = [
    {
      title: 'Product Design',
      desc: 'UX Research, User Flows, Wireframing, and creating the structural foundation.',
      icon: <Pencil className="w-8 h-8 text-[#D97706]" />,
      bg: 'bg-[#F7E8CF]',
      textColor: 'text-[#5B4321]',
      tag: 'Strategy'
    },
    {
      title: 'UI & Interaction',
      desc: 'Prototyping, Design Systems, Accessibility, and crafting beautiful interfaces.',
      icon: <Eye className="w-8 h-8 text-[#B9D7E8]" />,
      bg: 'bg-[#13232B]',
      textColor: 'text-[#F8F4EE]',
      tag: 'Visuals'
    },
    {
      title: 'Frontend Dev',
      desc: 'React, JavaScript, Tailwind CSS, Firebase, and responsive web development.',
      icon: <Layout className="w-8 h-8 text-[#F5B8C5]" />,
      bg: 'bg-[#F8F4EE]',
      textColor: 'text-[#232323]',
      tag: 'Client-side'
    },
    {
      title: 'Backend Dev',
      desc: 'Java, Spring Boot, MongoDB, REST APIs, Git, and robust server architecture.',
      icon: <Code className="w-8 h-8 text-[#F28A2E]" />,
      bg: 'bg-[#141414]',
      textColor: 'text-[#F8F4EE]',
      tag: 'Server-side'
    }
  ];
  return (
    <section id="what-i-do" className="py-24 mt-12 relative">
      <div className="flex flex-col md:flex-row gap-8 mb-12 items-end">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-editorial font-bold text-heading">
            Multidisciplinary <br /><span className="italic font-handwriting text-primary text-4xl transform -rotate-2 inline-block">creative</span>
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
            className={`${skill.bg} ${skill.textColor} p-8 rounded-2xl flex flex-col h-[320px] shadow-sm hover:shadow-md transition-shadow duration-300 border border-border/20`}
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
              <div>
                <h3
                  className={`font-editorial font-bold text-2xl mb-3 leading-tight ${idx === 1 || idx === 3
                    ? 'text-[#F8F4EE]'
                    : 'text-[#232323]'
                    }`}
                >
                  {skill.title}
                </h3>

                <p
                  className={`font-medium text-sm leading-relaxed ${idx === 1 || idx === 3
                    ? 'text-[#F8F4EE]/90'
                    : 'text-[#4A4A4A]'
                    }`}
                >
                  {skill.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default WhatIDoSection
