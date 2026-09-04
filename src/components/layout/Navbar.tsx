import { motion, AnimatePresence } from "motion/react";
import { 
  Mountain,
  Menu,
  X
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Inicio", path: "/" },
    { name: "Servicios", path: "/#servicios" },
    { name: "Sobre Nosotros", path: "/#sobre-nosotros" },
    { name: "Portafolio", path: "/portafolio" },
    { name: "Seguridad", path: "/#seguridad" },
  ];

  return (
    <>
      <nav id="navbar" className={`fixed w-full z-50 transition-all duration-300 ${scrolled || location.pathname !== "/" ? "bg-slate-50/90 backdrop-blur-md py-4 shadow-lg" : "bg-transparent py-6"}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3">
            <img 
              src="/VS_blanco.png" 
              alt="Vertical Soluciones Logo" 
              className="h-16 w-auto object-contain invert"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
            {navItems.map((item) => (
              item.path.startsWith("/#") ? (
                <a key={item.name} href={item.path} className="hover:text-red-500 transition-colors uppercase">
                  {item.name}
                </a>
              ) : (
                <Link key={item.name} to={item.path} className={`hover:text-red-500 transition-colors uppercase ${location.pathname === item.path ? "text-red-500" : ""}`}>
                  {item.name}
                </Link>
              )
            ))}
            <a href="/#contacto" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-all shadow-lg shadow-red-900/20 active:scale-95">
              CONTACTO
            </a>
          </div>

          {/* Mobile Toggle */}
          <button id="menu-toggle" className="md:hidden text-slate-900" onClick={() => setIsMenuOpen(!isMenuOpen)}>
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
            className="fixed inset-0 z-40 bg-white pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-2xl font-bold uppercase italic">
              {navItems.map((item) => (
                item.path.startsWith("/#") ? (
                  <a 
                    key={item.name} 
                    href={item.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className="hover:text-red-500 transition-colors"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link 
                    key={item.name} 
                    to={item.path} 
                    onClick={() => setIsMenuOpen(false)}
                    className={`hover:text-red-500 transition-colors ${location.pathname === item.path ? "text-red-500" : ""}`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <a href="/#contacto" onClick={() => setIsMenuOpen(false)} className="hover:text-red-500 transition-colors">
                CONTACTO
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
