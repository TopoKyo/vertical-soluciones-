import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Building2, Building, Mountain, Factory, TowerControl, ChevronRight, HardHat, Shield, CheckCircle2, Loader2 } from "lucide-react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

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

  const allProjects = [...dbProjects];

  return (
    <div className="pt-24 min-h-screen bg-slate-50 text-slate-900">
      <section className="py-20 border-b border-slate-300">
        <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
          <span className="text-red-500 font-bold text-xs tracking-[0.4em] uppercase mb-4 block">Experiencia Comprobada</span>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 leading-none">
            Nuestro <span className="text-red-500">Portafolio</span>
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
            Proyectos ejecutados bajo los más altos estándares industriales en todo Chile.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {allProjects.map((project, idx) => (
                <Link key={project.id} to={`/portafolio/${project.id}`}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="group flex flex-col h-full bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:border-red-500/30 transition-all cursor-pointer"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                      <div className="absolute top-4 left-4">
                        <span className="px-4 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full">{project.category}</span>
                      </div>
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                      <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">{project.title}</h3>
                      <div className="flex-grow flex flex-col gap-2 mb-6 text-sm">
                        {project.location && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Ubicación</span>
                            <span className="text-slate-700 text-right">{project.location}</span>
                          </div>
                        )}
                        {project.serviceProvided && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Servicio</span>
                            <span className="text-slate-700 text-right line-clamp-1">{project.serviceProvided}</span>
                          </div>
                        )}
                        {project.executionDate && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-200/50">
                            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-wider">Fecha</span>
                            <span className="text-slate-700 text-right">{project.executionDate}</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-xs">
                        <span className="text-slate-500 uppercase tracking-widest font-bold">Cliente: {project.client}</span>
                        <ChevronRight className="w-4 h-4 text-red-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-white/40 border-y border-slate-300">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-8 leading-tight">
              Capacidad para <span className="text-red-500">Desafíos</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div className="p-6 bg-white border border-slate-200 rounded-3xl">
                  <Shield className="w-8 h-8 text-red-500 mb-4" />
                  <div className="text-xl font-black italic uppercase mb-1">ANSI / IRATA</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Normativas Globales</div>
               </div>
               <div className="p-6 bg-white border border-slate-200 rounded-3xl">
                  <HardHat className="w-8 h-8 text-red-500 mb-4" />
                  <div className="text-xl font-black italic uppercase mb-1">+500 Proyectos</div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Finalizados con Éxito</div>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div className="h-48 rounded-3xl bg-slate-100 relative overflow-hidden">
                <img src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover opacity-50" alt="Work" referrerPolicy="no-referrer" />
             </div>
             <div className="h-48 rounded-3xl bg-red-600 flex flex-col items-center justify-center p-6 text-center">
                <Factory className="w-8 h-8 mb-2" />
                <span className="text-sm font-black uppercase italic">Industria 4.0</span>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
}
