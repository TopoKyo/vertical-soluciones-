import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { 
  Shield, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  ChevronRight, 
  Droplets, 
  Wrench, 
  HardHat, 
  Sparkles, 
  Paintbrush, 
  Link as LinkIcon, 
  Factory, 
  Mountain,
  Building2,
  Building,
  Zap,
  TowerControl,
  CheckCircle2,
  ExternalLink,
  Loader2,
  ArrowRight
} from "lucide-react";

import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";

const SERVICES = [
  {
    title: "Impermeabilización",
    description: "Sellado técnico de fachadas y techumbres para protección contra humedad.",
    icon: <Droplets className="w-8 h-8" />,
    image: "/impermeabilizacion.jpg"
  },
  {
    title: "Reparaciones en Altura",
    description: "Rehabilitación estructural y reparación de elementos en lugares de difícil acceso.",
    icon: <Wrench className="w-8 h-8" />,
    image: "/reparacion-alturas.jpg"
  },
  {
    title: "Trabajos Verticales (Rope Access)",
    description: "Técnicos certificados IRATA/ANETVA para maniobras seguras con cuerdas.",
    icon: <LinkIcon className="w-8 h-8" />,
    image: "/trabajos-verticales.jpg"
  },
  {
    title: "Limpieza de Fachadas",
    description: "Mantención estética y funcional de vidrios y superficies en altura.",
    icon: <Sparkles className="w-8 h-8" />,
    image: "/limpieza-fachadas.jpg"
  },
  {
    title: "Pintura e Industrias",
    description: "Aplicación de recubrimientos industriales y rehabilitación de fachadas.",
    icon: <Paintbrush className="w-8 h-8" />,
    image: "/pintura-industrias.jpg"
  },
  {
    title: "Líneas de Vida",
    description: "Cálculo, instalación y certificación de sistemas de anclaje y seguridad.",
    icon: <Shield className="w-8 h-8" />,
    image: "/lineas-vida.jpg"
  },
  {
    title: "Mantenimiento Industrial",
    description: "Soluciones de mantenimiento preventivo y correctivo en plantas y procesos.",
    icon: <Factory className="w-8 h-8" />,
    image: "/mantenimiento-industrial.jpg"
  },
  {
    title: "Difícil Acceso",
    description: "Llegamos donde otros no pueden con soluciones técnicas personalizadas.",
    icon: <Mountain className="w-8 h-8" />,
    image: "/dificil-acceso.jpg"
  }
];

const INDUSTRIES = [
  { name: "Minería", icon: <Mountain className="w-6 h-6" /> },
  { name: "Energía", icon: <Zap className="w-6 h-6" /> },
  { name: "Inmobiliarias", icon: <Building className="w-6 h-6" /> },
  { name: "Edificios Corporativos", icon: <Building2 className="w-6 h-6" /> },
  { name: "Industrias", icon: <Factory className="w-6 h-6" /> },
  { name: "Plantas Industriales", icon: <TowerControl className="w-6 h-6" /> }
];

const DIFFERENTIATORS = [
  { title: "Respuesta Rápida", text: "Atención inmediata para urgencias y proyectos críticos.", icon: <Clock /> },
  { title: "Personal Especializado", text: "Técnicos certificados con vasta experiencia técnica.", icon: <HardHat /> },
  { title: "Cobertura Nacional", text: "Operamos en Viña del Mar y en todas las regiones de Chile.", icon: <MapPin /> },
  { title: "Seguridad y Eficiencia", text: "Protocolos estrictos para minimizar riesgos y tiempos.", icon: <CheckCircle2 /> }
];

