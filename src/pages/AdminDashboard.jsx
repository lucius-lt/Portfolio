import { useState, useContext, useEffect } from 'react';
import { CMSContext } from '../context/CMSContext';
import { 
  Loader2, Save, Trash2, Edit2, Copy, Star, 
  ExternalLink, LogOut, FileText, Image as ImageIcon, Briefcase, Plus 
} from 'lucide-react';
import { toast } from 'react-toastify';
import ImageUploader from '../components/admin/ImageUploader';
import RichTextEditor from '../components/admin/RichTextEditor';
import MarkdownEditor from '../components/admin/MarkdownEditor';

const initialProjectForm = {
  title: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  category: 'UI/UX',
  tags: '',
  demoLink: '',
  githubLink: '',
  imageUrls: [],
  featured: false,
  problemStatement: '',
  process: '',
  wireframes: '',
  finalDesigns: '',
  outcomes: ''
};

const initialBlogForm = {
  title: '',
  slug: '',
  shortDescription: '',
  content: '',
  coverImage: '',
  tags: '',
  featured: false
};

const initialSketchForm = {
  title: '',
  imageUrl: '',
  caption: ''
};

const AdminDashboard = () => {
  const { 
    projects, blogs, sketches, 
    loading, cmsLoading,
    addProject, updateProject, deleteProject,
    addBlog, updateBlog, deleteBlog,
    addSketch, updateSketch, deleteSketch,
    logout 
  } = useContext(CMSContext);

  const [activeTab, setActiveTab] = useState('projects'); // 'projects', 'blogs', 'sketches'
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [projectForm, setProjectForm] = useState(initialProjectForm);
  const [blogForm, setBlogForm] = useState(initialBlogForm);
  const [sketchForm, setSketchForm] = useState(initialSketchForm);

  // Warn user before leaving if unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Reset form when tab changes
  useEffect(() => {
    resetForm();
  }, [activeTab]);

  const resetForm = () => {
    setProjectForm(initialProjectForm);
    setBlogForm(initialBlogForm);
    setSketchForm(initialSketchForm);
    setIsEditing(false);
    setCurrentId(null);
    setIsDirty(false);
  };

  const handleInputChange = (e, formType) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setIsDirty(true);

    if (formType === 'project') {
      if (name === 'title' && !isEditing) {
        const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setProjectForm(prev => ({ ...prev, title: value, slug: autoSlug }));
      } else {
        setProjectForm(prev => ({ ...prev, [name]: val }));
      }
    } else if (formType === 'blog') {
      if (name === 'title' && !isEditing) {
        const autoSlug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        setBlogForm(prev => ({ ...prev, title: value, slug: autoSlug }));
      } else {
        setBlogForm(prev => ({ ...prev, [name]: val }));
      }
    } else if (formType === 'sketch') {
      setSketchForm(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleRichTextChange = (val) => {
    setIsDirty(true);
    setProjectForm(prev => ({ ...prev, fullDescription: val }));
  };

  const handleMarkdownChange = (val) => {
    setIsDirty(true);
    setBlogForm(prev => ({ ...prev, content: val }));
  };

  const handleImagesUpdate = (newImages) => {
    setIsDirty(true);
    setProjectForm(prev => ({ ...prev, imageUrls: newImages }));
  };

  const handleSketchImageUpdate = (newImages) => {
    setIsDirty(true);
    setSketchForm(prev => ({ ...prev, imageUrl: newImages[0] || '' }));
  };

  const handleBlogImageUpdate = (newImages) => {
    setIsDirty(true);
    setBlogForm(prev => ({ ...prev, coverImage: newImages[0] || '' }));
  };

  const validateProjectForm = () => {
    if (!projectForm.title.trim()) return "Title is required.";
    if (!projectForm.slug.trim()) return "Slug is required.";
    if (!projectForm.category.trim()) return "Category is required.";
    if (!projectForm.shortDescription.trim()) return "Short description is required.";
    return null;
  };

  const validateBlogForm = () => {
    if (!blogForm.title.trim()) return "Title is required.";
    if (!blogForm.slug.trim()) return "Slug is required.";
    if (!blogForm.shortDescription.trim()) return "Short description is required.";
    if (!blogForm.content.trim()) return "Content is required.";
    return null;
  };

  const validateSketchForm = () => {
    if (!sketchForm.title.trim()) return "Title is required.";
    if (!sketchForm.imageUrl.trim()) return "Image is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    try {
      if (activeTab === 'projects') {
        const error = validateProjectForm();
        if (error) { toast.error(error); setSaving(false); return; }

        const projectData = {
          ...projectForm,
          tags: typeof projectForm.tags === 'string'
            ? projectForm.tags.split(',').map(s => s.trim()).filter(Boolean)
            : projectForm.tags
        };

        if (isEditing) {
          await updateProject(currentId, projectData);
          toast.success("Project updated successfully!");
        } else {
          await addProject(projectData);
          toast.success("Project created successfully!");
        }
      } else if (activeTab === 'blogs') {
        const error = validateBlogForm();
        if (error) { toast.error(error); setSaving(false); return; }

        const blogData = {
          ...blogForm,
          tags: typeof blogForm.tags === 'string'
            ? blogForm.tags.split(',').map(s => s.trim()).filter(Boolean)
            : blogForm.tags
        };

        if (isEditing) {
          await updateBlog(currentId, blogData);
          toast.success("Blog post updated successfully!");
        } else {
          await addBlog(blogData);
          toast.success("Blog post created successfully!");
        }
      } else if (activeTab === 'sketches') {
        const error = validateSketchForm();
        if (error) { toast.error(error); setSaving(false); return; }

        if (isEditing) {
          await updateSketch(currentId, sketchForm);
          toast.success("Sketch updated successfully!");
        } else {
          await addSketch(sketchForm);
          toast.success("Sketch created successfully!");
        }
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error(`Save failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (item) => {
    if (isDirty && !window.confirm("You have unsaved changes. Discard?")) return;
    setIsEditing(true);
    setCurrentId(item.id);
    setIsDirty(false);

    if (activeTab === 'projects') {
      setProjectForm({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        demoLink: item.demoLink || '',
        githubLink: item.githubLink || '',
        imageUrls: item.imageUrls || [],
        problemStatement: item.problemStatement || '',
        process: item.process || '',
        wireframes: item.wireframes || '',
        finalDesigns: item.finalDesigns || '',
        outcomes: item.outcomes || ''
      });
    } else if (activeTab === 'blogs') {
      setBlogForm({
        ...item,
        tags: Array.isArray(item.tags) ? item.tags.join(', ') : (item.tags || ''),
        coverImage: item.coverImage || '',
        content: item.content || ''
      });
    } else if (activeTab === 'sketches') {
      setSketchForm({
        title: item.title || '',
        imageUrl: item.imageUrl || '',
        caption: item.caption || ''
      });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This is permanent.`)) return;

    try {
      if (activeTab === 'projects') {
        await deleteProject(item.id);
        toast.success("Project deleted.");
      } else if (activeTab === 'blogs') {
        await deleteBlog(item.id);
        toast.success("Blog post deleted.");
      } else if (activeTab === 'sketches') {
        await deleteSketch(item.id);
        toast.success("Sketch deleted.");
      }
      if (currentId === item.id) resetForm();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed.");
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Logout from admin workspace?")) {
      await logout();
      toast.success("Logged out successfully.");
    }
  };

  const getFormDirtyState = () => {
    return isDirty;
  };

  return (
    <div className="min-h-screen bg-background text-heading font-sans">
      {/* Sticky Action Header */}
      <div className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md border-b border-border px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm">
        <div className="flex items-center space-x-4">
          <Briefcase className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold font-editorial">
            {isEditing ? `Edit ${activeTab.slice(0,-1)}` : `Create New ${activeTab.slice(0,-1)}`}
          </h1>
          {isDirty && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-primary/20 text-primary border border-primary/30 rounded-full">
              Unsaved changes
            </span>
          )}
        </div>

        {/* Tab Selection */}
        <div className="flex bg-background/50 border border-border p-1 rounded-xl">
          <button 
            onClick={() => { if (!getFormDirtyState() || window.confirm("Discard changes?")) setActiveTab('projects'); }}
            className={`flex items-center px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-hover ${activeTab === 'projects' ? 'bg-surface text-primary shadow' : 'text-body hover:text-heading'}`}
          >
            <Briefcase className="w-3.5 h-3.5 mr-2" /> Projects
          </button>
          <button 
            onClick={() => { if (!getFormDirtyState() || window.confirm("Discard changes?")) setActiveTab('blogs'); }}
            className={`flex items-center px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-hover ${activeTab === 'blogs' ? 'bg-surface text-primary shadow' : 'text-body hover:text-heading'}`}
          >
            <FileText className="w-3.5 h-3.5 mr-2" /> Blog Posts
          </button>
          <button 
            onClick={() => { if (!getFormDirtyState() || window.confirm("Discard changes?")) setActiveTab('sketches'); }}
            className={`flex items-center px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-hover ${activeTab === 'sketches' ? 'bg-surface text-primary shadow' : 'text-body hover:text-heading'}`}
          >
            <ImageIcon className="w-3.5 h-3.5 mr-2" /> Sketches
          </button>
        </div>

        <div className="flex space-x-3 items-center">
          <button 
            onClick={resetForm}
            className="px-4 py-2 text-xs font-semibold text-body hover:text-heading transition-colors cursor-hover"
          >
            Clear
          </button>
          <button 
            onClick={handleSubmit}
            disabled={saving || (!isDirty && isEditing)}
            className="flex items-center px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-full hover:bg-opacity-90 disabled:opacity-50 transition-all cursor-hover"
          >
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? 'Saving...' : (isEditing ? 'Update Item' : 'Publish Item')}
          </button>
          <button 
            onClick={handleLogout}
            className="p-2.5 text-body hover:text-red-500 rounded-full hover:bg-surface transition-colors cursor-hover"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Creation Forms */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Active Form: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              {/* Basic Details */}
              <section className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold font-editorial mb-6 flex items-center text-heading">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary mr-3"></span>
                  Project Specs
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Project Title</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={projectForm.title} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="E.g., Little Lemon Booking" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Slug</label>
                      <input 
                        type="text" 
                        name="slug" 
                        value={projectForm.slug} 
                        onChange={(e) => handleInputChange(e, 'project')} 
                        className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-mono text-sm" 
                        placeholder="little-lemon" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Category</label>
                      <select 
                        name="category" 
                        value={projectForm.category} 
                        onChange={(e) => handleInputChange(e, 'project')} 
                        className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium"
                      >
                        <option value="UI/UX">UI/UX Design</option>
                        <option value="Graphic Design">Graphic Design</option>
                        <option value="Frontend">Frontend Dev</option>
                        <option value="Branding">Branding / Visual Identity</option>
                        <option value="Experimental">Experimental</option>
                        <option value="Backend">Backend Dev</option>
                        <option value="Fullstack">Fullstack Dev</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Tags / Tech Stack</label>
                    <input 
                      type="text" 
                      name="tags" 
                      value={projectForm.tags} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="React, CSS modules, Formik (comma separated)" 
                    />
                  </div>

                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id="featured" 
                      name="featured" 
                      checked={projectForm.featured} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary" 
                    />
                    <label htmlFor="featured" className="ml-3 text-sm font-bold text-heading">Feature this work on homepage</label>
                  </div>
                </div>
              </section>

              {/* Case Study Details */}
              <section className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold font-editorial mb-6 flex items-center text-heading">
                  <span className="w-2.5 h-2.5 rounded-full bg-highlightBlue mr-3"></span>
                  UX Case Study Structure
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Overview / Hook</label>
                    <textarea 
                      name="shortDescription" 
                      value={projectForm.shortDescription} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      rows={2}
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium resize-none" 
                      placeholder="A short punchy intro hooks readers..." 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Problem Statement</label>
                    <textarea 
                      name="problemStatement" 
                      value={projectForm.problemStatement} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      rows={3}
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="What was the core problem to solve?" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">The Process</label>
                    <textarea 
                      name="process" 
                      value={projectForm.process} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      rows={4}
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="Describe research, user testing, wireframing milestones..." 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Outcomes & Outcomes Impact</label>
                    <textarea 
                      name="outcomes" 
                      value={projectForm.outcomes} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      rows={3}
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="What were the outcomes and findings?" 
                    />
                  </div>
                </div>
              </section>

              {/* Media Section */}
              <section className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold font-editorial mb-6 flex items-center text-heading">
                  <span className="w-2.5 h-2.5 rounded-full bg-highlightPink mr-3"></span>
                  Media & Visual Attachments
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Wireframes (Image URL)</label>
                    <input 
                      type="text" 
                      name="wireframes" 
                      value={projectForm.wireframes} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="https://..." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Final Designs (Image URL)</label>
                    <input 
                      type="text" 
                      name="finalDesigns" 
                      value={projectForm.finalDesigns} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="https://..." 
                    />
                  </div>

                  <div className="border-t border-border pt-6">
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-3">Project Showcase Image Gallery (Cloudinary)</label>
                    <ImageUploader existingImages={projectForm.imageUrls} onImagesUpdate={handleImagesUpdate} />
                  </div>
                </div>
              </section>

              {/* Rich Body Content */}
              <section className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold font-editorial mb-6 flex items-center text-heading">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-3"></span>
                  Rich Body Content (Fallback/Legacy)
                </h2>
                <RichTextEditor value={projectForm.fullDescription} onChange={handleRichTextChange} />
              </section>

              {/* Links */}
              <section className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold font-editorial mb-6 flex items-center text-heading">
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-3"></span>
                  External URLs
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Live Demo URL</label>
                    <input 
                      type="url" 
                      name="demoLink" 
                      value={projectForm.demoLink} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="https://..." 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">GitHub Repository</label>
                    <input 
                      type="url" 
                      name="githubLink" 
                      value={projectForm.githubLink} 
                      onChange={(e) => handleInputChange(e, 'project')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="https://github.com/..." 
                    />
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* Active Form: BLOGS */}
          {activeTab === 'blogs' && (
            <div className="space-y-8">
              <section className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold font-editorial mb-6 flex items-center text-heading">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary mr-3"></span>
                  Blog Configuration
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Article Title</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={blogForm.title} 
                      onChange={(e) => handleInputChange(e, 'blog')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="The future of vector animation..." 
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Slug</label>
                      <input 
                        type="text" 
                        name="slug" 
                        value={blogForm.slug} 
                        onChange={(e) => handleInputChange(e, 'blog')} 
                        className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-mono text-sm" 
                        placeholder="future-vector-animation" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Tags / Topics</label>
                      <input 
                        type="text" 
                        name="tags" 
                        value={blogForm.tags} 
                        onChange={(e) => handleInputChange(e, 'blog')} 
                        className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                        placeholder="UI/UX, Vectors, Figma (comma separated)" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Short Hook / Excerpt</label>
                    <textarea 
                      name="shortDescription" 
                      value={blogForm.shortDescription} 
                      onChange={(e) => handleInputChange(e, 'blog')} 
                      rows={2}
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium resize-none" 
                      placeholder="Provide a small caption overview..." 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Cover Image URL</label>
                    <input 
                      type="text" 
                      name="coverImage" 
                      value={blogForm.coverImage} 
                      onChange={(e) => handleInputChange(e, 'blog')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="https://..." 
                    />
                    <div className="mt-3">
                      <ImageUploader 
                        existingImages={blogForm.coverImage ? [blogForm.coverImage] : []} 
                        onImagesUpdate={handleBlogImageUpdate} 
                      />
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold font-editorial mb-6 flex items-center text-heading">
                  <span className="w-2.5 h-2.5 rounded-full bg-highlightBlue mr-3"></span>
                  Article Content (Markdown)
                </h2>
                <MarkdownEditor value={blogForm.content} onChange={handleMarkdownChange} />
              </section>
            </div>
          )}

          {/* Active Form: SKETCHES */}
          {activeTab === 'sketches' && (
            <div className="space-y-8">
              <section className="bg-surface p-8 rounded-2xl border border-border shadow-sm">
                <h2 className="text-lg font-bold font-editorial mb-6 flex items-center text-heading">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary mr-3"></span>
                  Sketchbook Entry
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Scribble Title</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={sketchForm.title} 
                      onChange={(e) => handleInputChange(e, 'sketch')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="E.g., Checkout Wireframe v1" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Brief Caption</label>
                    <input 
                      type="text" 
                      name="caption" 
                      value={sketchForm.caption} 
                      onChange={(e) => handleInputChange(e, 'sketch')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="Explaining visual structure..." 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-body uppercase tracking-wider mb-2">Scan/Photo Image URL</label>
                    <input 
                      type="text" 
                      name="imageUrl" 
                      value={sketchForm.imageUrl} 
                      onChange={(e) => handleInputChange(e, 'sketch')} 
                      className="w-full bg-background border border-border rounded-xl p-3 focus:ring-2 focus:ring-primary focus:border-transparent text-heading font-medium" 
                      placeholder="https://..." 
                    />
                    <div className="mt-3">
                      <ImageUploader 
                        existingImages={sketchForm.imageUrl ? [sketchForm.imageUrl] : []} 
                        onImagesUpdate={handleSketchImageUpdate} 
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          )}

        </div>

        {/* Right Side: Existing Content Manager */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface p-6 rounded-2xl border border-border sticky top-24 max-h-[85vh] flex flex-col shadow-sm">
            <h2 className="text-lg font-bold font-editorial mb-4 flex justify-between items-center text-heading">
              <span>Workspace Library</span>
              <span className="text-[10px] bg-background border border-border px-2.5 py-0.5 rounded-full text-body font-semibold">
                {activeTab === 'projects' && `${projects.length} works`}
                {activeTab === 'blogs' && `${blogs.length} articles`}
                {activeTab === 'sketches' && `${sketches.length} sketches`}
              </span>
            </h2>

            {cmsLoading ? (
              <div className="flex-1 flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                
                {/* PROJECTS LIST */}
                {activeTab === 'projects' && projects.length === 0 && (
                  <p className="text-xs text-body text-center py-8">No projects created yet.</p>
                )}
                {activeTab === 'projects' && projects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`group p-3 border rounded-xl transition-all ${currentId === project.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-background overflow-hidden flex-shrink-0 relative border border-border">
                        {project.imageUrls?.[0] ? (
                          <img src={project.imageUrls[0]} alt={project.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-body absolute inset-0 flex items-center justify-center">No Img</span>
                        )}
                        {project.featured && (
                          <div className="absolute top-0 right-0 bg-primary p-0.5 rounded-bl-lg">
                            <Star className="w-2.5 h-2.5 text-white fill-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-heading truncate">{project.title}</h3>
                        <p className="text-[10px] text-body truncate">{project.category}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-2 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(project)} className="p-1 text-body hover:text-primary transition-colors cursor-hover"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete(project)} className="p-1 text-body hover:text-red-500 transition-colors cursor-hover"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}

                {/* BLOGS LIST */}
                {activeTab === 'blogs' && blogs.length === 0 && (
                  <p className="text-xs text-body text-center py-8">No articles published yet.</p>
                )}
                {activeTab === 'blogs' && blogs.map((blog) => (
                  <div 
                    key={blog.id} 
                    className={`group p-3 border rounded-xl transition-all ${currentId === blog.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-background overflow-hidden flex-shrink-0 relative border border-border">
                        {blog.coverImage ? (
                          <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-body absolute inset-0 flex items-center justify-center">No Img</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-heading truncate">{blog.title}</h3>
                        <p className="text-[10px] text-body truncate">
                          {new Date(blog.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-2 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(blog)} className="p-1 text-body hover:text-primary transition-colors cursor-hover"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete(blog)} className="p-1 text-body hover:text-red-500 transition-colors cursor-hover"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}

                {/* SKETCHES LIST */}
                {activeTab === 'sketches' && sketches.length === 0 && (
                  <p className="text-xs text-body text-center py-8">No sketchbook scans added.</p>
                )}
                {activeTab === 'sketches' && sketches.map((sketch) => (
                  <div 
                    key={sketch.id} 
                    className={`group p-3 border rounded-xl transition-all ${currentId === sketch.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-background overflow-hidden flex-shrink-0 relative border border-border">
                        {sketch.imageUrl ? (
                          <img src={sketch.imageUrl} alt={sketch.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-body absolute inset-0 flex items-center justify-center">No Img</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-xs text-heading truncate">{sketch.title}</h3>
                        <p className="text-[10px] text-body truncate">{sketch.caption || 'No caption'}</p>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-2 pt-2 border-t border-border opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEdit(sketch)} className="p-1 text-body hover:text-primary transition-colors cursor-hover"><Edit2 className="w-3 h-3" /></button>
                      <button onClick={() => handleDelete(sketch)} className="p-1 text-body hover:text-red-500 transition-colors cursor-hover"><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                ))}

              </div>
            )}
            <div className="mt-4 pt-4 border-t border-border text-center flex items-center justify-center text-[10px] text-body font-semibold">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              CMS Synced Live (Firestore)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
