import React, { useState, useEffect } from "react";
import { Mountain, Zap, Building, TowerControl, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { db } from "../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function Footer() {
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

  return (
    <footer className="py-20 bg-slate-950 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
              <div className="w-8 h-8 bg-red-600 flex items-center justify-center rounded-lg">
                <Mountain className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold tracking-tighter uppercase italic">
                Vertical <span className="text-red-500">Soluciones</span>
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Especialistas en trabajos de alto riesgo y mantenimiento en altura con base en Viña del Mar y operaciones en todo Chile.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <div className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer bg-slate-900/50">
                <Zap className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer bg-slate-900/50">
                <Building className="w-4 h-4" />
              </div>
              <div className="w-10 h-10 border border-slate-800 rounded-xl flex items-center justify-center text-slate-500 hover:border-red-500 hover:text-red-500 transition-all cursor-pointer bg-slate-900/50">
                <TowerControl className="w-4 h-4" />
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-white mb-8">Navegación</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li><Link to="/portafolio" className="hover:text-red-500 transition-colors">Portafolio de Proyectos</Link></li>
              <li><a href="/#sobre-nosotros" className="hover:text-red-500 transition-colors">Nuestra Trayectoria</a></li>
              <li><Link to="/portafolio" className="hover:text-red-500 transition-colors">Casos de Éxito</Link></li>
              <li><a href="/#seguridad" className="hover:text-red-500 transition-colors">Certificaciones y Seguridad</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-white mb-8">Contacto</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-red-500 mt-1" />
                <span>{settings.phone}</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-red-500 mt-1" />
                <span className="break-all">{settings.email}</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-red-500 mt-1" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs text-white mb-8">Sistema</h4>
            <ul className="space-y-4 text-sm text-slate-500 font-medium">
              <li>Términos del Servicio</li>
              <li>Política de Prevención</li>
              <li>Gestión de Residuos</li>
              <li>Trabaje con Nosotros</li>
              <li><Link to="/admin" className="hover:text-red-500 transition-colors">Acceso Admin</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-10 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            © {new Date().getFullYear()} Vertical Soluciones SpA. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">
            Ingeniería de Acceso & Mantenimiento Técnico
          </p>
        </div>
      </div>
    </footer>
  );
}
