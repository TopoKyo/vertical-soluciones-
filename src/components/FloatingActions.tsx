import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { fetchSettings } from "../lib/dataService";

export default function FloatingActions() {
  const [phone, setPhone] = useState("+56953988893");

  useEffect(() => {
    fetchSettings().then(sett => {
      if (sett.phone) {
        setPhone(sett.phone.replace(/\D/g, ""));
      }
    }).catch(() => {});
  }, []);

  const cleanPhone = phone.startsWith("+") ? phone.substring(1) : phone;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      <motion.a
        href={`https://wa.me/${cleanPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg shadow-green-900/40 flex items-center justify-center transition-transform hover:scale-110 active:scale-95 group"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110" />
      </motion.a>
    </div>
  );
}
