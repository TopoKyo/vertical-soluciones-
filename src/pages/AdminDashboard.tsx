import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  LogOut, 
  LayoutDashboard, 
  Image as ImageIcon, 
  Tag, 
  FileText, 
  User,
  PlusCircle,
  X,
  Loader2,
  Settings as SettingsIcon,
  MessageSquare,
  Phone,
  Mail,
  MapPin,
  Save,
  CheckCircle,
  Calendar,
  Briefcase,
  Pencil,
  Link as LinkIcon,
  Menu,
  Globe,
  Star
} from "lucide-react";
import { db, auth } from "../lib/firebase";
import { DEFAULT_PROJECTS, DEFAULT_SETTINGS } from "../data/defaultData";
import { formatDateTime, saveProject, deleteProjectById, saveSettings, fetchProjectsList, fetchSettings } from "../lib/dataService";
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  Timestamp,
  serverTimestamp,
  getDoc,
  setDoc,
  limit
} from "firebase/firestore";
import { signOut } from "firebase/auth";

interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  gallery?: string[];
  serviceProvided?: string;
  client: string;
  contractedBy?: string;
  location?: string;
  executionDate?: string;
  createdAt: any;
}

interface Message {
  id: string;
  name: string;
  company: string;
  email: string;
  service: string;
  details: string;
  createdAt: any;
}

interface JobApplicationData {
  id: string;
  name: string;
  email: string;
  phone: string;
  certifications: string;
  experience: string;
  portfolioUrl: string;
  createdAt: any;
}

import AdminForum from '../components/admin/AdminForum';
import { Newspaper } from 'lucide-react';

