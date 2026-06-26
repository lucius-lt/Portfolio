import { motion } from 'framer-motion';
import { PenTool, Heart, Coffee } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 my-12 relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-highlightYellow/10 rounded-full blur-3xl -z-10"></div>

      <div className="flex flex-col md:flex-row gap-16 items-center">

        {/* Sketchbook Image / Visual */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 w-full relative"
        >
          {/* Paper Background */}
          <div className=" rounded-sm shadow-xl p-8 transform -rotate-2 relative border border-[#e8e4db]  aspect-square max-w-md mx-auto">
            {/* Binder rings */}
            <div className="absolute left-2 top-0 bottom-0 w-4 flex flex-col justify-between py-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-4 border-gray-400 bg-gray-200 shadow-sm -ml-4"></div>
              ))}
            </div>

            <div className="pl-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="font-handwriting text-3xl text-primary mb-4 transform -rotate-2">Behind the screens...</h3>
                <p className="font-sans text-body leading-relaxed mb-4 text-sm font-medium">
                  Hi, I'm Niyati! I love turning ideas into digital products—from rough sketches and wireframes to responsive, production-ready applications.
                </p>
                <p className="font-sans text-body leading-relaxed mb-4 text-sm font-medium">
                  Whether I'm designing in Figma or building with React and Java, I enjoy solving problems where creativity meets code.
                </p>
                <p className="font-sans text-body leading-relaxed text-sm font-medium">
                  When I'm away from my screen, you'll probably find me doodling in my sketchbook, analyzing movie posters, or enjoying a cup of coffee while brainstorming the next idea.
                </p>
              </div>

              {/* Doodles */}
              <div className="mt-8 flex justify-around opacity-60">
                <PenTool className="w-8 h-8 text-body" />
                <Heart className="w-8 h-8 text-highlightPink" />
                <Coffee className="w-8 h-8 text-amber-700" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex-1 w-full"
        >
          <div className="mb-4 inline-block">
            <span className="font-bold text-sm tracking-wider uppercase text-label border-b border-primary pb-1">The Human</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-editorial font-bold text-heading mb-6">
            More than just <br />a <span className="italic text-primary">pixel pusher</span>.
          </h2>

          <div className="space-y-6 text-body font-light text-lg">
            <p>
              I bridge the gap between creative visual design and logical frontend development. I don't just want things to look pretty; I want them to feel <strong className="font-medium text-heading">alive, interactive, and seamless</strong>.
            </p>
            <p>
              My background in graphic design gives me an edge in typography, layout, and branding, while my passion for code allows me to bring those concepts to life exactly as intended.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            {/* Design */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-primary/60 rounded-full"></div>
                <h4 className="font-bold text-heading text-lg tracking-wider uppercase text-xs">Design</h4>
              </div>
              <ul className="space-y-2.5 text-body font-medium text-sm">
                <li>UX Design</li>
                <li>UI Design</li>
                <li>Prototyping</li>
                <li>Interaction Design</li>
              </ul>
            </div>

            {/* Development */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-primary/60 rounded-full"></div>
                <h4 className="font-bold text-heading text-lg tracking-wider uppercase text-xs">Development</h4>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-body font-medium text-sm">
                <li>React</li>
                <li>Java</li>
                <li>JavaScript</li>
                <li>Spring Boot</li>
                <li>Tailwind CSS</li>
                <li>MongoDB</li>
                <li>Firebase</li>
                <li>REST APIs</li>
              </ul>
            </div>

            {/* Tools */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-primary/60 rounded-full"></div>
                <h4 className="font-bold text-heading text-lg tracking-wider uppercase text-xs">Tools</h4>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-body font-medium text-sm">
                <li>Figma</li>
                <li>Postman</li>
                <li>VS Code</li>
                <li>IntelliJ IDEA</li>
                <li>Git</li>
                <li>Canva</li>
                <li>GitHub</li>
                <li>Photoshop</li>
              </ul>
            </div>

            {/* Currently Learning */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-primary/60 rounded-full"></div>
                <h4 className="font-bold text-heading text-lg tracking-wider uppercase text-xs">Currently Learning</h4>
              </div>
              <ul className="space-y-2.5 text-body font-medium text-sm">
                <li>Spring Boot</li>
                <li>System Design</li>
                <li>Motion UI</li>
                <li>Accessibility</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default AboutSection
