import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CMSContext } from '../context/CMSContext';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const AdminLogin = () => {
  const { login, adminUser, authLoading } = useContext(CMSContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect straight to admin panel
    if (!authLoading && adminUser) {
      navigate('/admin');
    }
  }, [adminUser, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Niyati!");
      navigate('/admin');
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-background">
      {/* Decorative light elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '6s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-highlightBlue/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDuration: '8s' }}></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-surface p-8 md:p-10 rounded-3xl border border-border shadow-2xl relative"
      >
        {/* Binder tape decoration */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/5 backdrop-blur-md transform -rotate-1 border border-white/10 shadow-sm"></div>

        <div className="text-center mb-8">
          <span className="font-handwriting text-3xl text-primary inline-block transform -rotate-3 mb-2">Restricted Area</span>
          <h1 className="text-4xl md:text-5xl font-editorial font-bold text-heading">Admin Login</h1>
          <p className="text-body mt-2 text-sm">Please log in to manage your portfolio content.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-heading mb-2 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-body opacity-60" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="niyati@soni.com"
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-heading mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-body opacity-60" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium text-heading"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-8 py-4 bg-heading text-background rounded-xl font-bold hover:bg-primary hover:text-white transition-all shadow-md cursor-hover group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <>
                Access Dashboard
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