// Inside AdminDashboard component, add "forum" to activeTab state type and initialize tabs
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "settings" | "messages" | "applications" | "forum">("projects");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [applications, setApplications] = useState<JobApplicationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isFeaturedInForm, setIsFeaturedInForm] = useState(false);
  const navigate = useNavigate();

  const NAV_ITEMS = [
    { id: "projects", label: "Portafolio", icon: LayoutDashboard, badge: projects.length },
    { id: "messages", label: "Mensajes", icon: MessageSquare, badge: messages.length },
    { id: "forum", label: "Foro", icon: Newspaper, badge: undefined },
    { id: "settings", label: "Configuración", icon: SettingsIcon, badge: undefined },
    { id: "applications", label: "Postulaciones", icon: Briefcase, badge: applications.length },
  ] as const;

  // Settings state
  const [settings, setSettings] = useState({
    phone: "",
    email: "",
    address: "",
    heroTagline: "",
    heroTitleLine1: "",
    heroTitleLine2: "",
    heroTitleLine3: "",
    heroTitleHighlight: "",
    heroDescription: "",
    latestProjectId: ""
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    image: "",
    gallery: [] as string[],
    serviceProvided: "",
    client: "",
    contractedBy: "",
    location: "",
    executionDate: ""
  });

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, w, h);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setFormData(prev => ({ ...prev, image: compressed }));
      } catch (err) {
        console.error("Error reading image:", err);
      }
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files) as File[];
      for (const file of fileArray) {
        try {
          const compressed = await compressImage(file);
          setFormData(prev => ({ 
            ...prev, 
            gallery: [...prev.gallery, compressed] 
          }));
        } catch {}
      }
    }
  };

  const removeGalleryImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const isAuth = localStorage.getItem("admin_auth");
    if (!isAuth) {
      navigate("/admin");
      return;
    }
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "projects") {
        const data = await fetchProjectsList();
        setProjects(data as Project[]);
        const sett = await fetchSettings();
        setSettings(sett);
      } else if (activeTab === "settings") {
        const sett = await fetchSettings();
        setSettings(sett);
        const data = await fetchProjectsList();
        setProjects(data as Project[]);
      } else if (activeTab === "messages") {
        try {
          const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(50));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Message[];
          setMessages(data);
        } catch {
          setMessages([]);
        }
      } else if (activeTab === "applications") {
        try {
          const q = query(collection(db, "job_applications"), orderBy("createdAt", "desc"), limit(50));
          const querySnapshot = await getDocs(q);
          const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as JobApplicationData[];
          setApplications(data);
        } catch {
          setApplications([]);
        }
      }
    } catch (error: any) {
      console.warn("Could not fetch remote data for dashboard, using local defaults:", error?.message || error);
      if (activeTab === "projects" && projects.length === 0) {
        setProjects(DEFAULT_PROJECTS as any);
      } else if (activeTab === "settings" && !settings.phone) {
        setSettings(DEFAULT_SETTINGS);
        setProjects(DEFAULT_PROJECTS as any);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("admin_auth");
    navigate("/admin");
  };

  const handleSetFeatured = async (id: string) => {
    try {
      const updated = { ...settings, latestProjectId: id };
      setSettings(updated);
      await saveSettings(updated);
      alert("¡Proyecto fijado como Destacado en Inicio exitosamente!");
    } catch (err) {
      console.error("Error setting featured project:", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await deleteProjectById(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Error al eliminar el proyecto:", error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este mensaje?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        setMessages(messages.filter(m => m.id !== id));
      } catch (error) {
        alert("Error al eliminar el mensaje.");
      }
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await saveSettings(settings);
      alert("Configuración guardada correctamente.");
    } catch (error) {
      alert("Error al guardar la configuración.");
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const saved = await saveProject({
        ...formData,
        id: (isEditing && editingId) ? editingId : undefined
      });

      if (isEditing && editingId) {
        setProjects(prev => prev.map(p => p.id === editingId ? { ...p, ...saved } as Project : p));
      } else {
        setProjects(prev => [saved as Project, ...prev]);
      }

      if (isFeaturedInForm) {
        const targetId = (isEditing && editingId) ? editingId : saved.id;
        const updated = { ...settings, latestProjectId: targetId };
        setSettings(updated);
        await saveSettings(updated);
      }

      setIsModalOpen(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({ 
        title: "", 
        category: "", 
        description: "", 
        image: "", 
        gallery: [],
        serviceProvided: "",
        client: "",
        contractedBy: "",
        location: "",
        executionDate: ""
      });
    } catch (error) {
      console.error("Error al guardar el proyecto:", error);
      alert("Error al guardar el proyecto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (project: Project) => {
    setFormData({
      title: project.title,
      category: project.category,
      description: project.description,
      image: project.image,
      gallery: project.gallery || [],
      serviceProvided: project.serviceProvided || "",
      client: project.client,
      contractedBy: project.contractedBy || "",
      location: project.location || "",
      executionDate: project.executionDate || ""
    });
    setEditingId(project.id);
    setIsFeaturedInForm(settings.latestProjectId === project.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ 
      title: "", 
      category: "", 
      description: "", 
      image: "", 
      gallery: [],
      serviceProvided: "",
      client: "",
      contractedBy: "",
      location: "",
      executionDate: ""
    });
    setIsFeaturedInForm(false);
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col lg:flex-row font-medium">
      {/* Mobile Top Bar (visible on screens < lg) */}
      <div className="lg:hidden sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black italic text-sm shadow-md shadow-red-900/30">V</div>
          <div>
            <div className="font-black uppercase italic text-xs tracking-tighter leading-tight">
              Vertical <span className="text-red-500">Panel</span>
            </div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-0.5">
              {activeTab === "projects" && "Portafolio"}
              {activeTab === "messages" && "Mensajes"}
              {activeTab === "forum" && "Foro"}
              {activeTab === "settings" && "Configuración"}
              {activeTab === "applications" && "Postulaciones"}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === "projects" && (
            <button
              onClick={openAddModal}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1 active:scale-95 transition-all shadow-md shadow-red-900/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo</span>
            </button>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir menú"
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors active:scale-95 border border-slate-700/60"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Quick Horizontal Scrollable Tabs (< lg) */}
      <div className="lg:hidden sticky top-[57px] z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 py-2 flex items-center gap-2 overflow-x-auto shadow-inner">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all active:scale-95 shrink-0 ${
                isActive
                  ? "bg-red-600 text-white shadow-md shadow-red-900/30"
                  : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {typeof item.badge === "number" && item.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer Slide-over Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Drawer Content */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="relative w-4/5 max-w-xs bg-slate-900 border-r border-slate-800 p-6 flex flex-col h-full shadow-2xl z-10"
            >
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black italic text-sm">V</div>
                  <span className="font-black uppercase italic text-sm tracking-tighter">
                    Vertical <span className="text-red-500">Panel</span>
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mt-6 mb-2 px-2">
                Navegación
              </div>

              <nav className="space-y-1.5 flex-1 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        isActive
                          ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {typeof item.badge === "number" && item.badge > 0 && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                          isActive ? "bg-white/20 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}

                <div className="pt-4 mt-4 border-t border-slate-800">
                  <Link
                    to="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-slate-500" />
                    <span>Ver Sitio Web</span>
                  </Link>
                </div>
              </nav>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors text-xs font-bold uppercase tracking-wider"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (lg:flex) */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 hidden lg:flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black italic text-sm">V</div>
            <span className="font-black uppercase italic text-sm tracking-tighter">Vertical <span className="text-red-500">Panel</span></span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "bg-red-600/10 text-red-500" : "text-slate-500 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-black bg-slate-800 text-slate-400">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 border-t border-slate-800/60 mt-4">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Ver Sitio Web</span>
            </Link>
          </div>
        </nav>

        <div className="p-6 mt-auto border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 md:p-8 lg:p-12 overflow-y-auto min-w-0">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase italic tracking-tighter mb-2">
              {activeTab === "projects" && <>Gestión de <span className="text-red-500">Portafolio</span></>}
              {activeTab === "messages" && <>Bandeja de <span className="text-red-500">Mensajes</span></>}
              {activeTab === "forum" && <>Administración del <span className="text-red-500">Foro</span></>}
              {activeTab === "settings" && <>Ajustes de <span className="text-red-500">Contacto</span></>}
              {activeTab === "applications" && <>Bolsa de <span className="text-red-500">Trabajo</span></>}
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-bold uppercase tracking-widest">
              {activeTab === "projects" && "Añade o edita los proyectos realizados por la empresa."}
              {activeTab === "messages" && "Mensajes recibidos a través del formulario de contacto."}
              {activeTab === "forum" && "Crea y gestiona artículos y publicaciones del foro."}
              {activeTab === "settings" && "Actualiza la información de contacto global del sitio."}
              {activeTab === "applications" && "Revisa las postulaciones de técnicos y profesionales."}
            </p>
          </div>
          
          {activeTab === "projects" && (
            <button 
              onClick={openAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest italic text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-900/20"
            >
              <PlusCircle className="w-5 h-5" />
              Nuevo Proyecto
            </button>
          )}
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "projects" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {projects.map((project) => (
                  <motion.div 
                    key={project.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-[2rem] p-6 flex flex-col md:flex-row gap-6 relative group"
                  >
                    <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-slate-800 flex-shrink-0">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.2em] font-black text-red-500 mb-2 block">{project.category}</span>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter">{project.title}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {settings.latestProjectId === project.id ? (
                            <span 
                              title="Proyecto destacado actual en la página principal"
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-wider shadow-md shadow-amber-500/10"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                              <span>Destacado</span>
                            </span>
                          ) : (
                            <button 
                              onClick={() => handleSetFeatured(project.id)}
                              title="Marcar como proyecto destacado en Inicio"
                              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 transition-all text-[10px] font-bold uppercase tracking-wider border border-slate-700/60"
                            >
                              <Star className="w-3.5 h-3.5" />
                              <span>Destacar</span>
                            </button>
                          )}
                          <button 
                            onClick={() => openEditModal(project)}
                            title="Editar proyecto"
                            className="p-2.5 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition-colors hover:text-white border border-slate-700/60"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          {deleteConfirmId === project.id ? (
                            <button 
                              onClick={() => handleDeleteProject(project.id)}
                              className="px-3 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-bold text-xs"
                            >
                              Seguro?
                            </button>
                          ) : (
                            <button 
                              onClick={() => setDeleteConfirmId(project.id)}
                              title="Eliminar proyecto"
                              className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-colors hover:text-white border border-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="flex flex-wrap gap-4 mt-auto">
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-slate-500">
                          <User className="w-3 h-3" />
                          {project.client}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {projects.length === 0 && (
                  <div className="xl:col-span-2 bg-slate-900 border border-slate-800 border-dashed rounded-[3rem] p-20 text-center">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No hay proyectos publicados todavía.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "messages" && (
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div 
                    key={message.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 border border-slate-800 rounded-3xl p-8"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black uppercase italic tracking-tighter mb-1">{message.name}</h3>
                          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] uppercase tracking-widest font-black text-slate-500">
                            <span className="flex items-center gap-2"><Mail className="w-3 h-3" /> {message.email}</span>
                            {message.company && <span className="flex items-center gap-2"><Briefcase className="w-3 h-3" /> {message.company}</span>}
                            <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {formatDateTime(message.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{message.service}</span>
                        <button 
                          onClick={() => handleDeleteMessage(message.id)}
                          className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-colors hover:text-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl p-6 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                      {message.details}
                    </div>
                  </motion.div>
                ))}
                {messages.length === 0 && (
                  <div className="bg-slate-900 border border-slate-800 border-dashed rounded-[3rem] p-20 text-center">
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">No hay mensajes recibidos.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] p-10"
              >
                <div className="mb-8">
                  <h2 className="text-xl font-black uppercase italic tracking-tighter mb-2">Información Global</h2>
                  <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Estos datos se usan en el Footer y sección de Contacto.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Teléfono de Contacto</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={settings.phone}
                        onChange={(e) => setSettings({...settings, phone: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="+56 9 1234 5678"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Email Corporativo</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={settings.email}
                        onChange={(e) => setSettings({...settings, email: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="contacto@empresa.cl"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Dirección de Oficina</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={settings.address}
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Calle, Ciudad, Región"
                      />
                    </div>
                  </div>

                  <div className="pt-8 mb-8 border-t border-slate-800">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter mb-2">Último Proyecto (Home)</h2>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Selecciona el proyecto que aparecerá destacado como "Último Proyecto" en la página principal.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Proyecto Destacado</label>
                    <div className="relative">
                      <select
                        value={settings.latestProjectId || ""}
                        onChange={(e) => setSettings({...settings, latestProjectId: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white appearance-none"
                      >
                        <option value="">Ninguno (Ocultar sección)</option>
                        {projects.map((project) => (
                          <option key={project.id} value={project.id}>
                            {project.title} - {project.client}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mb-8 border-t border-slate-800">
                    <h2 className="text-xl font-black uppercase italic tracking-tighter mb-2">Textos del Hero (Inicio)</h2>
                    <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Modifica los textos principales que aparecen en la cabecera de la página web.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Etiqueta (Tagline)</label>
                    <input
                      type="text"
                      value={settings.heroTagline}
                      onChange={(e) => setSettings({...settings, heroTagline: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                      placeholder="Especialistas en inspecciones..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Título Línea 1</label>
                      <input
                        type="text"
                        value={settings.heroTitleLine1}
                        onChange={(e) => setSettings({...settings, heroTitleLine1: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Respuesta inmediata"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Título Línea 2</label>
                      <input
                        type="text"
                        value={settings.heroTitleLine2}
                        onChange={(e) => setSettings({...settings, heroTitleLine2: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="ante"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Título Línea 3</label>
                      <input
                        type="text"
                        value={settings.heroTitleLine3}
                        onChange={(e) => setSettings({...settings, heroTitleLine3: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="emergencias y"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Título Texto Resaltado (Rojo)</label>
                      <input
                        type="text"
                        value={settings.heroTitleHighlight}
                        onChange={(e) => setSettings({...settings, heroTitleHighlight: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="contingencias climáticas"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Descripción (Párrafo principal)</label>
                    <textarea
                      rows={4}
                      value={settings.heroDescription}
                      onChange={(e) => setSettings({...settings, heroDescription: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white resize-none"
                      placeholder="Ante temporales y otras contingencias..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] italic text-sm flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {isSavingSettings ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> Guardar Cambios</>}
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === "applications" && (
              <div className="space-y-6">
                {applications.length === 0 ? (
                  <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl">
                    <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Sin Postulaciones</h3>
                    <p className="text-slate-500 text-sm">Aún no hay postulaciones recibidas.</p>
                  </div>
                ) : (
                  applications.map((app) => (
                    <motion.div 
                      key={app.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black italic uppercase tracking-tighter">{app.name}</h3>
                            <span className="px-3 py-1 bg-red-600/10 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
                              Postulante
                            </span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-4 text-slate-400 text-sm font-medium">
                            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> {app.email}</div>
                            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> {app.phone}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Recibido</div>
                          <div className="text-sm font-medium">{formatDateTime(app.createdAt)}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-950 rounded-2xl mb-6 border border-slate-800">
                        <div>
                          <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-red-500" /> Experiencia Laboral
                          </h4>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
                            {app.experience}
                          </p>
                        </div>
                        <div className="space-y-6">
                          <div>
                            <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2">
                              <CheckCircle className="w-3 h-3 text-red-500" /> Certificaciones
                            </h4>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-300">
                              {app.certifications || "No especificadas"}
                            </p>
                          </div>
                          {app.portfolioUrl && (
                            <div>
                              <h4 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 mb-2 flex items-center gap-2">
                                <LinkIcon className="w-3 h-3 text-red-500" /> Enlace
                              </h4>
                              <a 
                                href={app.portfolioUrl} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-sm text-blue-400 hover:text-blue-300 underline"
                              >
                                {app.portfolioUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            )}

            {activeTab === "forum" && (
              <AdminForum />
            )}
          </div>
        )}
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl sm:rounded-[3rem] p-5 sm:p-10 shadow-3xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-5 right-5 sm:top-8 sm:right-8 text-slate-400 hover:text-white transition-colors p-2 bg-slate-800/60 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-10">
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">{isEditing ? "Editar" : "Añadir"} <span className="text-red-500">Proyecto</span></h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">{isEditing ? "Actualiza los detalles del proyecto." : "Completa los campos para publicar."}</p>
              </div>

              <form onSubmit={handleProjectSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Título del Proyecto</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Ej. Pintura de Fachada Edificio X"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Categoría</label>
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Ej. Industrial"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Imagen de Portada</label>
                    <div className="flex flex-col gap-4">
                      {formData.image && (
                        <div className="relative w-full h-32 rounded-2xl overflow-hidden border border-slate-800">
                          <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setFormData({...formData, image: ""})}
                            className="absolute top-2 right-2 p-1 bg-red-600 rounded-lg text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-800 border-dashed rounded-[2rem] cursor-pointer hover:bg-slate-950 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-8 h-8 text-slate-500 mb-2" />
                          <p className="text-[10px] text-slate-500 uppercase font-black">Seleccionar Imagen</p>
                        </div>
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Mandante (Cliente)</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={formData.client}
                        onChange={(e) => setFormData({...formData, client: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Nombre del Mandante"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Servicio Prestado</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={formData.serviceProvided}
                        onChange={(e) => setFormData({...formData, serviceProvided: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Ej. Mantenimiento de Torres"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Contratado por</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={formData.contractedBy}
                        onChange={(e) => setFormData({...formData, contractedBy: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Ej. Constructora XYZ"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Ubicación</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Ej. Viña del Mar, Chile"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Fecha de Ejecución</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={formData.executionDate}
                        onChange={(e) => setFormData({...formData, executionDate: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white"
                        placeholder="Ej. Marzo 2024"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Galería de Fotos</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    {formData.gallery.map((img, idx) => (
                      <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border border-slate-800">
                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeGalleryImage(idx)}
                          className="absolute top-2 right-2 p-1 bg-red-600 rounded-lg text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-slate-800 border-dashed rounded-2xl cursor-pointer hover:bg-slate-950 transition-colors">
                      <Plus className="w-6 h-6 text-slate-500" />
                      <input type="file" className="hidden" accept="image/*" multiple onChange={handleGalleryUpload} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Descripción</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm focus:outline-none focus:border-red-500 transition-colors text-white min-h-[150px] resize-none"
                    placeholder="Describe los detalles del proyecto..."
                  />
                </div>

                <div 
                  onClick={() => setIsFeaturedInForm(!isFeaturedInForm)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${
                    isFeaturedInForm 
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-300" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    id="featured-checkbox"
                    checked={isFeaturedInForm}
                    onChange={(e) => setIsFeaturedInForm(e.target.checked)}
                    className="w-5 h-5 accent-red-600 rounded cursor-pointer"
                  />
                  <label htmlFor="featured-checkbox" className="cursor-pointer text-xs font-bold flex items-center gap-2 select-none">
                    <Star className={`w-4 h-4 ${isFeaturedInForm ? "fill-amber-400 text-amber-400" : "text-slate-500"}`} />
                    <span>Fijar como Proyecto Destacado en Inicio (Sección "Último Proyecto")</span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] italic text-sm flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    isEditing ? "Guardar Cambios" : "Publicar Proyecto"
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
