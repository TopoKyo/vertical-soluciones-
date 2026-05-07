import React, { useState, useEffect } from "react";
import { MessageCircle, Phone, Bot } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ChatBot from "./ChatBot";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function FloatingActions() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [phone, setPhone] = useState("+56953988893");

  useEffect(() => {
    async function fetchPhone() {
      try {
        const docRef = doc(db, "settings", "contact");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.phone) {
            // Remove non-numeric characters for WhatsApp link
            setPhone(data.phone.replace(/\D/g, ""));
          }
        }
      } catch (error) {
        console.error("Error fetching phone for WhatsApp:", error);
      }
    }
    fetchPhone();
  }, []);

  const handleWhatsApp = () => {
    const cleanPhone = phone.startsWith("+") ? phone.substring(1) : phone;
    window.open(`https://wa.me/${cleanPhone}`, "_blank");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
        <AnimatePresence>
          {!isChatOpen && (
            <motion.button
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 45 }}
              onClick={() => setIsChatOpen(true)}
              className="w-14 h-14 bg-orange-600 hover:bg-orange-700 text-white rounded-full shadow-lg shadow-orange-900/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
            >
              <Bot className="w-6 h-6 group-hover:animate-bounce" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={handleWhatsApp}
          className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-900/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110" />
        </motion.button>
      </div>

      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
