import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { LogIn, AlertCircle, Mountain } from "lucide-react";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Check if it's the allowed admin email
      if (result.user.email === "chinchuarchibo@gmail.com") {
        localStorage.setItem("admin_auth", "true");
        navigate("/admin/dashboard");
      } else {
        await auth.signOut();
        setError("Acceso denegado: Esta cuenta no tiene permisos de administrador.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError("Error al iniciar sesión: " + (err.message || "Intente nuevamente"));
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
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-2xl mb-4 shadow-lg shadow-orange-900/20">
            <Mountain className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black uppercase italic tracking-tighter">Acceso <span className="text-orange-500">Admin</span></h1>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Vertical Soluciones</p>
        </div>

        <div className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs flex items-center gap-3"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div className="p-6 bg-slate-950/50 border border-slate-800 rounded-2xl text-center">
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
              Para gestionar el portafolio, accede con tu cuenta autorizada: <br/>
              <span className="text-white font-bold">chinchuarchibo@gmail.com</span>
            </p>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full bg-white text-slate-950 hover:bg-slate-200 font-black uppercase tracking-widest py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Iniciando..." : "Entrar con Google"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
