import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Message {
  role: "user" | "bot";
  text: string;
}

export default function ChatBot({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "¡Hola! Soy el asistente virtual de Vertical Soluciones. ¿En qué puedo ayudarte hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTIONS = [
    "¿Qué servicios ofrecen?",
    "¿Cómo pido una cotización?",
    "¿Trabajan fuera de Viña del Mar?",
    "¿Cuál es su horario de atención?"
  ];

  useEffect(() => {
    async function fetchAiPrompt() {
      try {
        const docRef = doc(db, "settings", "contact");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAiPrompt(docSnap.data().aiPrompt || "");
        }
      } catch (error) {
        console.error("Error fetching AI prompt:", error);
      }
    }
    fetchAiPrompt();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (customMessage?: string) => {
    const userMessage = (customMessage || input).trim();
    if (!userMessage || isLoading) return;

    if (!customMessage) setInput("");
    
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });
      
      const systemInstruction = `
        Eres un asistente servicial y profesional de "Vertical Soluciones SpA", una empresa líder en trabajos de altura, rope access e ingeniería de acceso.
        Tu objetivo es responder preguntas de clientes potenciales de manera amable, técnica pero accesible, e informativa.
        
        Información clave de la empresa:
        ${aiPrompt}
        
        Sigue estas reglas:
        1. Responde siempre en español.
        2. Si no sabes algo, sugiere contactar directamente a la empresa.
        3. Sé conciso pero completo.
        4. No inventes precios si no están en la información proporcionada.
        5. Mantén un tono corporativo y seguro.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: "user", parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: systemInstruction
        }
      });

      const botResponse = response.text || "Lo siento, no pude procesar tu solicitud en este momento.";
      setMessages(prev => [...prev, { role: "bot", text: botResponse }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: "bot", text: "Lo siento, tuve un problema técnico. ¿Podrías intentar de nuevo o contactarnos por teléfono?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[600px] bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-red-600 p-6 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-black uppercase italic tracking-tighter text-sm">Asistente Vertical</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-white/60 text-[10px] uppercase font-bold tracking-widest">En línea</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
            {messages.map((m, i) => (
              <motion.div 
                initial={{ opacity: 0, x: m.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                key={i} 
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  m.role === "user" 
                    ? "bg-red-600 text-white rounded-tr-none" 
                    : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
                }`}>
                  {m.text}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 border border-slate-700 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Vertical AI está pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-6 pb-2">
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  disabled={isLoading}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-6">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Escribe tu pregunta aquí..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-6 pr-12 py-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              />
              <button 
                onClick={() => handleSend()}
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <Sparkles className="w-3 h-3 text-red-500" />
              <span className="text-[8px] text-slate-600 uppercase font-black tracking-[0.2em]">Potenciado por Gemini AI</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
