import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function JobApplication() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    certifications: "",
    experience: "",
    portfolioUrl: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "job_applications"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        certifications: "",
        experience: "",
        portfolioUrl: ""
      });
    } catch (error) {
      console.error("Error al enviar postulación:", error);
      alert("Hubo un error al enviar tu postulación. Por favor intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-24 pb-20">
      <div className="container mx-auto px-6">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-red-500 font-bold uppercase tracking-widest text-xs hover:text-red-400 transition-colors mb-12"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-slate-900">
              Trabaja con <span className="text-red-500">nosotros</span>
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              Únete a nuestro equipo de técnicos verticales especialistas. Buscamos profesionales comprometidos con la seguridad, la excelencia y el trabajo en altura.
            </p>
          </div>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 md:p-12 text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
              <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4 text-slate-900">¡Postulación Enviada!</h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Hemos recibido tus antecedentes correctamente. Nuestro equipo revisará tu perfil y nos pondremos en contacto contigo a la brevedad.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-8 px-6 py-3 bg-white border border-slate-200 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors"
              >
                Enviar otra postulación
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-slate-900"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-slate-900"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-slate-900"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">
                    Enlace a CV o Portafolio (Opcional)
                  </label>
                  <input
                    type="url"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData({...formData, portfolioUrl: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-slate-900"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">
                  Certificaciones y Cursos (IRATA, SPRAT, etc.)
                </label>
                <textarea
                  rows={3}
                  value={formData.certifications}
                  onChange={(e) => setFormData({...formData, certifications: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-slate-900 resize-none"
                  placeholder="IRATA Nivel 1, Prevención de Riesgos..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500 ml-2">
                  Experiencia Laboral *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.experience}
                  onChange={(e) => setFormData({...formData, experience: e.target.value})}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-red-500 transition-colors text-slate-900 resize-none"
                  placeholder="Describe tu experiencia como técnico vertical..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white px-8 py-5 rounded-2xl text-sm font-bold tracking-widest uppercase transition-all shadow-xl shadow-red-900/30 flex items-center justify-center gap-2 group"
              >
                {isSubmitting ? "Enviando..." : "Enviar Postulación"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
