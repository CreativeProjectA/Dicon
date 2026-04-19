/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook,
  MessageCircle, 
  Menu, 
  X, 
  ChevronRight, 
  Truck, 
  ShieldCheck, 
  ArrowRight,
  Construction,
  Drill,
  Wrench,
  Zap,
  Box,
  Cylinder,
  Minus,
  Plus,
  Droplets,
  Palette,
  Layers
} from "lucide-react";
import { useState, useEffect, useMemo, useRef } from "react";

const BRANDS = [
  "CEMENTO CHIHUAHUA",
  "TOTAL",
  "IUSA",
  "ZAAK",
  "PANEL REY",
  "MAXIMO",
  "TRUPER",
  "AXEL",
  "3B"
];

const CATEGORIES = [
  { 
    id: "materiales", 
    name: "Nuestros Materiales", 
    icon: <Construction className="w-8 h-8" />, 
    desc: "Suministro estratégico para ferreterías y constructoras. Los pilares de Juárez en un solo lugar.",
    products: [
      { 
        id: 11, 
        name: "Varilla", 
        img: "/varilla.png?v=2.5",
        description: "Acero de refuerzo de alta resistencia. Para conocer existencias y formatos, cotiza ahora con nosotros."
      },
      { 
        id: 12, 
        name: "Cemento Chihuahua", 
        img: "/cemento.png?v=2.5",
        description: "Calidad garantizada del Cemento de Chihuahua para cada etapa de tu obra."
      },
      { 
        id: 13, 
        name: "Castillo de Construcción", 
        img: "/castillo.png?v=2.5",
        description: "Armados precisos que agilizan tu construcción."
      },
      { 
        id: 14, 
        name: "Block de Cemento", 
        img: "/block.png?v=2.5",
        description: "Resistencia estructural superior para muros duraderos."
      },
      { 
        id: 15, 
        name: "Yeso Máximo", 
        img: "/yeso.png?v=2.5",
        description: "Recubrimiento de alta calidad para interiores. Acabado profesional."
      },
      { 
        id: 16, 
        name: "Mortero Chuviscar", 
        img: "/mortero.png?v=2.5",
        description: "Ideal para aplanados y pegado de block. Máxima trabajabilidad."
      },
      {
        id: 17,
        name: "Canal de Amarre",
        img: "canal.png?v=2.4",
        sizes: ["5/8", "1/2", "3 5/8"],
        description: "Estructura metálica para soporte de muros de panel de yeso."
      },
      {
        id: 18,
        name: "Poste Metálico",
        img: "canal.png?v=2.4",
        sizes: ["5/8", "1/2"],
        description: "Perfiles de acero galvanizado para bastidores de muros."
      },
      {
        id: 19,
        name: "Ángulo de Amarre 250 x 305",
        img: "/angulo.png?v=2.5",
        description: "Accesorio para fijación perimetral en plafones y muros."
      }
    ]
  },
  {
    id: "plomeria",
    name: "Plomería",
    icon: <Droplets className="w-8 h-8" />,
    desc: "Conexiones, válvulas y tubería industrial. Calidad que resiste la presión de tu obra.",
    products: [
      {
        id: 21,
        name: "Tubo Negro Roscada de 3/4",
        img: "/tubo_negro_roscada.png?v=2.5",
        description: "Tubería de alta calidad para instalaciones de gas y fluidos industriales."
      },
      {
        id: 22,
        name: "Codo Negro 90",
        img: "/codo_negro_1.png?v=2.5",
        sizes: ["1/2", "3/4"],
        description: "Conexión robusta de 90 grados para tubería negra."
      },
      {
        id: 23,
        name: "Tee Negra",
        img: "/tee_negra.png?v=2.5",
        sizes: ["1/2", "3/4"],
        description: "Conexión en T para derivaciones en sistemas de tubería negra."
      },
      {
        id: 24,
        name: "Válvula Bola Roscable",
        img: "/valbula.png?v=2.5",
        sizes: ["1/2", "3/4"],
        description: "Control de paso de alta durabilidad con cierre tipo bola."
      },
      {
        id: 25,
        name: "Tubo PVC",
        img: "/pvc.png?v=2.5",
        description: "Tubería para drenaje y ventilación, resistente y durable."
      }
    ]
  },
  {
    id: "acabados",
    name: "Pintura y Adhesivos",
    icon: <Palette className="w-8 h-8" />,
    desc: "Recubrimientos especiales, adhesivos de alto desempeño y pinturas premium.",
    products: [
      {
        id: 31,
        name: "Pintura Axel",
        img: "/axel.png?v=2.5",
        sizes: ["Bronze", "Silver", "Golden"],
        selectionLabel: "Seleccionar Tipo",
        description: "Línea premium de acabados metálicos y decorativos. Selecciona tu color."
      },
      {
        id: 32,
        name: "Pintura de Señalamiento Alto Rendimiento",
        img: "/trafico.png?v=2.5",
        description: "Especial para tráfico y vialidades. Máxima visibilidad y durabilidad."
      },
      {
        id: 41,
        name: "Adhesivo 3B Real",
        img: "/pega.png?v=2.5",
        sizes: ["Pega Piso Real", "Pega Azulejo Real"],
        selectionLabel: "Seleccionar Tipo",
        description: "Adhesivo especializado de gran fuerza para recubrimientos cerámicos."
      }
    ]
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [productSizes, setProductSizes] = useState<Record<number, string>>({});
  const [imageErrors, setImageErrors] = useState<string[]>([]);

  // Forced build sync timestamp: 1713541849
  // Performance check for mobile
  const [isLowPowerMode, setIsLowPowerMode] = useState(false);
  useEffect(() => {
    console.log("DICON App v2.5 - REVOLUCION FINAL ACTIVE");
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768; // Only trigger for phones
      if (isSmallScreen || isMobile) {
        setIsLowPowerMode(true);
      } else {
        setIsLowPowerMode(false);
      }
    };
    checkPerformance();
    window.addEventListener('resize', checkPerformance);
    return () => window.removeEventListener('resize', checkPerformance);
  }, []);

  // Cart logic
  const addToCart = (product: any) => {
    const size = productSizes[product.id];
    
    // If it has sizes and none is selected, don't add yet (or we could show an alert, but the UI will handle showing the selection)
    if (product.sizes && !size) {
      // In a real app we might show a nudge, but here the button will be disabled or we'll pick first by default
      return;
    }

    setCart(prev => {
      const cartItemId = size ? `${product.id}-${size}` : `${product.id}`;
      const exists = prev.find(item => item.cartItemId === cartItemId);
      if (exists) {
        return prev.map(item => 
          item.cartItemId === cartItemId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, cartItemId, selectedSize: size, quantity: 1 }];
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const generateWhatsAppMessage = () => {
    if (cart.length === 0) return "";
    const itemsList = cart.map(item => {
      const sizeText = item.selectedSize ? ` [Medida: ${item.selectedSize}]` : "";
      return `• ${item.quantity}x ${item.name}${sizeText}`;
    }).join("\n");
    return `Hola DICON, me gustaría cotizar mi lista de materiales y plomería:\n\n${itemsList}\n\nQuedo a la espera de su respuesta.`;
  };

  const whatsappUrl = `https://wa.me/5216568079485?text=${encodeURIComponent(generateWhatsAppMessage())}`;

  // Advanced Scroll Parallax Hook
  const { scrollYProgress } = useScroll();
  const springConfig = isLowPowerMode 
    ? { stiffness: 1000, damping: 100 } // Near instant on mobile
    : { stiffness: 100, damping: 30, restDelta: 0.001 };
    
  const smoothY = useSpring(scrollYProgress, springConfig);

  const y1 = useTransform(smoothY, [0, 1], isLowPowerMode ? [0, 0] : [0, -600]);
  const y2 = useTransform(smoothY, [0, 1], isLowPowerMode ? [0, 0] : [0, 400]);
  const rotate1 = useTransform(smoothY, [0, 1], isLowPowerMode ? [0, 0] : [0, 45]);
  const rotate2 = useTransform(smoothY, [0, 1], isLowPowerMode ? [0, 0] : [0, -30]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", href: "#" },
    { name: "Materiales", href: "#materiales" },
    { name: "Marcas", href: "#marcas" },
    { name: "Historia", href: "#historia" },
    { name: "Ubicación", href: "#contacto" },
  ];

  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Glow Sphere Background Effect - ALWAYS VISIBLE */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="main-glow" />
        <div className="secondary-glow" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-bg/80 backdrop-blur-md border-b border-border py-4" : "bg-transparent py-8"}`}>
        <div className="section-container flex items-center justify-between">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <img 
                src="/logo.png?v=2.5" 
                alt="DICON" 
                className="h-12 w-auto transition-transform group-hover:scale-110"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }} 
              />
              <div className="absolute -inset-1 bg-accent/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-full"></div>
            </div>
            <div className="text-2xl font-black tracking-tighter text-text-primary">
              DI<span className="text-accent drop-shadow-[0_0_15px_var(--color-accent-glow)]">CON</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-accent ${scrolled || scrolled === false ? "text-text-secondary" : "text-white"}`}
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://wa.me/5216568079485" 
              target="_blank" 
              className="bg-accent text-white px-7 py-3 rounded-lg text-sm font-bold shadow-[0_10px_20px_var(--color-accent-glow)] hover:scale-105 transition-transform"
            >
              Solicitar Cotización
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 w-full bg-card-bg border-b border-border py-8 md:hidden shadow-2xl"
          >
            <div className="flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href}
                  className="text-lg font-bold text-text-primary hover:text-accent"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="https://wa.me/5216568079485" 
                className="bg-accent text-white px-10 py-4 rounded-lg font-bold mt-4 shadow-lg shadow-accent/20"
              >
                Contacto Directo
              </a>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-20 overflow-hidden">
        {/* Animated Background Blobs - Disabled on low power/mobile for performance */}
        {!isLowPowerMode && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ 
                x: [0, 50, 0],
                y: [0, 30, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute top-[10%] left-[5%] w-96 h-96 bg-accent/5 blur-[120px] rounded-full will-change-transform"
            />
            <motion.div 
              animate={{ 
                x: [0, -40, 0],
                y: [0, 60, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
              className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full will-change-transform"
            />
          </div>
        )}

        <div className="section-container relative z-10 w-full">
          <div className="flex flex-col items-center text-center mb-24">
            {/* Floating Particles (Cement Dust) - High performance mode only */}
            {!isLowPowerMode && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      x: Math.random() * 100 + "%", 
                      y: Math.random() * 100 + "%",
                      opacity: Math.random() * 0.5 + 0.1 
                    }}
                    animate={{ 
                      y: [null, (Math.random() - 0.5) * 100 + "%"],
                      x: [null, (Math.random() - 0.5) * 50 + "%"],
                    }}
                    transition={{ 
                      duration: Math.random() * 10 + 10, 
                      repeat: Infinity, 
                      ease: "linear" 
                    }}
                    className="absolute w-1 h-1 bg-white/10 rounded-full blur-[1px]"
                  />
                ))}
              </div>
            )}

            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-5xl"
            >
              <motion.span 
                variants={itemVariants} 
                className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-[2px] mb-8 border border-accent/20 italic"
              >
                Líderes en Ciudad Juárez
              </motion.span>
              
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="will-change-transform"
              >
                <motion.h1 
                  variants={itemVariants}
                  className="text-6xl sm:text-7xl md:text-[10rem] font-black leading-[0.85] tracking-[-0.05em] mb-12 text-gradient uppercase px-4 sm:px-0"
                >
                  Calidad para <br />
                  <span className="text-white">Ferreterías</span> <br />
                  & Obras.
                </motion.h1>
              </motion.div>

              <motion.p 
                variants={itemVariants}
                className="text-lg sm:text-xl md:text-2xl text-text-secondary leading-relaxed mb-16 max-w-2xl mx-auto font-medium px-4"
              >
                Suministramos los materiales esenciales que sostienen a Juárez. Logística especializada para ferreterías locales y grandes proyectos de construcción.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-4 sm:gap-6 px-4"
              >
                <a href="#materiales" className="w-full sm:w-auto bg-accent text-white px-10 py-5 rounded-2xl font-black text-lg sm:text-xl shadow-[0_20px_40px_var(--color-accent-glow)] hover:bg-orange-600 transition-all flex items-center justify-center gap-3 group">
                  Ver Catálogo <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </a>
                <button 
                  onClick={() => setIsCartOpen(true)}
                  className="w-full sm:w-auto bg-white/5 backdrop-blur-xl text-white border border-white/10 px-10 py-5 rounded-2xl font-black text-lg sm:text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
                >
                  <div className="relative">
                    <Box className="w-6 h-6 text-accent" />
                    {cart.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                        {cart.length}
                      </span>
                    )}
                  </div>
                  Mi Lista
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Grid - Moved below and performance optimized */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative max-w-7xl mx-auto px-6"
          >
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-accent/5 blur-xl -z-10"></div>
            
            <motion.div 
              variants={itemVariants}
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ y: -20, scale: 1.02 }}
              className="glass-card p-8 border border-white/5 shadow-2xl relative overflow-hidden group will-change-transform"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <div className="text-4xl font-black text-accent mb-2 drop-shadow-[0_0_15px_var(--color-accent-glow)]">10+</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-[2px] font-black">Años de Confianza</div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              whileHover={{ y: -20, scale: 1.02 }}
              className="glass-card p-8 border border-white/5 shadow-2xl relative overflow-hidden group lg:mt-4 will-change-transform"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Truck className="w-10 h-10" />
              </div>
              <div className="text-4xl font-black text-accent mb-2 drop-shadow-[0_0_15px_var(--color-accent-glow)]">1k+</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-[2px] font-black">Clientes en Juárez</div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              whileHover={{ y: -20, scale: 1.02 }}
              className="glass-card p-8 border border-white/5 shadow-2xl relative overflow-hidden group will-change-transform"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Zap className="w-10 h-10" />
              </div>
              <div className="text-4xl font-black text-accent mb-2 drop-shadow-[0_0_15px_var(--color-accent-glow)]">24/7</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-[2px] font-black">Soporte Logístico</div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              whileHover={{ y: -20, scale: 1.02 }}
              className="glass-card p-8 border border-white/5 shadow-2xl relative overflow-hidden group lg:mt-4 will-change-transform"
            >
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Box className="w-10 h-10" />
              </div>
              <div className="text-4xl font-black text-accent mb-2 drop-shadow-[0_0_15px_var(--color-accent-glow)]">100%</div>
              <div className="text-[10px] text-text-secondary uppercase tracking-[2px] font-black">Garantía de Entrega</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brands Marquee */}
      <section id="marcas" className="py-24 border-y border-border overflow-hidden bg-bg relative">
        <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex animate-marquee-fast md:animate-marquee-slow whitespace-nowrap gap-20 items-center will-change-transform translate-z-0">
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
              <span 
                key={i} 
                className="text-2xl md:text-4xl font-black text-white/20 hover:text-accent transition-colors cursor-default select-none tracking-tighter filter grayscale brightness-50 contrast-125"
              >
                {brand}
              </span>
            ))}
          </div>
          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-bg to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-bg to-transparent z-10" />
        </div>
      </section>

      {/* Quotation Cart Slide-over */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-bg/80 backdrop-blur-sm" 
              onClick={() => setIsCartOpen(false)} 
            />
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }} 
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-card-bg w-full max-w-md h-full shadow-[-20px_0_50px_rgba(0,0,0,0.5)] border-l border-border flex flex-col"
            >
              <div className="p-8 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase">Mi Lista</h3>
                  <p className="text-text-secondary text-sm font-medium">{cart.length} materiales seleccionados</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <Box className="w-20 h-20 mb-6" />
                    <p className="text-xl font-bold uppercase tracking-widest">Tu lista está vacía</p>
                    <p className="text-sm mt-2">Agrega materiales desde el catálogo para cotizar.</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center bg-bg/40 p-5 rounded-2xl border border-border/50 group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-lg uppercase tracking-tight leading-none mb-1 truncate">{item.name}</p>
                        {item.selectedSize ? (
                          <p className="text-accent text-[10px] font-black uppercase tracking-widest mb-2">
                            Medida: {item.selectedSize}
                          </p>
                        ) : (
                          <p className="text-[10px] text-text-secondary uppercase tracking-wider mb-2">Material Estándar</p>
                        )}
                        
                        <div className="flex items-center gap-3">
                          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, -1)}
                              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-accent transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-black">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.cartItemId, 1)}
                              className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-accent transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.cartItemId)}
                        className="p-2 text-text-secondary/50 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 border-t border-border bg-bg/50">
                {cart.length > 0 && (
                  <div className="space-y-4">
                    <p className="text-[10px] text-text-secondary leading-relaxed mb-4 text-center">
                      Al hacer clic en cotizar, se abrirá WhatsApp con tu lista detallada para que un asesor te atienda personalmente.
                    </p>
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      className="bg-accent text-white w-full py-6 rounded-2xl font-black text-lg shadow-[0_20px_40px_var(--color-accent-glow)] hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
                    >
                      COTIZAR LISTA EN WHATSAPP <ArrowRight className="w-6 h-6" />
                    </a>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="w-full py-4 text-text-secondary text-sm font-bold hover:text-white transition-colors"
                    >
                      Seguir explorando
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Cart Button (Mobile Shortcut) */}
      <AnimatePresence>
        {cart.length > 0 && !isCartOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-10 right-10 z-[80] bg-accent text-white w-20 h-20 rounded-full flex items-center justify-center shadow-2xl shadow-accent/40 border-4 border-bg lg:hidden"
          >
            <Box className="w-8 h-8" />
            <span className="absolute -top-1 -right-1 bg-white text-accent font-black text-xs w-6 h-6 rounded-full flex items-center justify-center border-2 border-accent">
              {cart.length}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Story / History Section */}
      <section id="historia" className="py-40 relative overflow-hidden bg-bg">
        {/* Glow behind centerpiece */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="section-container relative z-10 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            <motion.span variants={itemVariants} className="text-accent font-bold text-xs tracking-[6px] uppercase mb-6 block italic">NUESTRO ORIGEN</motion.span>
            <motion.h2 variants={itemVariants} className="text-6xl md:text-8xl font-black mb-16 tracking-tight text-gradient uppercase">Nuestra Historia</motion.h2>

            {/* High-End Centerpiece Animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-24 flex justify-center"
            >
              <motion.div
                animate={isLowPowerMode ? {} : { 
                  y: [0, -20, 0],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                style={isLowPowerMode ? {} : { y: y1 }}
                className="will-change-transform"
              >
                <img 
                  src="/casco2.png?v=2.5" 
                  alt="Casco Pro DICON" 
                  className="w-[300px] md:w-[500px] grayscale brightness-90 drop-shadow-[0_20px_60px_rgba(255,87,34,0.2)]"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              </motion.div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <motion.div variants={itemVariants} className="glass-card p-10 border border-white/5 relative group hover:border-accent/30 transition-colors">
                <div className="text-accent font-black text-3xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity italic">01</div>
                <h4 className="text-xl font-black mb-4 text-white uppercase tracking-tight">El Inicio</h4>
                <p className="text-text-secondary leading-relaxed font-medium text-sm">
                  DICON nació con una visión clara: ser el pilar logístico de Ciudad Juárez. Comenzamos entendiendo que cada bulto de cemento es el inicio de un hogar o un negocio.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card p-10 border border-white/5 relative group hover:border-accent/30 transition-colors">
                <div className="text-accent font-black text-3xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity italic">02</div>
                <h4 className="text-xl font-black mb-4 text-white uppercase tracking-tight">Confianza</h4>
                <p className="text-text-secondary leading-relaxed font-medium text-sm">
                  Nos especializamos en el suministro estratégico para ferreterías y grandes constructoras. Nuestra reputación se forjó en la puntualidad y la calidad innegociable.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card p-10 border border-white/5 relative group hover:border-accent/30 transition-colors">
                <div className="text-accent font-black text-3xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity italic">03</div>
                <h4 className="text-xl font-black mb-4 text-white uppercase tracking-tight">El Futuro</h4>
                <p className="text-text-secondary leading-relaxed font-medium text-sm">
                  No somos solo una comercializadora; somos un aliado estratégico. Seguimos innovando en logística para que Juárez nunca deje de crecer.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories / Catalog */}
      <section id="materiales" className="py-32 relative overflow-hidden">
        {/* Advanced Decorative Parallax Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <motion.div 
            style={{ 
              y: y1,
              rotate: rotate1
            }}
            className="absolute right-[-10%] top-[5%] hidden lg:block opacity-20 pointer-events-none will-change-transform"
          >
            <img 
              src="/block2.png?v=2.5"
              className="w-[600px] grayscale brightness-75 drop-shadow-[0_0_30px_rgba(255,87,34,0.1)]" 
              alt="Deco Block"
            />
          </motion.div>

          {!isLowPowerMode && (
            <>
              <motion.div 
                style={{ y: y1 }}
                className="absolute left-[-8%] top-[75%] hidden lg:block opacity-30 pointer-events-none will-change-transform"
              >
                <img 
                  src="/pvc_2_final.png?v=2.5"
                  className="w-[450px] grayscale brightness-90 -rotate-12" 
                  alt="Deco PVC"
                />
              </motion.div>

              <motion.div 
                style={{ y: y2 }}
                className="absolute right-[-8%] top-[60%] hidden lg:block opacity-30 pointer-events-none will-change-transform"
              >
                <img 
                  src="/hola.png?v=2.5"
                  className="w-[400px] rotate-12" 
                  alt="Deco Rodillo"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600";
                  }}
                />
              </motion.div>
            </>
          )}
        </div>

        <div className="section-container relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px" }}
            variants={containerVariants}
            className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8"
          >
            <div className="max-w-2xl">
              <motion.span variants={itemVariants} className="text-accent font-bold text-xs tracking-[4px] uppercase mb-4 block italic">SUMINISTRO ESTRATÉGICO</motion.span>
              <motion.h2 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-8 tracking-tight text-gradient uppercase">Nuestros Materiales</motion.h2>
              <motion.p variants={itemVariants} className="text-text-secondary font-medium text-xl leading-relaxed">
                Logística de alto impacto para ferreterías y constructoras líderes en la región.
              </motion.p>
            </div>
          </motion.div>
          
          <div className="space-y-12">
            {/* LARGE CATEGORY: Materiales */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={itemVariants}
              className={`relative overflow-hidden group rounded-[40px] md:rounded-[60px] bg-card-bg/80 border border-white/10 p-8 md:p-16 lg:p-24 shadow-2xl ${isLowPowerMode ? "" : "backdrop-blur-md"}`}
            >
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-accent/20 via-transparent to-transparent pointer-events-none transition-transform duration-700 group-hover:scale-110"></div>
              <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                <div className="flex-1 w-full text-center lg:text-left">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-[32px] flex items-center justify-center text-accent mb-8 md:mb-12 bg-accent/10 shadow-[0_0_50px_rgba(255,87,34,0.15)] ring-1 ring-white/10 mx-auto lg:mx-0">
                    <Construction className="w-10 h-10 md:w-12 md:h-12" />
                  </div>
                  <h3 className="text-4xl md:text-5xl lg:text-8xl font-black mb-6 md:mb-10 leading-none tracking-tighter uppercase">Nuestros Materiales</h3>
                  <p className="text-text-secondary text-lg md:text-2xl font-medium leading-relaxed mb-10 md:mb-16 max-w-xl mx-auto lg:mx-0">
                    Suministro estratégico para ferreterías y constructoras. Los pilares de Juárez en un solo lugar.
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(CATEGORIES.find(c => c.id === 'materiales')!)}
                    className="bg-accent text-white px-8 md:px-16 py-5 md:py-8 rounded-[32px] font-black text-xl md:text-2xl shadow-[0_20px_40px_var(--color-accent-glow)] hover:bg-orange-600 transition-all flex items-center gap-4 md:gap-6 group/btn w-fit mx-auto lg:mx-0"
                  >
                    EXPLORAR MATERIALES <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover/btn:translate-x-3 transition-transform" />
                  </motion.button>
                </div>
                <div className="flex-1 relative hidden lg:block">
                  <div className="grid grid-cols-2 gap-6 scale-90">
                    {CATEGORIES[0].products.slice(0, 4).map((p, idx) => (
                      <motion.div 
                        key={p.id}
                        animate={isLowPowerMode ? {} : { y: idx % 2 === 0 ? [0, -20, 0] : [0, 20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
                        className="aspect-square bg-bg/40 rounded-[48px] border border-border/50 overflow-hidden shadow-2xl"
                      >
                        <img 
                          src={p.img} 
                          alt={p.name} 
                          className="w-full h-full object-cover grayscale brightness-110 contrast-125 opacity-80 group-hover:opacity-100 transition-opacity" 
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* MEDIUM CATEGORY: Plomeria */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                className={`relative overflow-hidden group rounded-[60px] bg-card-bg/60 border border-white/5 p-12 lg:p-16 shadow-xl ${isLowPowerMode ? "" : "backdrop-blur-sm"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-transparent to-transparent pointer-events-none transition-opacity group-hover:opacity-100 opacity-40"></div>
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-20 h-20 rounded-[28px] flex items-center justify-center text-blue-400 mb-8 bg-blue-500/10 ring-1 ring-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                      <Droplets className="w-10 h-10" />
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight uppercase">Plomería</h3>
                    <p className="text-text-secondary text-lg font-medium leading-relaxed mb-12">
                      Conexiones, válvulas y tubería industrial de alta calidad.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedCategory(CATEGORIES.find(c => c.id === 'plomeria')!)}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-[24px] font-bold text-lg transition-all flex items-center gap-4 group/btn w-fit"
                  >
                    VER PLOMERÍA <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>

              {/* MEDIUM CATEGORY: Acabados */}
              <motion.div 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                className={`relative overflow-hidden group rounded-[60px] bg-card-bg/60 border border-white/5 p-12 lg:p-16 shadow-xl ${isLowPowerMode ? "" : "backdrop-blur-sm"}`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/20 via-transparent to-transparent pointer-events-none transition-opacity group-hover:opacity-100 opacity-40"></div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-20 h-20 rounded-[28px] flex items-center justify-center text-purple-400 mb-8 bg-purple-500/10 ring-1 ring-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.1)]">
                      <Palette className="w-10 h-10" />
                    </div>
                    <h3 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight uppercase text-glow-purple">Pintura y Adhesivos</h3>
                    <p className="text-text-secondary text-lg font-medium leading-relaxed mb-12">
                      Recubrimientos especiales y adhesivos 3B de alto nivel.
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedCategory(CATEGORIES.find(c => c.id === 'acabados')!)}
                    className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-10 py-5 rounded-[24px] font-bold text-lg transition-all flex items-center gap-4 group/btn w-fit"
                  >
                    VER CATÁLOGO <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-bg/95" 
              onClick={() => setSelectedCategory(null)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.98 }} 
              className={`relative bg-card-bg border border-border w-full max-w-5xl max-h-[90vh] rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col will-change-transform ${isLowPowerMode ? "" : "backdrop-blur-xl"}`}
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-bg/50">
                <div>
                  <h3 className="text-3xl font-black tracking-tight uppercase">{selectedCategory.name}</h3>
                  <p className="text-text-secondary text-sm font-medium">Suministro oficial DICON para Juárez.</p>
                </div>
                <button className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors" onClick={() => setSelectedCategory(null)}><X className="w-6 h-6" /></button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar overscroll-contain pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCategory.products.map(product => {
                    const CardComponent = isLowPowerMode ? "div" : motion.div;
                    return (
                      <CardComponent 
                        key={product.id} 
                        {...(!isLowPowerMode && {
                          initial: { opacity: 0, y: 10 },
                          animate: { opacity: 1, y: 0 }
                        })}
                        className="bg-bg/60 border border-border/50 rounded-[32px] overflow-hidden flex flex-col sm:flex-row shadow-lg will-change-transform"
                      >
                        <div className="w-full sm:w-1/3 h-48 sm:h-auto relative bg-bg/80">
                          <img 
                            src={product.img} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                            onError={(e) => {
                              if (!imageErrors.includes(product.name)) {
                                setImageErrors(prev => [...prev, product.name]);
                              }
                              e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=600";
                            }}
                          />
                        </div>
                        <div className="p-6 w-full sm:w-2/3 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-xl">{product.name}</h4>
                            </div>
                            <p className="text-text-secondary text-[11px] leading-relaxed mb-4 font-medium italic">
                              {product.description}
                            </p>

                            {product.sizes && (
                              <div className="mb-6">
                                <p className="text-[10px] text-text-secondary uppercase tracking-widest mb-3 font-bold">
                                  {product.selectionLabel || "Seleccionar Medida"}:
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {product.sizes.map((size: string) => (
                                    <button
                                      key={size}
                                      onClick={() => setProductSizes(prev => ({ ...prev, [product.id]: size }))}
                                      className={`px-4 py-2 rounded-lg text-xs font-black transition-all border ${
                                        productSizes[product.id] === size 
                                        ? "bg-accent border-accent text-white shadow-lg shadow-accent/20" 
                                        : "bg-white/5 border-white/10 text-text-secondary hover:border-accent/40"
                                      }`}
                                    >
                                      {size}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-1 gap-3">
                            <button 
                              disabled={product.sizes && !productSizes[product.id]}
                              onClick={() => {
                                addToCart(product);
                                setSelectedCategory(null);
                                setIsCartOpen(true);
                              }}
                              className={`py-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                                product.sizes && !productSizes[product.id]
                                ? "bg-white/5 text-white/30 cursor-not-allowed"
                                : "bg-accent text-white shadow-lg shadow-accent/20 hover:bg-orange-600"
                              }`}
                            >
                              <Box className="w-4 h-4" /> 
                              {product.sizes && !productSizes[product.id] ? (product.selectionLabel ? `SELECCIONA ${product.selectionLabel.split(' ')[1].toUpperCase()}` : "SELECCIONA MEDIDA") : "AGREGAR A MI LISTA"}
                            </button>
                          </div>
                        </div>
                      </CardComponent>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Contact & Location */}
      <section id="contacto" className="py-32 bg-card-bg/50 border-y border-border">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="bg-bg h-[600px] rounded-[32px] overflow-hidden border border-border relative group">
              <img 
                src="/dicon_building.png" 
                className="w-full h-full object-cover opacity-100"
                alt="Fachada DICON Juárez"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  /* Si la imagen local no carga, intentamos con un placeholder de alta calidad */
                  e.currentTarget.src = "https://images.unsplash.com/photo-1541888946425-d81bb19480c5?q=80&w=1200";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="bg-bg/90 backdrop-blur-xl p-10 rounded-[32px] border border-border shadow-2xl max-w-sm text-center">
                    <div className="bg-accent w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-accent/40">
                      <MapPin className="text-white" />
                    </div>
                    <p className="font-bold text-xl mb-3">Centro Operativo Juárez</p>
                    <p className="text-sm text-text-secondary leading-relaxed font-medium">Calle Nahoas 3139, Aztecas, Ciudad Juárez, MX</p>
                    <button className="mt-8 text-accent font-bold text-sm hover:underline" onClick={() => window.open('https://www.google.com/maps/place/DICON/@31.6928315,-106.4823988,17z/data=!3m1!4b1!4m6!3m5!1s0x86e75f8fcecb5137:0xfa49371da445cda!8m2!3d31.692827!4d-106.4798239!16s%2Fg%2F11yqjk8gw7', '_blank')}>Obtener direcciones</button>
                 </div>
              </div>
            </div>

            <div>
              <span className="text-accent font-bold text-xs tracking-[4px] uppercase mb-6 block">CONECTA CON NOSOTROS</span>
              <h2 className="text-5xl md:text-6xl font-extrabold mb-10 tracking-tighter text-gradient leading-tight">Expertos en Suministro</h2>
              <p className="text-text-secondary mb-10 leading-relaxed font-medium">Contamos con almacén propio para responder a la velocidad de tu obra. En DICON, ser profesionales no es una opción, es nuestro estándar.</p>
              
              <div className="space-y-10">
                <div className="flex gap-6 items-start group">
                  <div className="bg-accent/5 p-4 rounded-2xl text-accent border border-accent/10 group-hover:bg-accent group-hover:text-white transition-colors">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Línea Directa</h4>
                    <p className="text-text-secondary font-medium">656 634 8189</p>
                  </div>
                </div>

                <div className="flex gap-6 items-start group">
                  <div className="bg-accent/5 p-4 rounded-2xl text-accent border border-accent/10 group-hover:bg-accent group-hover:text-white transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">WhatsApp Business</h4>
                    <p className="text-text-secondary font-medium">+52 1 656 807 9485</p>
                  </div>
                </div>

                <a href="https://www.facebook.com/diconjrz?locale=es_LA" target="_blank" rel="noopener noreferrer" className="flex gap-6 items-start group">
                  <div className="bg-accent/5 p-4 rounded-2xl text-accent border border-accent/10 group-hover:bg-accent group-hover:text-white transition-colors">
                    <Facebook className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Facebook Dicon</h4>
                    <p className="text-text-secondary font-medium text-xs">Visita nuestra página</p>
                  </div>
                </a>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Recommendation for further engagement */}
      <section className="py-24 bg-bg">
        <div className="section-container">
          <div className="text-center mb-20">
            <span className="text-accent font-bold text-xs tracking-[4px] uppercase mb-4 block">CENTRO DE AYUDA</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic">Dudas Frecuentes</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="p-8 rounded-[32px] bg-card-bg/30 border border-white/5">
              <h4 className="font-bold text-lg mb-3 text-accent uppercase">¿Puedo ir a recoger la mercancía?</h4>
              <p className="text-text-secondary text-sm leading-relaxed">¡Claro que sí! Puedes visitarnos directamente en nuestro centro operativo para recoger tus materiales de forma inmediata y segura.</p>
            </div>
            <div className="p-8 rounded-[32px] bg-card-bg/30 border border-white/5">
              <h4 className="font-bold text-lg mb-3 text-accent uppercase">¿Tienen precio de mayoreo?</h4>
              <p className="text-text-secondary text-sm leading-relaxed">Claro, somos distribuidores directos. Entre más necesites, mejoramos el presupuesto para tu ferretería o constructora.</p>
            </div>
            <div className="p-8 rounded-[32px] bg-card-bg/30 border border-white/5">
              <h4 className="font-bold text-lg mb-3 text-accent uppercase">¿Cómo solicito una cotización?</h4>
              <p className="text-text-secondary text-sm leading-relaxed">Puedes agregar productos a tu lista en esta web y enviarla por WhatsApp, o llamarnos directamente.</p>
            </div>
            <div className="p-8 rounded-[32px] bg-card-bg/30 border border-white/5">
              <h4 className="font-bold text-lg mb-3 text-accent uppercase">¿Aceptan pagos con tarjeta?</h4>
              <p className="text-text-secondary text-sm leading-relaxed">Aceptamos transferencias, depósitos y pagos con tarjeta directamente en nuestro centro operativo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-bg border-t border-border">
        <div className="section-container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png?v=2.5" 
                  alt="DICON" 
                  className="h-8 w-auto opacity-80"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }} 
                />
                <div className="text-2xl font-extrabold tracking-tighter text-text-primary">
                  DI<span className="text-accent">CON</span>
                </div>
              </div>
              <p className="text-text-secondary text-sm font-medium italic">"Cimientos sólidos para proyectos extraordinarios."</p>
            </div>

            <div className="text-right flex flex-col items-center md:items-end gap-2">
              <div className="text-xs text-text-secondary font-medium">
                Llámanos ahora: <span className="text-text-primary ml-2">+52 656 634 8189</span>
              </div>
              <div className="text-xs text-text-secondary font-medium">
                Ubicación: <span className="text-text-primary ml-2">Ciudad Juárez, MX</span>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-border text-center">
            <p className="text-[10px] text-text-secondary uppercase tracking-[4px] font-bold opacity-30">
              © 2026 DICON DISTRIBUIDORA
            </p>
            <p className="text-text-secondary text-xs opacity-50 mt-4">
              Sistema v2.5 - REVOLUCIÓN
            </p>
            {imageErrors.length > 0 && (
              <p className="text-red-500 text-[10px] mt-2">
                Errores detectados: {imageErrors.length} ({imageErrors.slice(0, 3).join(", ")})
              </p>
            )}
          </div>
        </div>
      </footer>
      
      {/* Marquee Animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.33%, 0, 0); }
        }
        .animate-marquee-slow {
          animation: marquee 60s linear infinite;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .animate-marquee-fast {
          animation: marquee 40s linear infinite;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-accent);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
