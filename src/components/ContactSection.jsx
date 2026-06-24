/*import { motion } from 'framer-motion';
import { Send, Mail, MapPin } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 my-12 relative overflow-hidden">
      {/* Background elements *//*}
      <div className="absolute top-0 left-0 w-full h-full bg-highlightYellow/5 -z-10 transform -skew-y-2 origin-top-left"></div>
      
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* Left: Info & Doodle *//*}
        <div className="flex-1 w-full">
          <div className="relative inline-block mb-6">
            <h2 className="text-5xl md:text-6xl font-editorial font-bold text-heading">Say Hello.</h2>
            <svg width="100" height="30" viewBox="0 0 100 30" className="absolute -bottom-2 -right-4 text-primary transform rotate-2">
              <path d="M5 25 Q 50 5 95 25" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          
          <p className="text-body font-medium text-lg leading-relaxed mb-10 max-w-sm">
            Whether you have a project in mind, want to collaborate, or just want to chat about design and tech, my inbox is always open.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-heading">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-lg cursor-hover hover:text-primary transition-colors">hello@niyatisoni.com</span>
            </div>
            
            <div className="flex items-center space-x-4 text-heading">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-lg">Remote / Earth</span>
            </div>
          </div>
        </div>

        {/* Right: Form *//*}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1 w-full bg-surface p-8 rounded-2xl shadow-xl border border-border relative"
        >
          {/* Tape *//*}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm transform rotate-1 z-10 border border-white/20 shadow-sm mix-blend-overlay"></div>

          <form className="space-y-6 mt-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent! (Mock)'); }}>
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-heading mb-2 uppercase tracking-wider">Your Name</label>
              <input 
                type="text" 
                id="name" 
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading"
                placeholder="John Doe"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-heading mb-2 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                id="email" 
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading"
                placeholder="john@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-bold text-heading mb-2 uppercase tracking-wider">Message</label>
              <textarea 
                id="message" 
                rows="4" 
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading resize-none"
                placeholder="Tell me about your project..."
                required
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className="w-full flex items-center justify-center px-8 py-4 bg-heading text-bg rounded-xl font-bold hover:bg-primary transition-colors shadow-md cursor-hover group"
            >
              Send Message
              <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default ContactSection */
import { motion } from 'framer-motion';
import { Send, Mail, MapPin } from 'lucide-react';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await emailjs.send(
        'service_nbmkzrp',
        'template_xlgu55y',
        {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        'Gwgo7kQTMBvLMJzXq'
      );

      alert('Message sent successfully!');

      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Failed to send message.');
    }

    setLoading(false);
  };

  return (
    <section
      id="contact"
      className="py-24 my-12 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-highlightYellow/5 -z-10 transform -skew-y-2 origin-top-left"></div>

      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-16 items-center">
        
        {/* Left Side */}
        <div className="flex-1 w-full">
          <div className="relative inline-block mb-6">
            <h2 className="text-5xl md:text-6xl font-editorial font-bold text-heading">
              Say Hello.
            </h2>

            <svg
              width="100"
              height="30"
              viewBox="0 0 100 30"
              className="absolute -bottom-2 -right-4 text-primary transform rotate-2"
            >
              <path
                d="M5 25 Q 50 5 95 25"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <p className="text-body font-medium text-lg leading-relaxed mb-10 max-w-sm">
            Whether you have a project in mind, want to collaborate,
            or just want to chat about design and tech, my inbox is
            always open.
          </p>

          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-heading">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5 text-primary" />
              </div>

              <span className="font-medium text-lg">
                niyatisoni06@gmail.com
              </span>
            </div>

            <div className="flex items-center space-x-4 text-heading">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center shadow-sm">
                <MapPin className="w-5 h-5 text-primary" />
              </div>

              <span className="font-medium text-lg">
                Remote / Earth
              </span>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex-1 w-full bg-surface p-8 rounded-2xl shadow-xl border border-border relative"
        >
          {/* Tape */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/40 backdrop-blur-sm transform rotate-1 z-10 border border-white/20 shadow-sm mix-blend-overlay"></div>

          <form
            className="space-y-6 mt-4"
            onSubmit={handleSubmit}
          >
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-heading mb-2 uppercase tracking-wider"
              >
                Your Name
              </label>

              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    name: e.target.value,
                  })
                }
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-heading mb-2 uppercase tracking-wider"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading"
                placeholder="john@example.com"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="message"
                className="block text-sm font-bold text-heading mb-2 uppercase tracking-wider"
              >
                Message
              </label>

              <textarea
                id="message"
                rows="4"
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading resize-none"
                placeholder="Tell me about your project..."
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center px-8 py-4 bg-heading text-bg rounded-xl font-bold hover:bg-primary transition-colors shadow-md group disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}

              {!loading && (
                <Send className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;