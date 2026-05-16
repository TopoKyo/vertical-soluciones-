import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Pencil
} from "lucide-react";
import { db, auth } from "../lib/firebase";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "settings" | "messages">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Settings state
  const [settings, setSettings] = useState({
    phone: "",
    email: "",
    address: "",
    aiPrompt: ""
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ 
            ...prev, 
            gallery: [...prev.gallery, reader.result as string] 
          }));
        };
        reader.readAsDataURL(file);
      });
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
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(data);
      } else if (activeTab === "settings") {
        const docRef = doc(db, "settings", "contact");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } else if (activeTab === "messages") {
        const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        setMessages(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("admin_auth");
    navigate("/admin");
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este proyecto?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        setProjects(projects.filter(p => p.id !== id));
      } catch (error) {
        alert("Error al eliminar el proyecto.");
      }
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
      await setDoc(doc(db, "settings", "contact"), {
        ...settings,
        updatedAt: serverTimestamp()
      });
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
      const projectData = {
        ...formData,
        updatedAt: serverTimestamp()
      };
      
      if (isEditing && editingId) {
        await setDoc(doc(db, "projects", editingId), projectData, { merge: true });
      } else {
        await addDoc(collection(db, "projects"), {
          ...projectData,
          createdAt: serverTimestamp()
        });
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
      fetchData();
    } catch (error) {
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
    setIsEditing(false);
    setEditingId(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex font-medium">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-900 hidden lg:flex flex-col">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center font-black italic text-sm">V</div>
            <span className="font-black uppercase italic text-sm tracking-tighter">Vertical <span className="text-red-500">Panel</span></span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-2">
          <button 
            onClick={() => setActiveTab("projects")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "projects" ? "bg-red-600/10 text-red-500" : "text-slate-500 hover:text-white"}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Portafolio
          </button>
          <button 
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "messages" ? "bg-red-600/10 text-red-500" : "text-slate-500 hover:text-white"}`}
          >
            <MessageSquare className="w-4 h-4" />
            Mensajes
          </button>
          <button 
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === "settings" ? "bg-red-600/10 text-red-500" : "text-slate-500 hover:text-white"}`}
          >
            <SettingsIcon className="w-4 h-4" />
            Configuración
          </button>
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
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black uppercase italic tracking-tighter mb-2">
              {activeTab === "projects" && <>Gestión de <span className="text-red-500">Portafolio</span></>}
              {activeTab === "messages" && <>Bandeja de <span className="text-red-500">Mensajes</span></>}
              {activeTab === "settings" && <>Ajustes de <span className="text-red-500">Contacto</span></>}
            </h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
              {activeTab === "projects" && "Añade o elimina proyectos realizados por la empresa."}
              {activeTab === "messages" && "Mensajes recibidos a través del formulario de contacto."}
              {activeTab === "settings" && "Actualiza la información de contacto global del sitio."}
            </p>
          </div>
          
          {activeTab === "projects" && (
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest italic text-sm transition-all hover:scale-105 shadow-xl shadow-red-900/20"
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
                        <div className="flex gap-2">
                          <button 
                            onClick={() => openEditModal(project)}
                            className="p-3 bg-slate-800 text-slate-400 rounded-xl hover:bg-slate-700 transition-colors hover:text-white"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 transition-colors hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                            <span className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {message.createdAt?.toDate().toLocaleString() || "Recién enviado"}</span>
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

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Base de Conocimiento AI</label>
                    <textarea
                      rows={6}
                      value={settings.aiPrompt}
                      onChange={(e) => setSettings({...settings, aiPrompt: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-white resize-none"
                      placeholder="Escribe aquí la información sobre la empresa, servicios, precios o lo que quieras que el chatbot sepa para responder..."
                    />
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold ml-2">Usa este espacio para dar contexto al asistente virtual.</p>
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
          </div>
        )}
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-12">
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
              className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-[3rem] p-10 shadow-3xl overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
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
