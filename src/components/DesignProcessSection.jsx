import { motion } from 'framer-motion';

const ProcessStep = ({ number, title, description, isLast }) => (
  <div className="relative flex flex-col items-center text-center">
    <div className="w-16 h-16 rounded-full bg-surface border-2 border-primary flex items-center justify-center mb-4 z-10 shadow-md">
      <span className="font-editorial text-2xl font-bold text-heading">{number}</span>
    </div>
    <h3 className="font-bold text-xl text-heading mb-2">{title}</h3>
    <p className="text-body text-sm font-medium">{description}</p>
    
    {!isLast && (
      <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border z-0">
        <svg className="absolute w-full h-10 -top-5" preserveAspectRatio="none">
           <path d="M0,20 Q50,-10 100,20 T200,20" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" className="text-primary/30" />
        </svg>
      </div>
    )}
  </div>
);

const DesignProcessSection = () => {
  const steps = [
    { num: '01', title: 'Research', desc: 'Understanding the problem, users, and market through empathy.' },
    { num: '02', title: 'Wireframing', desc: 'Sketching low-fidelity concepts and user flows on paper.' },
    { num: '03', title: 'UI Design', desc: 'Crafting pixel-perfect, accessible, and beautiful interfaces.' },
    { num: '04', title: 'Development', desc: 'Bringing the design to life with clean, interactive code.' }
  ];

  return (
    <section id="process" className="py-24 my-12 bg-surface/50 rounded-3xl border border-border/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="font-handwriting text-3xl text-primary inline-block transform -rotate-3 mb-2">How I work</span>
          <h2 className="text-4xl md:text-5xl font-editorial font-bold text-heading">The Creative Process</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
            >
              <ProcessStep 
                number={step.num} 
                title={step.title} 
                description={step.desc} 
                isLast={idx === steps.length - 1} 
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default DesignProcessSection
