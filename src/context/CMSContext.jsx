import React, { createContext, useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export const CMSContext = createContext();

const LOCAL_PROJECTS_KEY = 'niyati_portfolio_projects';
const LOCAL_BLOGS_KEY = 'niyati_portfolio_blogs';
const LOCAL_SKETCHES_KEY = 'niyati_portfolio_sketches';

const SEED_PROJECTS = [
  {
    title: 'Little Lemon Restaurant',
    slug: 'little-lemon-restaurant',
    category: 'Frontend',
    shortDescription: 'A responsive web app with booking capabilities built using React',
    fullDescription: '<p>Features a table booking system with form validation, responsive design for all devices, real-time availability checking. Built with React components, Formik for forms, and CSS modules.</p>',
    tags: ['React', 'CSS', 'Formik'],
    architecture: 'Client-side React application with Formik for state management and validation. Fully responsive CSS Grid and Flexbox layouts.',
    keyFeatures: ['Table booking system', 'Form validation', 'Responsive design for all devices', 'Real-time availability checking'],
    imageUrls: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    problemStatement: 'Modern customers demand online booking systems, but small restaurants struggle with complex setup and third-party fees. Little Lemon needed a clean, native table reserve interface.',
    process: 'Conducted user research, drew pen-and-paper layouts of the calendar booking steps, developed high-fidelity wireframes in Figma, and implemented using React and Formik.',
    wireframes: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    finalDesigns: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
    outcomes: 'Increased reservation booking efficiency by 35% and lowered dependency on phone calls during peak dining hours.'
  },
  {
    title: 'Distributed Command System',
    slug: 'distributed-command-system',
    category: 'Backend',
    shortDescription: 'CLI tool for managing distributed nodes efficiently',
    fullDescription: '<p>Allows remote command execution across multiple nodes, handles network failures gracefully, includes logging and monitoring. Written in C++ with custom networking library.</p>',
    tags: ['C++', 'Networking', 'CLI'],
    architecture: 'Peer-to-peer TCP networking model written in C++. Uses asynchronous I/O to maintain active connections with multiple nodes without blocking the main CLI thread.',
    keyFeatures: ['Remote command execution across multiple nodes', 'Graceful network failure handling', 'Comprehensive logging and monitoring', 'Low-latency binary protocol'],
    imageUrls: ['https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'],
    featured: false,
    problemStatement: 'Managing decentralized compute nodes requires highly reliable packet routing, light resource footprints, and resilient recovery protocols that traditional HTTP services fail to deliver.',
    process: 'Defined custom TCP application-layer frame syntax, prototyped asynchronous select/poll multiplexing loops, and tested under synthetic latency and heavy packet loss configurations.',
    wireframes: 'https://images.unsplash.com/photo-1618477388954-7852f32655ec?auto=format&fit=crop&w=800&q=80',
    finalDesigns: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=800&q=80',
    outcomes: 'Built a lightweight client-node agent running at <5MB memory footprint that safely executes commands across 100+ active servers simultaneously.'
  },
  {
    title: '3D Character Series',
    slug: '3d-character-series',
    category: 'Graphic Design',
    shortDescription: 'A stylized 3D character presentation featuring playful Pixar-inspired characters',
    fullDescription: '<h3>Overview</h3><p>This project is a collection of stylized 3D cartoon characters presented through modern poster and portfolio layouts. The characters were generated using AI image generation tools and arranged, styled, and presented in Figma.</p><h3>Objective</h3><p>Create visually appealing 3D character posters, explore playful character styling and color palettes.</p><h3>Design Direction</h3><p>Pixar-style animated characters, Dribbble presentations, Behance case study layouts.</p>',
    tags: ['Figma', 'AI Generation', 'Layout Design'],
    imageUrls: ['https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    problemStatement: 'Digital products often feel cold or technical. High-end visual characters can bring emotion and personality, but modeling from scratch takes months. We explored AI-assisted character generation and professional poster layouts.',
    process: 'Iteratively prompted generated models for consistency in shading, color palettes, and playful shapes. Structured in Figma with high contrast editorial headers and layout margins.',
    wireframes: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=800&q=80',
    finalDesigns: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    outcomes: 'Completed 6 distinct characters showcasing a cohesive design brand identity, garnering high design feedback and Dribbble highlights.'
  },
  {
    title: 'Rezet Mobile App',
    slug: 'rezet-mobile-app',
    category: 'UI/UX',
    shortDescription: 'A calming mobile experience for booking workation retreats and managing wellness routines',
    fullDescription: '<p>End-to-end UX/UI design for co-working & escape app. Includes user research, wireframes, interactive prototype, visual design system, and user testing. The app helps users book workation retreats, manage wellness routines, and discover peaceful escape destinations.</p>',
    tags: ['UX/UI Design', 'Wireframing', 'Prototyping'],
    imageUrls: ['https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'],
    featured: true,
    problemStatement: 'Remote workers suffer from fatigue and burnouts. Finding quiet spaces that balance fast internet with grounding wellness retreats is extremely hard and fragmented.',
    process: 'Conducted user interviews with 15 remote nomad engineers. Mapped task flows for booking and routines. Sketched wireframes, refined Figma design systems, and built an interactive Framer prototype.',
    wireframes: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=800&q=80',
    finalDesigns: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    outcomes: 'Designed a highly validated calming design system with 92% user satisfaction rating during interactive Figma prototype testing rounds.'
  }
];

const SEED_BLOGS = [
  {
    title: 'The Design System Behind My Portfolio',
    slug: 'design-system-portfolio',
    shortDescription: 'How I built a dark-mode first design system using fluid typography and CSS variables.',
    content: `# The Design System Behind My Portfolio

Designing a portfolio is a challenge. Here is how I built a dark-mode first design system with warm typography.

## Why Dark-Mode First?
Most developers and designers view portfolios in dark environments. A curated, off-black canvas with warm accents feels premium and reduces eye strain.

\`\`\`css
:root {
  --color-bg: #1E2A2F; /* Deep Navy */
  --color-primary: #D96C2B; /* Warm Orange Accent */
}
\`\`\`

## Typography Matters
We use editorial serif typefaces combined with clean monospaced utility tags. This blends layout structure with visual design character.

- **Editorial Headings**: Playfair Display
- **Scribbled Notes**: Caveat
- **UI Details**: Inter`,
    tags: ['Design System', 'CSS', 'React'],
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    featured: true
  },
  {
    title: 'Bridging the Gap: Sketching to Code',
    slug: 'sketching-to-code',
    shortDescription: 'Why jumping directly into Figma blocks creativity, and why paper sketches are the true starting point.',
    content: `# Bridging the Gap: Sketching to Code

Many designers jump straight into Figma. I outline my process of starting with pen and paper and turning it into a real codebase.

## Paper First
A digital tool forces you to think about pixels, alignment, and auto-layouts. A sketchpad frees you to think about hierarchy and visual weight.

> "The computer is a great tool for polishing, but paper is the tool for thinking."

## Bringing it to React
Once the ideas are clear, translating the layouts to Vite and CSS variables makes it seamless to maintain consistency.`,
    tags: ['UI/UX', 'Process', 'Frontend'],
    coverImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    featured: false
  }
];

const SEED_SKETCHES = [
  {
    title: 'EcoCommerce App Wireframe',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=600&h=800&q=80',
    caption: 'Early wireframes exploring checkout layouts on paper.'
  },
  {
    title: 'Typography Explorations',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&h=800&q=80',
    caption: 'Testing serif headers and custom handwritten notes.'
  },
  {
    title: 'Figma Layer Structure Doodles',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&h=600&q=80',
    caption: 'Messy doodles trying to organize complex component variables.'
  }
];

export const CMSProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [sketches, setSketches] = useState([]);
  
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cmsLoading, setCmsLoading] = useState(true);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Admin login flow
  const adminLogin = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Admin logout flow
  const adminLogout = async () => {
    return signOut(auth);
  };

  // Local caching fallback loaders
  const loadFallbackProjects = () => {
    try {
      const local = localStorage.getItem(LOCAL_PROJECTS_KEY);
      if (local) return JSON.parse(local);
    } catch(e) { console.warn(e); }
    const defaults = SEED_PROJECTS.map((p, i) => ({ ...p, id: `local-p-${i}`, createdAt: new Date().toISOString() }));
    localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(defaults));
    return defaults;
  };

  const loadFallbackBlogs = () => {
    try {
      const local = localStorage.getItem(LOCAL_BLOGS_KEY);
      if (local) return JSON.parse(local);
    } catch(e) { console.warn(e); }
    const defaults = SEED_BLOGS.map((b, i) => ({ ...b, id: `local-b-${i}`, createdAt: new Date().toISOString() }));
    localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(defaults));
    return defaults;
  };

  const loadFallbackSketches = () => {
    try {
      const local = localStorage.getItem(LOCAL_SKETCHES_KEY);
      if (local) return JSON.parse(local);
    } catch(e) { console.warn(e); }
    const defaults = SEED_SKETCHES.map((s, i) => ({ ...s, id: `local-s-${i}`, createdAt: new Date().toISOString() }));
    localStorage.setItem(LOCAL_SKETCHES_KEY, JSON.stringify(defaults));
    return defaults;
  };

  // Fetch all CMS content
  const fetchCMSContent = async () => {
    setCmsLoading(true);
    
    // Fetch Projects
    let prjs = [];
    try {
      const snap = await getDocs(collection(db, 'projects'));
      if (snap.empty) {
        prjs = loadFallbackProjects();
        // Seed to Firebase asynchronously
        for (const p of prjs) {
          const toSave = { ...p };
          delete toSave.id;
          await addDoc(collection(db, 'projects'), toSave);
        }
      } else {
        prjs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      }
    } catch (err) {
      console.warn("Firestore projects load failed, falling back: ", err);
      prjs = loadFallbackProjects();
    }
    sortItems(prjs, 'project');
    setProjects(prjs);

    // Fetch Blogs
    let blgs = [];
    try {
      const snap = await getDocs(collection(db, 'blogs'));
      if (snap.empty) {
        blgs = loadFallbackBlogs();
        for (const b of blgs) {
          const toSave = { ...b };
          delete toSave.id;
          await addDoc(collection(db, 'blogs'), toSave);
        }
      } else {
        blgs = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      }
    } catch (err) {
      console.warn("Firestore blogs load failed, falling back: ", err);
      blgs = loadFallbackBlogs();
    }
    sortItems(blgs, 'blog');
    setBlogs(blgs);

    // Fetch Sketches
    let skts = [];
    try {
      const snap = await getDocs(collection(db, 'sketches'));
      if (snap.empty) {
        skts = loadFallbackSketches();
        for (const s of skts) {
          const toSave = { ...s };
          delete toSave.id;
          await addDoc(collection(db, 'sketches'), toSave);
        }
      } else {
        skts = snap.docs.map(d => ({ ...d.data(), id: d.id }));
      }
    } catch (err) {
      console.warn("Firestore sketches load failed, falling back: ", err);
      skts = loadFallbackSketches();
    }
    sortItems(skts, 'sketch');
    setSketches(skts);

    setCmsLoading(false);
  };

  const sortItems = (list, type) => {
    list.sort((a, b) => {
      if (type === 'project' && a.featured !== b.featured) {
        return a.featured ? -1 : 1;
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  };

  // CRUD Operations: Projects
  const addProject = async (prjData) => {
    const data = { ...prjData, createdAt: new Date().toISOString() };
    try {
      const docRef = await addDoc(collection(db, 'projects'), data);
      const saved = { ...data, id: docRef.id };
      setProjects(prev => {
        const u = [...prev, saved];
        sortItems(u, 'project');
        localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(u));
        return u;
      });
      return saved;
    } catch (e) {
      const saved = { ...data, id: `local-p-${Date.now()}` };
      setProjects(prev => {
        const u = [...prev, saved];
        sortItems(u, 'project');
        localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(u));
        return u;
      });
      return saved;
    }
  };

  const updateProject = async (id, prjData) => {
    const data = { ...prjData, updatedAt: new Date().toISOString() };
    if (!id.startsWith('local-')) {
      try {
        await updateDoc(doc(db, 'projects', id), data);
      } catch(e) { console.warn(e); }
    }
    setProjects(prev => {
      const u = prev.map(p => p.id === id ? { ...p, ...data } : p);
      sortItems(u, 'project');
      localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(u));
      return u;
    });
  };

  const deleteProject = async (id) => {
    if (!id.startsWith('local-')) {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch(e) { console.warn(e); }
    }
    setProjects(prev => {
      const u = prev.filter(p => p.id !== id);
      localStorage.setItem(LOCAL_PROJECTS_KEY, JSON.stringify(u));
      return u;
    });
  };

  // CRUD Operations: Blogs
  const addBlog = async (blogData) => {
    const data = { ...blogData, createdAt: new Date().toISOString() };
    try {
      const docRef = await addDoc(collection(db, 'blogs'), data);
      const saved = { ...data, id: docRef.id };
      setBlogs(prev => {
        const u = [...prev, saved];
        sortItems(u, 'blog');
        localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(u));
        return u;
      });
      return saved;
    } catch (e) {
      const saved = { ...data, id: `local-b-${Date.now()}` };
      setBlogs(prev => {
        const u = [...prev, saved];
        sortItems(u, 'blog');
        localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(u));
        return u;
      });
      return saved;
    }
  };

  const updateBlog = async (id, blogData) => {
    const data = { ...blogData, updatedAt: new Date().toISOString() };
    if (!id.startsWith('local-')) {
      try {
        await updateDoc(doc(db, 'blogs', id), data);
      } catch(e) { console.warn(e); }
    }
    setBlogs(prev => {
      const u = prev.map(b => b.id === id ? { ...b, ...data } : b);
      sortItems(u, 'blog');
      localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(u));
      return u;
    });
  };

  const deleteBlog = async (id) => {
    if (!id.startsWith('local-')) {
      try {
        await deleteDoc(doc(db, 'blogs', id));
      } catch(e) { console.warn(e); }
    }
    setBlogs(prev => {
      const u = prev.filter(b => b.id !== id);
      localStorage.setItem(LOCAL_BLOGS_KEY, JSON.stringify(u));
      return u;
    });
  };

  // CRUD Operations: Sketches
  const addSketch = async (sketchData) => {
    const data = { ...sketchData, createdAt: new Date().toISOString() };
    try {
      const docRef = await addDoc(collection(db, 'sketches'), data);
      const saved = { ...data, id: docRef.id };
      setSketches(prev => {
        const u = [...prev, saved];
        sortItems(u, 'sketch');
        localStorage.setItem(LOCAL_SKETCHES_KEY, JSON.stringify(u));
        return u;
      });
      return saved;
    } catch (e) {
      const saved = { ...data, id: `local-s-${Date.now()}` };
      setSketches(prev => {
        const u = [...prev, saved];
        sortItems(u, 'sketch');
        localStorage.setItem(LOCAL_SKETCHES_KEY, JSON.stringify(u));
        return u;
      });
      return saved;
    }
  };

  const updateSketch = async (id, sketchData) => {
    const data = { ...sketchData, updatedAt: new Date().toISOString() };
    if (!id.startsWith('local-')) {
      try {
        await updateDoc(doc(db, 'sketches', id), data);
      } catch(e) { console.warn(e); }
    }
    setSketches(prev => {
      const u = prev.map(s => s.id === id ? { ...s, ...data } : s);
      sortItems(u, 'sketch');
      localStorage.setItem(LOCAL_SKETCHES_KEY, JSON.stringify(u));
      return u;
    });
  };

  const deleteSketch = async (id) => {
    if (!id.startsWith('local-')) {
      try {
        await deleteDoc(doc(db, 'sketches', id));
      } catch(e) { console.warn(e); }
    }
    setSketches(prev => {
      const u = prev.filter(s => s.id !== id);
      localStorage.setItem(LOCAL_SKETCHES_KEY, JSON.stringify(u));
      return u;
    });
  };

  useEffect(() => {
    fetchCMSContent();
  }, []);

  return (
    <CMSContext.Provider value={{
      projects,
      blogs,
      sketches,
      adminUser,
      authLoading,
      cmsLoading,
      login: adminLogin,
      logout: adminLogout,
      refreshCMS: fetchCMSContent,
      addProject,
      updateProject,
      deleteProject,
      addBlog,
      updateBlog,
      deleteBlog,
      addSketch,
      updateSketch,
      deleteSketch
    }}>
      {children}
    </CMSContext.Provider>
  );
};
