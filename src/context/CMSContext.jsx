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
    title: 'Chaos in Blue',
    imageUrl: 'https://collection.cloudinary.com/de2e3ci5b/14927228ec1610fef59911723a991a39',
    caption: 'Just letting the pen wander and seeing where it ends up.'
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
