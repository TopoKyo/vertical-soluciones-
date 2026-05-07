/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
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
  TowerControl, // Using TowerControl as proxy for industrial masts/plants
  CheckCircle2,
  Menu,
  X,
  ExternalLink
} from "lucide-react";
import { useState, useEffect } from "react";

const SERVICES = [
  {
    title: "Impermeabilización",
    description: "Sellado técnico de fachadas y techumbres para protección contra humedad.",
    icon: <Droplets className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Reparaciones en Altura",
    description: "Rehabilitación estructural y reparación de elementos en lugares de difícil acceso.",
    icon: <Wrench className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Trabajos Verticales (Rope Access)",
    description: "Técnicos certificados IRATA/ANETVA para maniobras seguras con cuerdas.",
    icon: <LinkIcon className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1516216628859-9bccecad13ec?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Limpieza de Fachadas",
    description: "Mantención estética y funcional de vidrios y superficies en altura.",
    icon: <Sparkles className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Pintura e Industrias",
    description: "Aplicación de recubrimientos industriales y rehabilitación de fachadas.",
    icon: <Paintbrush className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Líneas de Vida",
    description: "Cálculo, instalación y certificación de sistemas de anclaje y seguridad.",
    icon: <Shield className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1590483734724-38817567d8a4?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Mantenimiento Industrial",
    description: "Soluciones de mantenimiento preventivo y correctivo en plantas y procesos.",
    icon: <Factory className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Difícil Acceso",
    description: "Llegamos donde otros no pueden con soluciones técnicas personalizadas.",
    icon: <Mountain className="w-8 h-8" />,
    image: "https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=800"
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

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <nav id="navbar" className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-slate-950/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-600 flex items-center justify-center rounded-lg shadow-lg shadow-orange-900/20">
              <Mountain className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">
              Vertical <span className="text-orange-500">Soluciones</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {["Inicio", "Servicios", "Sobre Nosotros", "Industrias", "Seguridad"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="hover:text-orange-500 transition-colors uppercase">
                {item}
              </a>
            ))}
            <a href="#contacto" className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full transition-all shadow-lg shadow-orange-900/20 active:scale-95">
              CONTACTO
            </a>
          </div>

          {/* Mobile Toggle */}
          <button id="menu-toggle" className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-slate-900 pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold uppercase italic">
              {["Inicio", "Servicios", "Sobre Nosotros", "Industrias", "Seguridad", "Contacto"].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase().replace(" ", "-")}`} 
                  onClick={() => setIsMenuOpen(false)}
                  className="hover:text-orange-500 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <header id="inicio" className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=1920" 
            alt="Vertical work on high rise building" 
            className="w-full h-full object-cover opacity-40"
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
            <span className="inline-block px-4 py-1.5 bg-orange-600/10 border border-orange-500/20 text-orange-500 rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6">
              Expertos en Trabajos de Alto Riesgo
            </span>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase leading-none mb-6 tracking-tighter">
              Soluciones <br />
              Verticales de <br />
              <span className="text-orange-500">Alto Nivel</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-xl leading-relaxed">
              Mantenimiento industrial, rope access y rehabilitación de fachadas en todo Chile. Seguridad extrema, rapidez de ejecución y resultados profesionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#contacto" className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase transition-all shadow-xl shadow-orange-900/30 flex items-center justify-center gap-2 group active:scale-95">
                Solicitar Cotización
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#servicios" className="border border-slate-700 hover:bg-slate-800 text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 active:scale-95">
                Nuestros Servicios
              </a>
            </div>
          </motion.div>
        </div>

        {/* Floating indicators */}
        <div className="absolute bottom-10 left-6 hidden xl:flex flex-col gap-4">
          <div className="flex items-center gap-4 text-[10px] tracking-[0.3em] font-bold uppercase text-slate-500">
            <span className="w-12 h-[1px] bg-slate-800" />
            Viña del Mar · Chile
          </div>
        </div>
      </header>

      {/* Stats / Differentiators Bar */}
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
              <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-orange-500 flex-shrink-0">
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

      {/* About Us */}
      <section id="sobre-nosotros" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-4"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl -z-10" />
              <img 
                src="https://images.unsplash.com/photo-1544724569-5f546fa6623c?auto=format&fit=crop&q=80&w=800" 
                alt="Technician working at height" 
                className="rounded-3xl shadow-2xl border border-slate-800 w-full object-cover aspect-[4/5]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-10 -right-10 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl hidden md:block">
                <div className="text-4xl font-black text-orange-500 mb-1 italic uppercase tracking-tighter">15+</div>
                <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Años de Experticia</div>
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
                Compromiso con la <br /> <span className="text-orange-500">Excelencia Técnica</span>
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
                    <CheckCircle2 className="text-orange-500 w-5 h-5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="group flex items-center gap-2 text-orange-500 font-bold uppercase text-sm tracking-widest hover:text-orange-400 transition-colors">
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
              <span className="text-orange-500 font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Capacidades Técnicas</span>
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
                Especialidades en <span className="text-orange-500">Mantenimiento</span>
              </h2>
            </div>
            <p className="text-slate-500 max-w-sm text-sm">
              Desplegamos equipos especializados en cada área para asegurar la integridad de sus activos industriales e inmobiliarios.
            </p>
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
                  <div className="text-orange-500 mb-4 transition-transform duration-500 group-hover:-translate-y-2">
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

      {/* Safety Highlight */}
      <section id="seguridad" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-orange-600 rounded-[3rem] p-12 md:p-24 relative overflow-hidden border border-orange-500 shadow-2xl shadow-orange-900/40">
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

      {/* Industries Grid */}
      <section id="industrias" className="py-24 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-orange-500 font-bold text-xs tracking-[0.4em] uppercase mb-4 block">Sectores de Operación</span>
            <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-6">
              Industrias que <span className="text-orange-500">Confían</span>
            </h2>
            <p className="text-slate-500 text-lg">
              Ofrecemos soluciones integrales para los sectores más exigentes del país, desde la minería en el norte hasta plantas industriales en el sur.
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
                className="bg-slate-900/50 border border-slate-800 p-10 rounded-3xl flex flex-col items-center text-center gap-6 hover:bg-slate-900 transition-all hover:border-orange-500/50 group"
              >
                <div className="w-20 h-20 bg-slate-800 text-orange-500 rounded-[2rem] flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
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
                ¿Listo para su <br /> <span className="text-orange-500">Próximo Desafío?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-12">
                Agende una visita técnica o solicite su presupuesto personalizado. Nuestro equipo de expertos está listo para asesorarlo.
              </p>
              
              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-orange-600/10 text-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Teléfono Directo</div>
                    <div className="text-xl font-bold">+56 9 5398 8893</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-orange-600/10 text-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Dirección Corporativa</div>
                    <div className="text-xl font-bold">Av. Libertad 269, Viña del Mar</div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-orange-600/10 text-orange-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-1">Email Consultas</div>
                    <div className="text-xl font-bold">contacto@verticalsoluciones.cl</div>
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
                  <div className="bg-orange-600 p-4 rounded-2xl shadow-2xl">
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
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Nombre Completo</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-500 transition-colors" placeholder="Su nombre..." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Empresa / Comunidad</label>
                      <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-500 transition-colors" placeholder="Nombre empresa..." />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Email de Contacto</label>
                    <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-500 transition-colors" placeholder="email@ejemplo.cl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Servicio Requerido</label>
                    <select className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-500 transition-colors appearance-none">
                      <option>Seleccione un servicio...</option>
                      {SERVICES.map(s => <option key={s.title}>{s.title}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">Detalles del Requerimiento</label>
                    <textarea rows={4} className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-orange-500 transition-colors resize-none" placeholder="Describa el trabajo a realizar..."></textarea>
                  </div>
                  
                  <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-black uppercase tracking-[0.3em] py-6 rounded-2xl shadow-xl shadow-orange-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4 italic text-sm">
                    Enviar Mensaje
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-600 uppercase tracking-widest font-bold">
                    * Respondemos en menos de 24 horas hábiles
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20 text-center md:text-left">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
                <div className="w-8 h-8 bg-orange-600 flex items-center justify-center rounded-lg">
                  <Mountain className="text-white w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-tighter uppercase italic">
                  Vertical <span className="text-orange-500">Soluciones</span>
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Especialistas en trabajos de alto riesgo y mantenimiento en altura con base en Viña del Mar y operaciones en todo Chile.
              </p>
              <div className="flex gap-4 justify-center md:justify-start">
                <div className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer bg-slate-900/50">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer bg-slate-900/50">
                  <Building className="w-4 h-4" />
                </div>
                <div className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:border-orange-500 hover:text-orange-500 transition-all cursor-pointer bg-slate-900/50">
                  <TowerControl className="w-4 h-4" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-white mb-8">Navegación</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#servicios" className="hover:text-orange-500 transition-colors">Portafolio de Servicios</a></li>
                <li><a href="#sobre-nosotros" className="hover:text-orange-500 transition-colors">Nuestra Trayectoria</a></li>
                <li><a href="#industrias" className="hover:text-orange-500 transition-colors">Industrias Atendidas</a></li>
                <li><a href="#seguridad" className="hover:text-orange-500 transition-colors">Certificaciones y Seguridad</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-white mb-8">Servicios Top</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#servicios" className="hover:text-orange-500 transition-colors">Rope Access Técnico</a></li>
                <li><a href="#servicios" className="hover:text-orange-500 transition-colors">Lavado de Vidrios</a></li>
                <li><a href="#servicios" className="hover:text-orange-500 transition-colors">Sellados Hidrófugos</a></li>
                <li><a href="#servicios" className="hover:text-orange-500 transition-colors">Pintura de Galpones</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold uppercase tracking-widest text-xs text-white mb-8">Legal & RRHH</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li>Términos del Servicio</li>
                <li>Política de Prevención</li>
                <li>Gestión de Residuos</li>
                <li>Trabaje con Nosotros</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              © {new Date().getFullYear()} Vertical Soluciones SpA. Todos los derechos reservados.
            </p>
            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              Viña del Mar / Chile
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
