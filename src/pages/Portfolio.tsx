import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Building2, Building, Mountain, Factory, TowerControl, ChevronRight, HardHat, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const STATIC_PROJECTS = [
  {
    id: "static-1",
    title: "Torre Atlantis - Viña del Mar",
    category: "Residencial / Fachada",
    description: "Impermeabilización total de fachadas y sellado de ventanales termo-panel en torre de 25 pisos.",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
    client: "Inmobiliaria Mar del Plata",
  },
  {
    id: "static-2",
    title: "Planta Industrial ENEX",
    category: "Mantenimiento Industrial",
    description: "Limpieza técnica de silos y estructuras metálicas de alto alcance mediante sistemas de cuerdas.",
    image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=800",
    client: "ENEX Chile",
  },
  {
    id: "static-3",
    title: "Edificio Corporativo CCU",
    category: "Corporativo",
    description: "Lavado de fachada curtain wall y mantención de sistemas de anclaje certificados.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    client: "CCU S.A.",
  },
  {
    id: "static-4",
    title: "Minera Los Pelambres",
    category: "Minería",
    description: "Instalación de líneas de vida definitivas en correas transportadoras y chancadores.",
    image: "https://images.unsplash.com/photo-1579389083395-4507e9f4c171?auto=format&fit=crop&q=80&w=800",
    client: "Antofagasta Minerals",
  },
  {
    id: "static-5",
    title: "Centro Logístico San Antonio",
    category: "Industrial",
    description: "Pintura industrial de cubiertas y reparación de canaletas en bodegas de gran formato.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    client: "DLP Logística",
  }
];

export default function Portfolio() {
  const [dbProjects, setDbProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDbProjects(projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const allProjects = [...dbProjects, ...STATIC_PROJECTS];

  return (
    <div className="pt-24 min-h-screen bg-slate-950 text-slate-50">
      <section className="py-20 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
          <span className="text-orange-500 font-bold text-xs tracking-[0.4em] uppercase mb-4 block">Experiencia Comprobada</span>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
            Nuestro <span className="text-orange-500">Portafolio</span>
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
            Proyectos ejecutados bajo los más altos estándares industriales en todo Chile.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, idx) => (
                <motion.div
                  key={project.id || project.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="group flex flex-col bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-orange-500/30 transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-1 bg-orange-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{project.category}</span>
                    </div>
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">{project.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 flex-grow">{project.description}</p>
                    <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-xs">
                      <span className="text-slate-500 uppercase tracking-widest font-bold">Cliente: {project.client}</span>
                      <ChevronRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-slate-900/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-8 leading-tight">
              Capacidad para <span className="text-orange-500">Desafíos</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                  <Shield className="w-8 h-8 text-orange-500 mb-4" />
                  <div className="text-xl font-black italic uppercase mb-1">ANSI / IRATA</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Normativas Globales</div>
               </div>
               <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                  <HardHat className="w-8 h-8 text-orange-500 mb-4" />
                  <div className="text-xl font-black italic uppercase mb-1">+500 Proyectos</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Finalizados con Éxito</div>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="h-48 rounded-3xl bg-slate-800 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-50" alt="Work" referrerPolicy="no-referrer" />
             </div>
             <div className="h-48 rounded-3xl bg-orange-600 flex flex-col items-center justify-center p-6 text-center">
                <Factory className="w-8 h-8 mb-2" />
                <span className="text-sm font-black uppercase italic">Industria 4.0</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
