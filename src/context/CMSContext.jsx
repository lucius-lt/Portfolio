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
const LOCAL_SKETCHES_KEY = 'niyati_portfolio_sketches';





const SEED_SKETCHES = [
  {
    title: 'Chaos in Blue',
    imageUrl: 'https://collection.cloudinary.com/de2e3ci5b/14927228ec1610fef59911723a991a39',
    caption: 'Just letting the pen wander and seeing where it ends up.'
  }
  
];

export const CMSProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [sketches, setSketches] = useState([]);
  
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [cmsLoading, setCmsLoading] = useState(true);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const allowedEmails = [
          'niyatisoni06@gmail.com',
          'hello@niyatisoni.com',
          'niyati@soni.com'
        ];
        if (user.email && allowedEmails.includes(user.email.toLowerCase())) {
          setAdminUser(user);
        } else {
          // If not an authorized email account, force logout
          try {
            await signOut(auth);
          } catch (e) {
            console.error("Error signing out unauthorized user:", e);
          }
          setAdminUser(null);
        }
      } else {
        setAdminUser(null);
      }
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
      addSketch,
      updateSketch,
      deleteSketch
    }}>
      {children}
    </CMSContext.Provider>
  );
};
