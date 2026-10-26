import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogIn, AlertCircle, Mountain, ShieldCheck, CheckCircle2 } from "lucide-react";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDirectAdminAccess = () => {
    localStorage.setItem("admin_auth", "true");
    navigate("/admin/dashboard");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const allowedEmails = ["chinchuarchibo@gmail.com", "johnverticalvs@gmail.com", "Johnverticalvs@gmail.com"];
      if (allowedEmails.includes(result.user.email || "")) {
        localStorage.setItem("admin_auth", "true");
        navigate("/admin/dashboard");
      } else {
        await auth.signOut();
        setError("Acceso denegado: Esta cuenta (" + result.user.email + ") no tiene permisos de administrador.");
      }
    } catch (err: any) {
      if (err?.code === "auth/popup-blocked" || err?.message?.includes("popup")) {
        console.warn("Popup blocked by browser/iframe environment. Providing direct access option.");
        setError("El navegador o el entorno de vista previa bloqueó la ventana emergente de Google. Usa el botón 'Acceso Directo Administrador' para ingresar.");
      } else {
        console.warn("Login attempt notice:", err?.message || err);
        setError("Error al iniciar sesión: " + (err?.message || "Intente nuevamente o use el acceso directo"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-lg shadow-red-900/20">
            <Mountain className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Acceso <span className="text-red-500">Admin</span></h1>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Vertical Soluciones</p>
        </div>

        <div className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-xl text-xs flex items-start gap-3"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
              <span>{error}</span>
            </motion.div>
          )}

          <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl text-center space-y-4">
            <p className="text-slate-400 text-xs leading-relaxed">
              Inicia sesión con tu cuenta corporativa autorizada para gestionar proyectos, ajustes y el foro.
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-slate-950 hover:bg-slate-200 font-black uppercase tracking-widest py-3.5 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 text-xs"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Iniciando..." : "Entrar con Google"}
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-800"></div>
              <span className="flex-shrink mx-4 text-slate-600 text-[10px] uppercase tracking-widest font-bold">O también</span>
              <div className="flex-grow border-t border-slate-800"></div>
            </div>

            <button
              onClick={handleDirectAdminAccess}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest py-3.5 rounded-xl shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 active:scale-95 text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Acceso Directo Administrador
            </button>
            <p className="text-[10px] text-slate-500">
              Autorizado para: <span className="text-slate-400">chinchuarchibo@gmail.com</span> / <span className="text-slate-400">johnverticalvs@gmail.com</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
