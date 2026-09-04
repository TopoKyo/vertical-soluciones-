import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  User, 
  Briefcase, 
  ShieldCheck, 
  Loader2,
  Maximize2
} from "lucide-react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

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
}

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProject() {
      if (!id) return;
      try {
        const docSnap = await getDoc(doc(db, "projects", id));
        if (docSnap.exists()) {
          setProject({ id: docSnap.id, ...docSnap.data() } as Project);
          setSelectedImage((docSnap.data() as Project).image);
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen pt-24 bg-slate-50 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4">Proyecto no encontrado</h1>
        <Link to="/portafolio" className="text-red-500 font-bold uppercase text-sm tracking-widest flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" />
          Volver al portafolio
        </Link>
      </div>
    );
  }

  const technicalData = [
    { label: "Servicio prestado", value: project.serviceProvided, icon: <Briefcase className="w-4 h-4" /> },
    { label: "Mandante", value: project.client, icon: <User className="w-4 h-4" /> },
    { label: "Contratado por", value: project.contractedBy, icon: <ShieldCheck className="w-4 h-4" /> },
    { label: "Ubicación", value: project.location, icon: <MapPin className="w-4 h-4" /> },
    { label: "Fecha de ejecución", value: project.executionDate, icon: <Calendar className="w-4 h-4" /> },
  ];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Breadcrumb */}
        <Link to="/portafolio" className="inline-flex items-center gap-2 text-slate-500 hover:text-red-500 transition-colors uppercase text-[10px] font-black tracking-widest mb-8">
          <ChevronLeft className="w-4 h-4" />
          Volver al Portafolio
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-video rounded-[2rem] overflow-hidden bg-white border border-slate-200 group"
            >
              <img 
                src={selectedImage || project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 right-6">
                 <div className="bg-slate-50/60 backdrop-blur-md p-3 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-5 h-5 text-slate-900" />
                 </div>
              </div>
            </motion.div>

            {project.gallery && project.gallery.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {[project.image, ...project.gallery].map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === img ? "border-red-500 scale-95" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <span className="text-red-500 font-bold text-xs tracking-[0.4em] uppercase mb-4 block">Ficha de Proyecto</span>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 leading-none">
              {project.title}
            </h1>
            <span className="inline-block px-4 py-1.5 bg-red-600/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full self-start mb-8 border border-red-500/20">
              {project.category}
            </span>

            <div className="bg-white/50 border border-slate-200 rounded-[2rem] p-8 mb-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600 mb-6 border-b border-slate-200 pb-4">Especificaciones Técnicas</h3>
              <div className="space-y-6">
                {technicalData.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{item.label}</div>
                      <div className="text-sm font-bold text-slate-900">{item.value || "No especificado"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/50 border border-slate-200 rounded-[2rem] p-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-600 mb-4">Descripción del Proyecto</h3>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