export default function Home() {
  const [formState, setFormState] = useState({
    name: "",
    company: "",
    email: "",
    service: "Seleccione un servicio...",
    details: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [settings, setSettings] = useState({
    phone: "+56 9 5398 8893",
    email: "contacto@verticalsoluciones.cl",
    address: "Av. Libertad 269, Viña del Mar"
  });

  useEffect(() => {
    async function fetchSettings() {
      try {
        const docRef = doc(db, "settings", "contact");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings(docSnap.data() as any);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    }
    fetchSettings();
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.service === "Seleccione un servicio...") {
      alert("Por favor seleccione un servicio.");
      return;
    }
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "messages"), {
        ...formState,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setFormState({ name: "", company: "", email: "", service: "Seleccione un servicio...", details: "" });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Hubo un error al enviar el mensaje. Por favor intente más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <header id="inicio" className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/ferrovial-15.jpg" 
            alt="Vertical work on high rise building" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-1.5 bg-red-600/10 border border-red-500/20 text-red-500 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6">
              Expertos en Trabajos de Alto Riesgo
            </span>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase leading-none mb-6 tracking-tighter">
              Soluciones <br />
              Verticales de <br />
              <span className="text-red-500">Alto Nivel</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              Mantenimiento industrial, rope access y rehabilitación de fachadas en todo Chile. Seguridad extrema, rapidez de ejecución y resultados profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contacto" className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-2 group active:scale-95">
                Solicitar Cotización
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#servicios" className="border border-slate-700 hover:bg-slate-800 text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 active:scale-95">
                Nuestros Servicios
              </a>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-6 hidden xl:flex flex-col gap-4">
          <div className="flex items-center gap-4 text-[10px] tracking-[0.3em] font-bold uppercase text-slate-500">
            <span className="w-12 h-[1px] bg-slate-800" />
            Viña del Mar · Chile
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          {DIFFERENTIATORS.map((item, idx) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start gap-4"
            >
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-red-500 flex-shrink-0">
                {item.icon}
              </div>
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider mb-1">{item.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="sobre-nosotros" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-4"
            >
              <div className="relative w-full max-w-[850px] mx-auto group">
                {/* Imagen de fondo (Trabajo en terreno) - Ahora rectangular y define el tamaño del contenedor */}
                <div className="relative w-full z-10">
                  <img 
                    src="/background-worker.jpg" 
                    alt="Trabajo en Terreno" 
                    className="w-full h-auto aspect-[3/4] object-cover rounded-[3rem] border-2 border-slate-800 shadow-2xl transition-all duration-700 group-hover:scale-[1.01] grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100"
                  />
                </div>
                
                {/* Imagen circular principal (Técnico) - Posicionada abajo a la derecha */}
                <div className="absolute -bottom-10 -right-10 md:-bottom-12 md:-right-12 z-20 w-1/2 aspect-square">
                  <img 
                    src="/technician.jpg" 
                    alt="Técnico Especialista" 
                    className="rounded-full shadow-2xl border-[6px] md:border-[10px] border-slate-950 w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-pulse pointer-events-none" />
                </div>
                
                {/* Badge de experticia */}
                <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl hidden md:block z-30">
                  <div className="text-4xl font-black text-red-500 mb-1 italic uppercase tracking-tighter">15+</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Años de Experticia</div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-8 bg-gradient-to-r from-white to-slate-500 bg-clip-text text-transparent">
                Compromiso con la <br /> <span className="text-red-500">Excelencia Técnica</span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed text-lg">
                Vertical Soluciones nace como respuesta a la creciente necesidad de servicios especializados en estructuras complejas. Utilizamos técnicos certificados IRATA/ANETVA, garantizando maniobras seguras y eficientes bajo los más altos protocolos de riesgo.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  "Técnicos certificados y en continua capacitación.",
                  "Análisis de riesgo y planificación técnica detallada.",
                  "Equipamiento de última generación certificado.",
                  "Soluciones a medida para proyectos complejos."
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="text-red-500 w-5 h-5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="group flex items-center gap-2 text-red-500 font-bold uppercase text-sm tracking-widest hover:text-red-400 transition-colors">
                Descargar Dossier Corporativo
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="servicios" className="py-24 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Capacidades Técnicas</span>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                Especialidades en <span className="text-red-500">Mantenimiento</span>
              </h2>
            </div>
            <div className="flex flex-col items-end gap-4">
              <p className="text-slate-500 max-w-sm text-sm text-right">
                Desplegamos equipos especializados en cada área para asegurar la integridad de sus activos industriales e inmobiliarios.
              </p>
              <Link to="/portafolio" className="text-red-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2 hover:text-red-400 transition-colors group">
                Ver Portafolio de Proyectos
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {SERVICES.map((service, idx) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="group relative h-[400px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-900"
              >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="text-red-500 mb-4 transition-transform duration-500 group-hover:-translate-y-2">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-black uppercase italic tracking-tighter mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-snug opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0 text-balance">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects / Portfolio Preview */}
      <section id="portafolio-destacado" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="max-w-2xl">
              <span className="text-red-500 font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Nuestro Trabajo</span>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                Proyectos <span className="text-red-500">Destacados</span>
              </h2>
            </div>
            <Link to="/portafolio" className="bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white px-8 py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 group active:scale-95">
              Ver Todo el Portafolio
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Torre Atlantis",
                category: "Residencial",
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800",
                location: "Viña del Mar"
              },
              {
                title: "Planta Industrial ENEX",
                category: "Industrial",
                image: "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&q=80&w=800",
                location: "Concón"
              },
              {
                title: "Corporativo CCU",
                category: "Fachada",
                image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
                location: "Santiago"
              }
            ].map((project, idx) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-slate-800 bg-slate-900"
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-10">
                  <span className="px-3 py-1 bg-red-600 text-[10px] font-black uppercase tracking-widest rounded-full text-white mb-4 inline-block shadow-lg shadow-red-900/40">
                    {project.category}
                  </span>
                  <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">{project.title}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <MapPin className="w-3 h-3 text-red-500" />
                    {project.location}
                  </div>
                </div>
                
                <Link 
                  to="/portafolio" 
                  className="absolute inset-0 z-10"
                  aria-label={`Ver proyecto ${project.title}`}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="seguridad" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-red-600 rounded-[3rem] p-12 md:p-24 relative overflow-hidden border border-red-500 shadow-2xl shadow-red-900/40">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 text-white">
              <div>
                <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                  Seguridad <br /> Operacional <br /> <span className="opacity-60 text-slate-950">Sin Concesiones</span>
                </h2>
                <p className="text-white/90 text-lg mb-10 max-w-lg font-medium leading-relaxed">
                  En trabajos verticales, el riesgo es nulo cuando la planificación es perfecta. Nuestros protocolos exceden las normativas vigentes en Chile.
                </p>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <div className="text-3xl font-black italic uppercase mb-2">100%</div>
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">Equipos Certificados</div>
                    </div>
                    <div>
                        <div className="text-3xl font-black italic uppercase mb-2">Zero</div>
                        <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">Incidentes Críticos</div>
                    </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Protocolos Técnicos", icon: <TowerControl /> },
                  { title: "Equipos UV/ANSI", icon: <Shield /> },
                  { title: "Análisis de Riesgo", icon: <CheckCircle2 /> },
                  { title: "Capacitación Continua", icon: <HardHat /> }
                ].map((item) => (
                  <div key={item.title} className="bg-slate-950/20 backdrop-blur-sm border border-white/20 rounded-3xl p-8 flex flex-col items-center justify-center text-center gap-4 hover:bg-slate-950/30 transition-all">
                    <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-2xl">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Slider */}
      <section id="industrias" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-red-500 font-bold text-xs tracking-[0.4em] uppercase mb-4 block">Sectores de Operación</span>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
              Industrias que <span className="text-red-500">Confían</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Ofrecemos soluciones integrales para los sectores más exigentes del país.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {INDUSTRIES.map((industry, idx) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                viewport={{ once: true }}
                className="bg-slate-900/50 border border-slate-800 p-10 rounded-3xl flex flex-col items-center text-center gap-6 hover:bg-slate-900 transition-all hover:border-red-500/50 group"
              >
                <div className="w-20 h-20 bg-slate-800 text-red-500 rounded-[2rem] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                  {industry.icon}
                </div>
                <h3 className="text-lg font-bold uppercase tracking-widest">{industry.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 bg-slate-900/20 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none">
                ¿Listo para su <br /> <span className="text-red-500">Próximo Desafío?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-12">
                Agende una visita técnica o solicite su presupuesto personalizado. Nuestro equipo de expertos está listo para asesorarlo.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Llámanos o WhatsApp</div>
                    <div className="text-xl font-bold">{settings.phone}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Dirección Corporativa</div>
                    <div className="text-xl font-bold">{settings.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-red-600/10 text-red-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Email Consultas</div>
                    <div className="text-xl font-bold">{settings.email}</div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-12 rounded-3xl overflow-hidden border border-slate-800 grayscale h-[300px] relative group">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800" 
                  alt="Vina del Mar Map Placeholder" 
                  className="w-full h-full object-cover opacity-40"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/60 transition-opacity group-hover:opacity-40">
                  <div className="bg-red-600 p-4 rounded-2xl shadow-2xl">
                    <MapPin className="text-white w-8 h-8" />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl text-[10px] uppercase tracking-widest font-bold flex justify-between items-center">
                  Ver en Google Maps
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="bg-slate-900 p-8 md:p-12 rounded-[2rem] border border-slate-800 shadow-2xl shadow-slate-950">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-4">¡Mensaje Enviado!</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Nos pondremos en contacto a la brevedad.</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Nombre Completo</label>
                        <input 
                          type="text" 
                          required
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors" 
                          placeholder="Su nombre..." 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Empresa / Comunidad</label>
                        <input 
                          type="text" 
                          value={formState.company}
                          onChange={(e) => setFormState({...formState, company: e.target.value})}
                          className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors" 
                          placeholder="Nombre empresa..." 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Email de Contacto</label>
                      <input 
                        type="email" 
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({...formState, email: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors" 
                        placeholder="email@ejemplo.cl" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Servicio Requerido</label>
                      <select 
                        required
                        value={formState.service}
                        onChange={(e) => setFormState({...formState, service: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors appearance-none"
                      >
                        <option disabled>Seleccione un servicio...</option>
                        {SERVICES.map(s => <option key={s.title}>{s.title}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Detalles del Requerimiento</label>
                      <textarea 
                        rows={4} 
                        required
                        value={formState.details}
                        onChange={(e) => setFormState({...formState, details: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors resize-none" 
                        placeholder="Describa el trabajo a realizar..."
                      ></textarea>
                    </div>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-[0.3em] py-6 rounded-2xl shadow-xl shadow-red-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 italic text-sm flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Mensaje"}
                    </button>
                    <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-bold">
                      * Respondemos en menos de 24 horas hábiles
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
