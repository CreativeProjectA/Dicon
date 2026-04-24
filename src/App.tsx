/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// v1.1.0 - Luxury UI & Catalog Specs Final

import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { 
  Phone, 
  MapPin, 
  Facebook,
  MessageCircle, 
  Menu, 
  X, 
  ChevronRight,
  ChevronDown, 
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
  Layers,
  Sparkle,
  Trash2,
  ShoppingBag,
  Package,
  ShoppingCart,
  FileText,
  ExternalLink,
  Mail,
  Target,
  Eye,
  Award,
  Search
} from "lucide-react";
import { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";

const BRANDS = [
  "CEMENTO CHIHUAHUA",
  "TOTAL",
  "IUSA",
  "ZAAK",
  "PANEL REY",
  "MAXIMO",
  "TRUPER",
  "AXEL",
  "ATLAS"
];

const BRANDS_INDUSTRIAL = [
  "URREA", "Surtek", "Foy", "LOCK", "Truper", "WD-40", 
  "KleinTools", "Austromex", "Mueller", "IUSA", "Ternium", "Milwaukee", "Makita", "Fandeli"
];

const INDUSTRIAL_CLIENTS = [
  { name: "GCC", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Logo_GCC.svg/2560px-Logo_GCC.svg.png" },
  { name: "tpi COMPOSITES", img: "https://www.tpicomposites.com/media/1xjpk2u0/tpi_logo.png" },
  { name: "TECMA", img: "https://www.tecma.com/wp-content/themes/tecma/images/tecma-logo-blue.png" },
  { name: "JMAS", img: "" },
  { name: "FLUTEC", img: "" },
  { name: "Omnibus de México", img: "" },
  { name: "GRUPO IMPERIAL", img: "" },
  { name: "S*Mart", img: "" },
  { name: "BRP", img: "" }
];

const PUBLICO_PRODUCTS = {
  "Materiales de Construcción": [
    { id: 2, name: "Cemento Chihuahua", price: 210, unit: "bulto", img: "/cemento.png", variants: ["25kg - Resistencia CPC 30R"] },
    { id: 3, name: "Block de concreto", price: 12, unit: "pieza", img: "/block.png", variants: ["4\" (10x20x40cm)", "6\" (15x20x40cm)", "8\" (20x20x40cm)"] },
    { id: 4, name: "Mortero Chuviscar", price: 95, unit: "bulto", img: "/mortero.png", variants: ["25kg - Alta adherencia"] },
    { id: 5, name: "Yeso Máximo", price: 85, unit: "bulto", img: "/yeso.png", variants: ["40kg - Acabado extra fino"] },
    { id: 1, name: "Varilla corrugada", price: 180, unit: "pieza", img: "/varilla.png", variants: ["3/8\" (9.5mm) - 12m", "1/2\" (12.7mm) - 12m", "5/8\" (15.9mm) - 12m"] },
    { id: 6, name: "Castillo Armado", price: null, unit: "tramo", img: "/castillo.png", variants: ["15x15-4 (2.5m)", "15x20-4 (3.0m)"] },
    { id: 101, name: "Malla Electrosoldada", price: null, unit: "rollo", img: "/malla.png", variants: ["6x6 10/10 (40m²)"] },
  ],
  "Plomería Industrial": [
    { id: 7, name: "Tubo PVC C-40", price: 85, unit: "tramo", img: "/pvc.png", variants: ["1/2\" x 6m", "3/4\" x 6m", "1\" x 6m", "2\" x 6m", "4\" x 6m"] },
    { id: 8, name: "Codo Negro 90°", price: 18, unit: "pieza", img: "/codo_negro_1.png", variants: ["1/2\" Sch 40", "3/4\" Sch 40", "1\" Sch 40", "2\" Sch 40"] },
    { id: 9, name: "Tee Negra", price: 22, unit: "pieza", img: "/tee_negra.png", variants: ["1/2\" Sch 40", "3/4\" Sch 40", "1\" Sch 40", "2\" Sch 40"] },
    { id: 10, name: "Válvula de Bola", price: 45, unit: "pieza", img: "/valbula.png", variants: ["1/2\" (600 PSI)", "3/4\" (600 PSI)", "1\" (600 PSI)", "2\" (600 PSI)"] },
    { id: 11, name: "Tubo Negro Roscado", price: 120, unit: "tramo", img: "/tubo_negro_roscada.png", variants: ["1/2\" x 6m", "3/4\" x 6m", "1\" x 6m", "2\" x 6m"] },
  ],
  "Pintura y Recubrimientos": [
    { id: 50, name: "Impermeabilizante Axel", price: 320, unit: "cubeta", img: "/axel.png", variants: ["19L - 3 Años", "19L - 5 Años", "19L - 10 Años"] },
    { id: 51, name: "Pintura Tráfico", price: 280, unit: "cubeta", img: "/trafico.png", variants: ["19L - Amarillo Industrial", "19L - Blanco"] },
    { id: 52, name: "Pega Azulejo Atlas", price: 280, unit: "bulto", img: "/pega.png", variants: ["20kg - Piso sobre Piso", "20kg - Estándar"] },
  ]
};

const CONSTRUCTORA_PRODUCTS = Object.entries(PUBLICO_PRODUCTS).reduce((acc, [category, products]) => {
  acc[category] = products.map(p => ({ 
    ...p, 
    // Ahora mantenemos el precio base para que el mayoreo se "active" al llegar a 10
    // en el módulo de constructoras específicamente.
    constructorMode: true 
  }));
  return acc;
}, {} as any);

const QUOTE_CARDS_PUBLIC = [
  { 
    title: "Herramientas y Ferretería General", 
    items: "WD-40, candados, cintas, tornillería, cerrajería, material eléctrico", 
    msg: "Hola DICON, me interesa cotizar herramientas y ferretería general" 
  }
];

const QUOTE_CARDS_CONSTRUCTORA = [
  { title: "Acero Comercial", icon: <Layers />, items: "Canal, Tubería negra, Lámina, Viga, Varilla, PTR, Ángulo, Soleras, Placas, Perfiles", msg: "Hola DICON, necesito cotización por volumen de Acero Comercial" },
  { title: "Acero Especial", icon: <Zap />, items: "Inoxidable, Carbón, Grado herramienta, Resistente abrasión", msg: "Hola DICON, solicito cotización de Acero Especial" },
  { title: "Herramientas Surtek / Urrea", icon: <Wrench />, items: "Juegos completos, Llaves, Dados, Pinzas, Torque, Impacto", msg: "Hola DICON, cotización de Herramientas Industriales" },
  { title: "Plomería Industrial", icon: <Droplets />, items: "Tubería PVC, CPVC, PPR, Cobre y todas sus conexiones", msg: "Hola DICON, cotización Plomería Industrial" },
  { title: "EPP", icon: <ShieldCheck />, items: "Cascos, guantes, lentes, señalización, ropa de trabajo", msg: "Hola DICON, cotización de EPP" },
  { title: "Racks y Estantes", icon: <Box />, items: "Fabricación a medida, diseño personalizado", msg: "Hola DICON, cotización Racks" },
];

const QUOTE_CARDS_MAQUILA = [
  { title: "Tornillería Industrial", icon: <Package />, items: "Tornillos, tuercas, rondanas, pijas, anclas — todas las medidas", msg: "Hola DICON, necesito cotizar tornillería industrial" },
  { title: "Acero Especial Industrial", icon: <Layers />, items: "Inoxidable, carbón, grado herramienta, resistente abrasión — en barras, placas y perfiles", msg: "Hola DICON, cotización Acero Especial Industrial" },
  { title: "Herramientas de Precisión", icon: <Drill />, items: "Dados, llaves de torque, medición y trazo, extractores, prensas", msg: "Hola DICON, cotización Herramientas Precisión" },
  { title: "Lubricantes y Químicos", icon: <Droplets />, items: "WD-40 industrial, aceites, grasas, limpiadores, químicos especiales", msg: "Hola DICON, cotización Lubricantes" },
  { title: "EPP Industrial", icon: <ShieldCheck />, items: "Cascos, guantes anticorte, lentes, tapones auditivos, señalización OSHA", msg: "Hola DICON, cotización EPP Industrial" },
  { title: "Racks y Estaciones de Trabajo", icon: <Box />, items: "Racks de almacenamiento, estantes industriales, fabricación a medida", msg: "Hola DICON, cotización Racks/Estaciones" },
  { title: "Herramientas Eléctricas y Neumáticas", icon: <Zap />, items: "Taladros, esmeriles, compresores, aspiradoras industriales, herramientas de poder", msg: "Hola DICON, cotización Herramientas Poder" },
  { title: "Plásticos e Insumos", icon: <Layers />, items: "Policarbonato sólido, cintas industriales, masking tape, vinílica, de empaque, aislante", msg: "Hola DICON, cotización Plásticos/Insumos" },
  { title: "Material Eléctrico e Iluminación", icon: <Zap />, items: "Cables, contactos, interruptores, lámparas industriales LED", msg: "Hola DICON, cotización Material Eléctrico" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 1.1, 
      ease: [0.16, 1, 0.3, 1] 
    }
  }
};

const QuoteCard = memo(({ card, isLowPowerMode }: any) => {
  if (isLowPowerMode) {
    return (
      <div className="product-grid-item bg-white/[0.06] p-8 border border-white/[0.08] rounded-[24px] flex flex-col min-h-[300px] relative overflow-hidden transition-all shadow-sm transform-gpu will-change-transform contain-paint antialiased">
        <div className="flex flex-col gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
            {card.icon || <Package className="w-6 h-6" />}
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white">{card.title}</h3>
        </div>
        <p className="text-white/50 text-sm font-normal leading-relaxed mb-8 grow">
          {card.items}
        </p>
        <button 
          onClick={() => window.open(`https://wa.me/5216568079485?text=${encodeURIComponent(card.msg)}`, '_blank')}
          className="w-full bg-accent text-white py-4 rounded-full font-bold text-sm tracking-wide active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          Cotizar por WhatsApp
          <MessageCircle className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-card p-8 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] group flex flex-col min-h-[300px] relative overflow-hidden transition-all shadow-sm transform-gpu will-change-transform contain-paint backface-visibility-hidden"
    >
      <div className="flex flex-col gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
          {card.icon || <Package className="w-6 h-6" />}
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-white">{card.title}</h3>
      </div>
      <p className="text-white/50 text-sm font-normal leading-relaxed mb-8 grow">
        {card.items}
      </p>
      <button 
        onClick={() => window.open(`https://wa.me/5216568079485?text=${encodeURIComponent(card.msg)}`, '_blank')}
        className="w-full bg-accent text-white py-4 rounded-full font-bold text-sm tracking-wide hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        Cotizar por WhatsApp
        <MessageCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
});

// Optimización extrema: Bypass de Framer Motion en móvil para el catálogo
const ProductCard = memo(({ product, addToCart, isLowPowerMode }: any) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants ? product.variants[0] : null);
  const [qty, setQty] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  const finalUnitPrice = useMemo(() => {
    if (!product.price) return null;
    // Mayoreo SOLO en modo constructor cuando cantidad es 10+
    if (product.constructorMode && qty >= 10) {
      return Math.round(product.price * 0.85);
    }
    return product.price;
  }, [product, qty]);

  const savings = useMemo(() => {
    if (!product.price || !product.constructorMode || qty < 10) return 0;
    const totalOriginal = product.price * qty;
    const totalDiscounted = Math.round(product.price * 0.85) * qty;
    return totalOriginal - totalDiscounted;
  }, [product, qty]);

  const isMayoreoActive = useMemo(() => {
    // Solo activamos banderas de mayoreo en modo constructor
    return product.constructorMode && qty >= 10 && product.price;
  }, [product.constructorMode, qty, product.price]);

  if (isLowPowerMode) {
    return (
      <div className="product-grid-item bg-white/[0.06] p-6 border border-white/[0.08] rounded-[24px] flex flex-col h-full relative overflow-hidden transition-all shadow-sm transform-gpu will-change-transform contain-layout">
        <div className="relative aspect-square mb-6 bg-white/[0.02] rounded-2xl flex items-center justify-center p-8 overflow-hidden will-change-transform contain-layout antialiased">
          <div className={`absolute inset-0 bg-accent/5 transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
          <img 
            src={product.img} 
            alt={product.name}
            onLoad={() => setIsLoaded(true)}
            className={`w-full h-full object-contain pointer-events-none transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
            loading="lazy"
            decoding="async"
            fetchPriority="low"
          />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{product.name}</h3>
            {product.variants && (
              <div className="flex flex-wrap gap-2 mt-3">
                {product.variants.map((v: string) => (
                  <button 
                    key={v}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1 rounded-full text-[10px] font-medium border transition-all ${selectedVariant === v ? 'bg-white text-black border-white' : 'border-white/10 text-white/40'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>

                      <div className="mt-auto">
            <div className="flex items-end justify-between mb-6">
              <div>
                 <p className="text-xs text-white/40 mb-1 font-medium">Cotización</p>
                 <div className="flex items-center gap-2">
                   <span className="text-xl font-bold text-accent">
                     Ver al cotizar
                   </span>
                 </div>
              </div>
              
              <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 h-10">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 px-2 flex items-center justify-center"><Minus className="w-3 h-3 text-white/40"/></button>
                <span className="w-6 text-center text-xs font-bold text-white">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 px-2 flex items-center justify-center"><Plus className="w-3 h-3 text-white/40"/></button>
              </div>
            </div>

            <button 
              onClick={() => addToCart({ ...product, qty, selectedVariant })}
              className="w-full bg-accent text-white py-4 rounded-full font-bold text-sm tracking-wide active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              Añadir a mi lista <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Versión Desktop con animaciones premium
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20px" }}
      className="glass-card p-6 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] group flex flex-col h-full relative overflow-hidden transition-all shadow-sm transform-gpu will-change-transform contain-paint backface-visibility-hidden"
    >
      <div className="relative aspect-square mb-6 bg-white/[0.02] rounded-2xl flex items-center justify-center p-8 overflow-hidden will-change-transform contain-layout">
        <div className={`absolute inset-0 bg-accent/5 transition-opacity duration-1000 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <img 
          src={product.img} 
          alt={product.name}
          onLoad={() => setIsLoaded(true)}
          className={`w-full h-full object-contain group-hover:scale-110 transition-all duration-700 pointer-events-none ${isLoaded ? 'opacity-100' : 'opacity-0'}`} 
          loading="lazy"
          decoding="async"
          fetchPriority="low"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-1 tracking-tight">{product.name}</h3>
          {product.variants && (
            <div className="flex flex-wrap gap-2 mt-3">
              {product.variants.map((v: string) => (
                <button 
                  key={v}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-3 py-1 rounded-full text-[10px] font-medium border transition-all ${selectedVariant === v ? 'bg-white text-black border-white' : 'border-white/10 text-white/40 hover:border-white/30'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-auto">
          <div className="flex items-end justify-between mb-6">
            <div>
               <p className="text-xs text-white/40 mb-1 font-medium">Cotización</p>
               <div className="flex items-center gap-2">
                 <span className="text-xl font-bold text-accent">
                   A COTIZAR
                 </span>
               </div>
            </div>
            
            <div className="flex items-center bg-white/5 border border-white/10 rounded-full p-1 h-10">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-accent transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-white tracking-tighter">
                {qty}
              </span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-accent transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button 
            onClick={() => addToCart({ ...product, qty, selectedVariant })}
            className="w-full bg-accent text-white py-4 rounded-full font-bold text-sm tracking-wide hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
          >
            Incluir en mi presupuesto <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default function App() {
  const [site, setSite] = useState<'general' | 'industrial'>('general');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState({ name: '', companyName: '', type: 'Público General' });
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<null | 'publico' | 'constructora' | 'maquila'>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Search optimization - useMemo to prevent recalculating on every re-render
  const filteredPublicProducts = useMemo(() => {
    return Object.entries(PUBLICO_PRODUCTS).reduce((acc: any, [category, products]) => {
      const filtered = (products as any[]).filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.variants && p.variants.some((v: string) => v.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      if (filtered.length > 0) acc[category] = filtered;
      return acc;
    }, {});
  }, [searchQuery]);

  const filteredConstructoraProducts = useMemo(() => {
    return Object.entries(CONSTRUCTORA_PRODUCTS).reduce((acc: any, [category, products]) => {
      const filtered = (products as any[]).filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.variants && p.variants.some((v: string) => v.toLowerCase().includes(searchQuery.toLowerCase())))
      );
      if (filtered.length > 0) acc[category] = filtered;
      return acc;
    }, {});
  }, [searchQuery]);

  const menudeoRef = useRef<HTMLElement>(null);
  const mayoreoRef = useRef<HTMLElement>(null);
  const maquilaRef = useRef<HTMLElement>(null);

  const [isLowPowerMode, setIsLowPowerMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  });

  useEffect(() => {
    const checkPerformance = () => {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsLowPowerMode(isMobile || isSmallScreen || prefersReducedMotion);
    };
    
    // Check immediately on mount in case the initial state was wrong
    checkPerformance();
    
    let timeout: any;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(checkPerformance, 200);
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (activeModal || isCartOpen || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [activeModal, isCartOpen, isMenuOpen]);

  const scrollToSection = useCallback((ref: { current: HTMLElement | null }) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  // Cart logic - Simplified for Quote Only
  const addToCart = useCallback((product: any) => {
    setCart(prev => {
      // Identificador único: ID + Modo + Variante (si aplica)
      const cartItemId = `${product.id}-${product.constructorMode ? 'con' : 'pub'}-${product.selectedVariant || 'base'}`;
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      
      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + (product.qty || 1)
        };
        return newCart;
      }
      
      return [...prev, { ...product, cartItemId, quantity: (product.qty || 1) }];
    });
  }, []);

  const updateQuantity = useCallback((cartItemId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const generateWhatsAppMessage = useCallback(() => {
    const company = customerInfo.companyName ? `\nEmpresa: ${customerInfo.companyName}` : '';
    const header = `Hola DICON Juárez,\nMi nombre es: ${customerInfo.name || 'No registrado'}${company}\nTipo de cliente: ${customerInfo.type}\n\nMe interesa cotizar estos productos:\n\n`;
    const items = cart.map(item => {
      const variantText = item.selectedVariant ? ` (${item.selectedVariant})` : "";
      return `- ${item.quantity}x ${item.name}${variantText}`;
    }).join("\n");
    
    const footer = "\n\nQuedo a la espera de su respuesta. Gracias.";
    
    return encodeURIComponent(header + items + footer);
  }, [cart, customerInfo]);

  const whatsappUrl = `https://wa.me/5216568079485?text=${generateWhatsAppMessage()}`;

// Helper components to avoid lag on mobile
const GlowSpheres = memo(({ isLowPowerMode, smoothY }: any) => {
  // Disable on low power/mobile for absolute zero lag
  if (isLowPowerMode) return null;

  // Parallax movement for the orange glow
  const glowY = useTransform(smoothY, [0, 1], ["-20%", "20%"]);
  const glowY2 = useTransform(smoothY, [0, 1], ["10%", "-10%"]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden will-change-transform transform-gpu perspective-[1000px]">
      {/* Central Moving Glow */}
      <motion.div 
        style={{ y: glowY, translateZ: 1 }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-accent/10 blur-[180px] rounded-full will-change-transform"
      />
      <motion.div 
        style={{ y: glowY2, translateZ: 1 }}
        className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full translate-x-1/4 will-change-transform"
      />
      <div className="absolute inset-0 bg-[#080808]/40 antialiased" />
    </div>
  );
});

const CartContent = memo(({ 
  cart, 
  customerInfo, 
  setIsCartOpen, 
  removeFromCart, 
  updateQuantity, 
  whatsappUrl 
}: any) => {
  return (
    <div className="flex flex-col h-full bg-[#000] text-white overflow-hidden transform-gpu">
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/80 backdrop-blur-xl sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Mi Lista</h3>
            <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em]">{cart.length} Artículos</p>
          </div>
        </div>
        <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white p-2">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black will-change-scroll">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 px-10">
            <motion.div
              animate={{ 
                y: [0, -12, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-24 h-24 rounded-[32px] bg-white/[0.02] flex items-center justify-center text-white/10 border border-white/[0.05] shadow-2xl"
            >
              <Package className="w-12 h-12" />
            </motion.div>
            <div className="space-y-2">
              <p className="text-xl font-bold tracking-tight text-white">Tu lista está vacía</p>
              <p className="text-sm font-medium text-white/30 leading-relaxed max-w-[200px] mx-auto">
                Agrega productos de nuestro catálogo para generar una cotización.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item: any) => (
              <motion.div 
                key={item.cartItemId} 
                layout="position"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/[0.03] p-5 rounded-[24px] border border-white/[0.06] relative group overflow-hidden hover:bg-white/[0.05] transition-colors will-change-transform"
              >
                <div className="flex gap-5">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/[0.03] p-3 flex-shrink-0 flex items-center justify-center">
                    <img src={item.img} className="w-full h-full object-contain" loading="lazy" decoding="async" alt={item.name} />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between items-start mb-1">
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm tracking-tight truncate text-white uppercase">{item.name}</p>
                          {item.selectedVariant && <p className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-0.5">{item.selectedVariant}</p>}
                        </div>
                        <button onClick={() => removeFromCart(item.cartItemId)} className="text-white/20 hover:text-red-400 transition-colors p-1 ml-2">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] text-accent font-black uppercase tracking-[2px]">Disponible para Cotizar</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
                  <div className="flex items-center bg-white/[0.03] rounded-full p-1 border border-white/[0.05]">
                    <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors"><Minus className="w-3 h-3"/></button>
                    <span className="w-8 text-center text-xs font-black tracking-tighter">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors"><Plus className="w-3 h-3"/></button>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-none mb-1">Estatus</p>
                    <p className="text-sm font-black tracking-widest text-accent uppercase">A COTIZAR</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="p-8 border-t border-white/10 bg-[#050505] shadow-[0_-20px_40px_rgba(0,0,0,0.4)] relative z-30">
        <div className="mb-8">
           <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
             <p className="text-[10px] font-black uppercase tracking-[3px] text-white/20 mb-3">Información de Solicitante</p>
             <p className="text-sm font-bold text-white tracking-tight">{customerInfo.name || 'Invitado'}</p>
             {customerInfo.companyName && <p className="text-xs text-white/60 font-medium mt-1">{customerInfo.companyName}</p>}
             <p className="text-[10px] text-accent font-black uppercase tracking-[2px] mt-1">{customerInfo.type}</p>
           </div>
        </div>
        
        <motion.a 
          href={whatsappUrl}
          target="_blank"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-accent text-white py-5 rounded-2xl font-black text-sm tracking-[0.1em] uppercase hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(255,87,34,0.3)] group"
        >
          SOLICITAR COTIZACIÓN <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.a>
        <p className="text-center text-[9px] text-white/20 font-bold uppercase tracking-widest mt-6">
          Te responderemos vía WhatsApp en minutos
        </p>
      </div>
    </div>
  );
});

  // Advanced Scroll Parallax Hook - Optimized and Subtler on Mobile
  const { scrollYProgress } = useScroll();
  
  // Dynamic spring config: high stiffness on mobile for efficiency, smooth on PC for flair
  const springConfig = useMemo(() => isLowPowerMode 
    ? { stiffness: 400, damping: 60, mass: 0.5, restDelta: 0.01 } 
    : { stiffness: 80, damping: 25, mass: 1, restDelta: 0.001 }, [isLowPowerMode]);

  const smoothY = useSpring(scrollYProgress, springConfig);

  const GlowSpheresCall = <GlowSpheres isLowPowerMode={isLowPowerMode} smoothY={smoothY} />;
    
  const RegistrationForm = () => {
    const [name, setName] = useState(customerInfo.name);
    const [companyName, setCompanyName] = useState(customerInfo.companyName);
    const [type, setType] = useState(customerInfo.type);

    const handleSubmit = (e: any) => {
      e.preventDefault();
      if (!name) return;
      setCustomerInfo({ name, companyName, type });
      setIsRegistered(true);
      
      // Lógica de redirección basada en el tipo de cliente
      if (type === 'Público General') {
        setActiveModal('publico');
      } else {
        setActiveModal('constructora');
      }
    };

    return (
      <section id="registro" className="pt-52 pb-40 relative bg-bg overflow-visible contain-paint">
        {/* Background Animation behind Form */}
        {!isLowPowerMode && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            <motion.div 
              style={{ y: useTransform(smoothY, [0, 1], [0, 300]), translateZ: 0 }}
              className="absolute bottom-[-15%] -left-[10%] w-[700px] z-0"
            >
              <img src="/block2.png" alt="" className="w-full h-auto grayscale brightness-125 opacity-[0.12] -rotate-12" />
            </motion.div>
          </div>
        )}

        <div className="section-container relative z-10">
          <div className="max-w-xl mx-auto">
            <div className="glass-card p-12 border border-white/10 shadow-2xl relative bg-black/40 backdrop-blur-3xl mt-12">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-accent flex items-center justify-center shadow-xl z-20">
                <FileText className="text-white w-10 h-10" />
              </div>
              
              <div className="text-center mt-8 mb-10">
                <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">Cotización Express</h2>
                <p className="text-white/40 text-sm italic">"Donde la calidad y el servicio se encuentran"</p>
                <p className="text-white/20 text-[10px] uppercase tracking-[4px] mt-4">Completa para ver catálogo</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[3px] text-accent mb-3">Tu Nombre</label>
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/20 focus:border-accent outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[3px] text-accent mb-3">Empresa <span className="opacity-40">(Opcional)</span></label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ej. Suministros Industriales S.A."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white placeholder:text-white/20 focus:border-accent outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[3px] text-accent mb-3">Tipo de Cliente</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Público General', 'Ferretería', 'Constructora'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`px-2 py-4 rounded-xl text-center font-bold text-[9px] uppercase tracking-widest border transition-all ${
                          type === t 
                            ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20' 
                            : 'bg-white/5 border-white/10 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-accent text-white py-5 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-3 mt-8 shadow-xl"
                >
                  Ver Catálogo <ArrowRight className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  };

  const IndustrialSection = () => {
    return (
      <section id="industrial" className="py-32 relative bg-bg border-t border-white/5 overflow-hidden" style={{ contentVisibility: 'auto' } as any}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="section-container relative z-10">
          <div className="text-center mb-24">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <img 
                src="/supply.png" 
                alt="Dicon Industrial Supply" 
                className="h-40 md:h-64 lg:h-80 w-auto" 
                loading="lazy"
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-center mb-32">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="relative space-y-8 order-2 lg:order-1"
              >
                <div className="relative rounded-[60px] overflow-hidden border border-white/5 bg-black/[0.2] aspect-[4/5] lg:aspect-square flex items-center justify-center group shadow-2xl">
                   <div className="absolute inset-0 bg-accent/15 mix-blend-color group-hover:bg-accent/5 transition-colors duration-1000 z-10" />
                   <img src="/herramienta1.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms] ease-out-expo" alt="Herramientas" />
                   <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-20" />
                   
                   <div className="absolute bottom-16 left-16 right-16 z-30 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-8 group-hover:translate-y-0">
                      <div className="w-12 h-1 bg-accent mb-6" />
                      <p className="text-accent font-black text-[10px] uppercase tracking-[8px] mb-3">Suministro Estratégico</p>
                      <h3 className="text-white font-black text-3xl uppercase italic leading-none tracking-tighter">Soluciones <br/> de Precisión</h3>
                   </div>
                </div>

                {/* Complementary Facade Image Block */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="rounded-[40px] overflow-hidden border border-white/5 aspect-video relative group shadow-2xl"
                >
                   <img src="/dicon fachada.png" className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt="Instalaciones Dicon" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                   <div className="absolute bottom-6 left-8">
                     <p className="text-[10px] font-black uppercase tracking-[4px] text-accent">Sede Regional</p>
                     <p className="text-white font-bold text-sm">Capacidad Operativa Inmediata</p>
                   </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                className="order-1 lg:order-2"
              >
                <div className="inline-flex items-center gap-4 mb-10">
                  <div className="w-16 h-[2px] bg-accent/40" />
                  <span className="text-accent font-black text-[10px] uppercase tracking-[6px]">Partner Industrial</span>
                </div>
                
                <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.75] mb-14">
                  Ingeniería <br/> 
                  <span className="text-white/10 font-bold block mt-2">Superior</span>
                </h2>

                <div className="space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-[40px] hover:bg-white/[0.04] transition-all hover:border-accent/30 group relative overflow-hidden backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                         <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[3px] text-accent/60 mb-1">Aceros</h4>
                        <h5 className="text-xl font-bold text-white tracking-tight">Especiales & Aleados</h5>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      {["Inoxidables", "Grado Herramienta", "Carbón", "Aleaciones"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group/item">
                          <div className="w-1 h-1 bg-accent/40 rounded-full" />
                          <span className="text-white/40 text-[11px] font-bold uppercase tracking-wider group-hover/item:text-white transition-colors">{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="p-8 bg-white/[0.02] border border-white/[0.06] rounded-[40px] hover:bg-white/[0.04] transition-all hover:border-accent/30 group relative overflow-hidden backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-6 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                         <Layers className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-[3px] text-accent/60 mb-1">Estructural</h4>
                        <h5 className="text-xl font-bold text-white tracking-tight">Perfiles & Tubería</h5>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                      {["Viga IPR/HSS", "Perfil PTR", "Láminas", "Tubería Sch"].map((item, i) => (
                        <div key={i} className="flex items-center gap-3 group/item">
                          <div className="w-1 h-1 bg-accent/40 rounded-full" />
                          <span className="text-white/40 text-[11px] font-bold uppercase tracking-wider group-hover/item:text-white transition-colors">{item}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="mt-14 flex flex-col sm:flex-row items-center gap-6">
                  <button 
                    onClick={() => window.open(`https://wa.me/5216568079485?text=${encodeURIComponent("Hola DICON, me interesa cotizar para el área de Dicon Industrial Supply.")}`, '_blank')} 
                    className="w-full sm:w-auto group flex items-center justify-center gap-4 bg-accent text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-2xl shadow-accent/20 active:scale-95"
                  >
                    MRO Industrial <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <div className="hidden sm:block h-12 w-px bg-white/10" />
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-[3px] text-center sm:text-left">
                    Atención Directa <br/> a Plantas
                  </p>
                </div>
              </motion.div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
            {[
              { 
                icon: <Layers className="w-8 h-8" />,
                title: "Aceros & Metales", 
                items: ["Inoxidable 304/316", "Grado Herramienta", "Carbón y Aleados", "Placa Antiderrapante"] 
              },
              { 
                icon: <Wrench className="w-8 h-8" />,
                title: "Herramientas de Precisión", 
                items: ["Dados de impacto", "Llaves de torque", "Extractores y prensas", "Equipos automotrices"] 
              },
              { 
                icon: <Box className="w-8 h-8" />,
                title: "MRO & Consumibles", 
                items: ["Lubricantes WD-40", "Plásticos técnicos", "Pinturas y esmaltes", "Tornillería grado 5/8"] 
              },
              { 
                icon: <Droplets className="w-8 h-8" />,
                title: "Cintas e Insumos", 
                items: ["Cinta Masking/Vinílica", "Aislantes térmicos", "Empaque industrial", "Filtración industrial"] 
              },
              { 
                icon: <ShieldCheck className="w-8 h-8" />,
                title: "EPP & Seguridad Corp", 
                items: ["Señalización OSHA", "Arneses certificados", "Calzado técnico", "Protección facial"] 
              },
              { 
                icon: <Layers className="w-8 h-8" />,
                title: "Racks & Almacenaje", 
                items: ["Diseño a medida", "Fabricación de estantes", "Optimización de CEDIS", "Racks industriales"] 
              },
            ].map((group, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="glass-card p-10 border border-white/5 hover:border-accent transition-all group flex flex-col items-center text-center relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-4 h-4 text-accent/40" />
                 </div>
                 
                 <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all duration-500 shadow-lg group-hover:shadow-accent/40">
                    {group.icon}
                 </div>
                 <h3 className="text-xl font-bold mb-6 uppercase tracking-tight group-hover:text-accent transition-colors italic">{group.title}</h3>
                 <ul className="space-y-3 mb-10 w-full">
                   {group.items.map(item => (
                     <li key={item} className="text-white/40 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 group-hover:text-white/70 transition-colors">
                        <span className="w-1 h-1 bg-accent/40 rounded-full group-hover:bg-accent transition-colors" /> {item}
                     </li>
                   ))}
                 </ul>
                                   <button 
                    onClick={() => window.open(`https://wa.me/5216568079485?text=${encodeURIComponent(`Hola DICON, me interesa cotizar para el área Industrial: ${group.title}.`)}`, '_blank')} 
                    className="mt-auto text-accent font-black text-[10px] uppercase tracking-[3px] flex items-center gap-2 hover:opacity-80 transition-all group/btn"
                  >
                   Solicitar cotización <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                 </button>
              </motion.div>
            ))}
          </div>

          <div className="mt-32 pt-32 border-t border-white/5 relative">
             <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full pointer-events-none" />
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
               <motion.div
                 initial={{ opacity: 0, scale: 0.95 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1 }}
               >
                  <span className="text-accent font-black text-[10px] uppercase tracking-[6px] mb-6 block italic">Infraestructura Transfronteriza</span>
                  <h2 className="text-5xl font-black uppercase tracking-tighter mb-10 leading-none italic">Alianza Estratégica <br/> <span className="text-white/40 font-normal">El Paso, TX.</span></h2>
                  <p className="text-white/60 text-lg leading-relaxed mb-10 font-medium max-w-xl">
                    Nuestra empresa hermana en Texas potencia nuestra logística binacional, permitiendo el suministro ágil de materiales MRO y aceros especializados que la industria maquiladora demanda con urgencia.
                  </p>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="relative group p-4 border border-white/5 bg-white/[0.01] rounded-2xl">
                       <p className="text-2xl font-black text-white italic leading-none">24/7</p>
                       <p className="text-[9px] uppercase tracking-[4px] text-white/30 font-bold mt-2 leading-tight">Servicio <br/>Industria</p>
                    </div>
                    <div className="relative group p-4 border border-white/5 bg-white/[0.01] rounded-2xl">
                       <p className="text-2xl font-black text-white italic leading-none">TX-JU</p>
                       <p className="text-[9px] uppercase tracking-[4px] text-white/30 font-bold mt-2 leading-tight">Cruce <br/>Express</p>
                    </div>
                    <div className="relative group p-4 border border-white/5 bg-white/[0.01] rounded-2xl">
                       <p className="text-2xl font-black text-white italic leading-none">ENG/ESP</p>
                       <p className="text-[9px] uppercase tracking-[4px] text-white/30 font-bold mt-2 leading-tight">Atención <br/>Bilingüe</p>
                    </div>
                  </div>
               </motion.div>
               
               <motion.div 
                 initial={{ opacity: 0, x: 30 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 className="relative group min-h-[400px]"
               >
                  <div className="absolute inset-0 bg-accent/10 rounded-[40px] blur-2xl group-hover:bg-accent/20 transition-all duration-700" />
                  <div className="relative h-full w-full rounded-[40px] overflow-hidden border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center p-12">
                     <div className="text-center relative z-10">
                        <div className="w-24 h-24 rounded-[32px] bg-accent rotate-12 flex items-center justify-center mx-auto mb-10 shadow-[0_20px_50px_rgba(249,115,22,0.4)] group-hover:rotate-0 transition-transform duration-700">
                           <Truck className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <p className="text-white font-black text-3xl uppercase italic tracking-tighter mb-4">Exportación <span className="text-accent underline decoration-white/10">Premium</span></p>
                        <p className="text-white/40 text-[10px] font-black uppercase tracking-[5px]">Logística sin fronteras</p>
                     </div>
                     
                     <div className="absolute top-10 left-10 w-20 h-px bg-white/10" />
                     <div className="absolute top-10 left-10 w-px h-20 bg-white/10" />
                     <div className="absolute bottom-10 right-10 w-20 h-px bg-white/10" />
                     <div className="absolute bottom-10 right-10 w-px h-20 bg-white/10" />
                  </div>
               </motion.div>
             </div>
          </div>

          {/* BRANDS TICKER INDUSTRIAL */}
          <div className="mt-32 pt-20 border-t border-white/5 overflow-hidden">
             <p className="text-center text-[10px] font-black uppercase tracking-[8px] text-white/20 mb-12 italic">Marcas Líderes en Suministro Industrial</p>
             <div className="flex gap-20 items-center justify-between opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
               {[...BRANDS_INDUSTRIAL, ...BRANDS_INDUSTRIAL].map((brand, i) => (
                 <motion.span 
                   key={i} 
                   animate={{ x: [0, -1000] }}
                   transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                   className="text-xl font-black uppercase tracking-tighter text-white/80 whitespace-nowrap italic hover:text-accent cursor-default"
                 >
                   {brand}
                 </motion.span>
               ))}
             </div>
          </div>

        </div>
      </section>
    );
  };

  // Parallax ranges - Completely disabled on Mobile (isLowPowerMode) for zero lag
  const y1 = useTransform(smoothY, [0, 1], isLowPowerMode ? [0, 0] : [0, -300]);
  const y2 = useTransform(smoothY, [0, 1], isLowPowerMode ? [0, 0] : [0, -500]);
  const rotate1 = useTransform(smoothY, [0, 1], isLowPowerMode ? [0, 0] : [0, 30]);
  const rotate2 = useTransform(smoothY, [0, 1], isLowPowerMode ? [0, 0] : [0, -20]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '#inicio' },
    { name: 'Catálogo', href: '#registro' },
    { name: 'Industrial Supply', href: '#industrial' },
    { name: 'Ubicación', href: '#contacto' },
  ];

  useEffect(() => {
    if (activeModal || isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [activeModal, isMenuOpen]);

  return (
    <div className="min-h-screen bg-transparent text-text-primary overflow-x-hidden selection:bg-accent/30 font-sans antialiased">
      {/* Background - Replaces the mesh with solid deep black */}
      <div className="fixed inset-0 z-0 bg-[#080808] pointer-events-none translate-z-0 will-change-transform translate-x-0" />
      
      {GlowSpheresCall}

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-[#080808]/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-8"}`}>
        <div className="section-container flex items-center justify-between relative z-50">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            onClick={() => { setIsMenuOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img 
              src="/logo.png" 
              alt="DICON" 
              className="h-12 md:h-16 lg:h-20 w-auto" 
              decoding="async"
              fetchPriority="high"
            />
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => {
                  if (link.name === 'Catálogo' && isRegistered) {
                    e.preventDefault();
                    setActiveModal(customerInfo.type === 'Público General' ? 'publico' : 'constructora');
                  }
                }}
                className="text-[10px] uppercase tracking-[4px] font-black transition-colors hover:text-accent text-white/40"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://wa.me/5216568079485" 
              target="_blank" 
              className="bg-accent text-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-accent/20"
            >
              Cotizar Proyecto
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 text-white relative z-50 flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={isMenuOpen ? 'close' : 'menu'}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>

        {/* Full-screen Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-0 z-40 md:hidden bg-[#080808] flex flex-col pt-32 px-10"
            >
              <div className="flex flex-col gap-10">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      if (link.name === 'Catálogo' && isRegistered) {
                        e.preventDefault();
                        setActiveModal(customerInfo.type === 'Público General' ? 'publico' : 'constructora');
                      }
                    }}
                    className="text-5xl font-black text-white tracking-tighter hover:text-accent transition-colors italic uppercase shadow-sm"
                  >
                    {link.name}
                  </motion.a>
                ))}
                <motion.a
                  href="https://wa.me/5216568079485"
                  target="_blank"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 bg-accent text-white py-6 rounded-2xl font-black text-center text-sm tracking-widest uppercase shadow-[0_15px_40px_rgba(249,115,22,0.4)]"
                >
                  WhatsApp Cotización
                </motion.a>
              </div>

              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.8 }}
                 className="mt-auto mb-20 text-white/20 text-xs font-bold uppercase tracking-[0.2em] text-center"
              >
                Dicon Juárez © 2024
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="inicio" className="hero-section relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-bg contain-paint" style={{ contentVisibility: 'auto' } as any}>
        {/* Glows */}
        <div className="main-glow" />
        <div className="secondary-glow" />

        <div className="section-container relative z-10 w-full">
          <div className="flex flex-col items-center text-center mb-20 md:mb-32">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="max-w-6xl"
            >
              <motion.div variants={itemVariants} className="inline-block px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.04] mb-8">
                <span className="text-[10px] sm:text-xs font-bold tracking-[3px] text-white/50">
                  LÍDERES EN CIUDAD JUÁREZ
                </span>
              </motion.div>
              
              <motion.h1 
                variants={itemVariants}
                className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black leading-[0.9] tracking-[-0.05em] mb-12 text-white"
              >
                Calidad para <br />
                <span className="text-white/60">Ferreterías</span> <br />
                & Obras.
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl text-white/50 leading-[1.6] mb-16 max-w-2xl mx-auto font-normal"
              >
                Suministramos los materiales esenciales que sostienen a Juárez. Logística especializada para ferreterías y proyectos de construcción.
              </motion.p>
              
              <motion.div 
                variants={itemVariants}
                className="flex flex-wrap justify-center gap-6"
              >
                <button 
                  onClick={() => document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full sm:w-auto bg-accent text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-3 group"
                >
                  Ver Catálogo <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Stats Grid */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative"
          >
            {[
              { label: "7", sub: "Años de experiencia", icon: <ShieldCheck /> },
              { label: "1k+", sub: "Clientes", icon: <Truck /> },
              { label: "24/7", sub: "Soporte", icon: <Zap /> },
              { label: "100%", sub: "Garantía", icon: <Box /> },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={itemVariants}
                className="glass-card p-10 flex flex-col items-center text-center group will-change-transform"
              >
                <div className="text-accent mb-6 transition-transform group-hover:scale-110">{stat.icon}</div>
                <div className="text-5xl font-black text-white mb-2 tracking-tight">{stat.label}</div>
                <div className="text-sm text-white/40 font-medium">{stat.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brands Marquee - GPU Accelerated */}
      <section id="marcas" className="py-24 border-y border-border overflow-hidden bg-[#0a0a0a] relative contain-paint">
        <div className="absolute inset-0 bg-accent/5 z-0 pointer-events-none" />
        <div className="relative z-10 flex overflow-hidden">
          <div className="flex animate-marquee-fast md:animate-marquee-slow whitespace-nowrap gap-20 items-center will-change-transform translate-x-0 force-gpu py-4">
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
              <span 
                key={i} 
                className="text-2xl md:text-5xl font-black text-accent/20 hover:text-accent transition-all duration-500 cursor-default select-none tracking-tighter uppercase backface-visibility-hidden"
              >
                {brand}
              </span>
            ))}
          </div>
          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-60 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-60 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
        </div>
      </section>

      {/* Story / History Section */}
      <section id="historia" className="py-24 md:py-40 relative overflow-hidden bg-transparent contain-paint">
        {/* Glow behind centerpiece */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="section-container relative z-10 text-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="max-w-4xl mx-auto"
          >
            <motion.span variants={itemVariants} className="text-white/40 font-bold text-xs tracking-[6px] uppercase mb-6 block">Nuestro origen</motion.span>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-8xl font-black mb-16 tracking-[-0.05em] text-white">Nuestra historia</motion.h2>

            {/* High-End Centerpiece Animation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative mb-24 flex justify-center"
            >
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 1, -1, 0]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                style={{ y: y1 }}
                className="will-change-transform"
              >
                <img 
                  src="/casco2.png" 
                  alt="Casco Pro DICON" 
                  loading="lazy"
                  decoding="async"
                  className="w-[350px] md:w-[600px] drop-shadow-[0_20px_80px_rgba(255,87,34,0.3)] transition-all duration-700"
                />
              </motion.div>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
              <motion.div variants={itemVariants} className="glass-card p-10 border border-white/5 relative group hover:border-accent/30 transition-colors">
                <div className="text-accent font-bold text-3xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity">01</div>
                <h4 className="text-xl font-bold mb-4 text-white tracking-tight">El inicio</h4>
                <p className="text-text-secondary leading-relaxed font-medium text-sm">
                  DICON nació con una visión clara: ser el pilar logístico de Ciudad Juárez. Comenzamos entendiendo que cada bulto de cemento es el inicio de un hogar o un negocio.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card p-10 border border-white/5 relative group hover:border-accent/30 transition-colors">
                <div className="text-accent font-bold text-3xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity">02</div>
                <h4 className="text-xl font-bold mb-4 text-white tracking-tight">Confianza</h4>
                <p className="text-text-secondary leading-relaxed font-medium text-sm">
                  Nos especializamos en el suministro estratégico para ferreterías y grandes constructoras. Nuestra reputación se forjó en la puntualidad y la calidad innegociable.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-card p-10 border border-white/5 relative group hover:border-accent/30 transition-colors">
                <div className="text-accent font-bold text-3xl mb-6 opacity-30 group-hover:opacity-100 transition-opacity">03</div>
                <h4 className="text-xl font-bold mb-4 text-white tracking-tight">El futuro</h4>
                <p className="text-text-secondary leading-relaxed font-medium text-sm">
                  No somos solo una comercializadora; somos un aliado estratégico. Seguimos innovando en logística para que Juárez nunca deje de crecer.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* NUEVA SECCIÓN: ¿A QUIÉN LE SERVIMOS? */}
      <section id="servicios" className="py-32 relative overflow-hidden bg-[#09090b] contain-layout" style={{ contentVisibility: 'auto' } as any}>
        {/* Background Decorations - Orange Glows & Parallax Objects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden h-full w-full">
          <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-accent/10 blur-[150px] rounded-full opacity-50" />
          <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full opacity-40" />
          
          {/* Parallax Objects - Optimized: ONLY Block for a clean, professional technical look */}
          {!isLowPowerMode && (
            <>
              {/* Main Technical Element: Block */}
              <motion.div 
                style={{ y: y1, rotate: rotate1 }}
                animate={{ 
                  y: [0, -20, 0],
                  filter: [
                    "grayscale(1) brightness(0.4) contrast(1.2) blur(1px)",
                    "grayscale(1) brightness(0.5) contrast(1.3) blur(1px)",
                    "grayscale(1) brightness(0.4) contrast(1.2) blur(1px)"
                  ]
                }}
                transition={{ 
                  duration: 10, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute top-[25%] left-[-5%] w-[400px] md:w-[600px] opacity-[0.15] pointer-events-none shadow-2xl will-change-transform transition-all"
              >
                <img 
                  src="/block2.png" 
                  alt="" 
                  className="w-full h-auto"
                  style={{ imageRendering: 'auto' }}
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
              
              {/* Subtle light streak accentuates the industrial feel */}
              <div className="absolute top-[30%] left-[10%] w-[1px] h-[400px] bg-gradient-to-b from-transparent via-accent/20 to-transparent rotate-[25deg] blur-sm opacity-30" />
            </>
          )}
        </div>

      {/* REGISTRATION FORM SECTION (Replaces "A quién le servimos") */}
      <RegistrationForm />

      {/* INDUSTRIAL SECTION (PDF CONTENT) */}
      <IndustrialSection />
      </section>

      {/* FULLSCREEN MODALS */}
      <AnimatePresence mode="wait">
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-bg flex flex-col overflow-hidden will-change-opacity"
          >
            {/* Modal Header Fijo */}
            <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-bg border-b border-white/5 relative z-[210] md:backdrop-blur-3xl will-change-transform">
              <div className="flex items-center gap-4">
                <img 
                  src="/logo.png" 
                  alt="DICON" 
                  className="h-10 md:h-14 w-auto" 
                  loading="lazy"
                  decoding="async"
                />
                <span className="text-lg font-bold tracking-tight text-white border-l border-white/10 pl-4">
                  {`Catálogo — ${customerInfo.type === 'Ferretería' ? 'Ferreterías' : customerInfo.type === 'Constructora' ? 'Constructoras' : customerInfo.type === 'Industria' ? 'Industria MRO' : 'Público General'}`}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {activeModal !== 'maquila' && (
                  <button 
                    onClick={() => setIsCartOpen(!isCartOpen)}
                    className={`px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 ${isCartOpen ? 'bg-white text-black' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}`}
                  >
                    <ShoppingBag className="w-4 h-4" /> 
                    <span className="hidden sm:inline">{isCartOpen ? 'Cerrar Lista' : 'Ver Mi Lista'}</span>
                    {cart.length > 0 && <span className="ml-1 bg-accent text-white w-5 h-5 rounded-full text-[10px] flex items-center justify-center">{cart.length}</span>}
                  </button>
                )}
                <button 
                  onClick={() => { setActiveModal(null); setIsCartOpen(false); }}
                  className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all border border-white/10 group"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            </header>

            <div className="flex-1 flex flex-col overflow-hidden relative transform-gpu">
              {/* Category Quick Nav for better scrolling experience - STICKY */}
              <div className="bg-black/80 backdrop-blur-2xl border-b border-white/10 px-6 md:px-12 py-3 flex gap-6 overflow-x-auto no-scrollbar scroll-smooth z-[220] sticky top-0 transform-gpu">
                {activeModal === 'publico' && Object.keys(PUBLICO_PRODUCTS).map(cat => (
                  <button key={cat} onClick={() => document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-black uppercase tracking-[2px] text-white/30 hover:text-accent whitespace-nowrap py-1 transition-all active:scale-95">
                    {cat}
                  </button>
                ))}
                {activeModal === 'constructora' && Object.keys(CONSTRUCTORA_PRODUCTS).map(cat => (
                  <button key={cat} onClick={() => document.getElementById(cat)?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-black uppercase tracking-[2px] text-white/30 hover:text-accent whitespace-nowrap py-1 transition-all active:scale-95">
                    {cat}
                  </button>
                ))}
                {activeModal === 'maquila' && (
                  <button onClick={() => document.getElementById('suministro-mro')?.scrollIntoView({ behavior: 'smooth' })} className="text-[10px] font-black uppercase tracking-[2px] text-white/20 hover:text-accent whitespace-nowrap py-1 transition-all active:scale-95">
                    Suministro MRO
                  </button>
                )}
                {/* Back to top helper */}
                <button 
                  onClick={() => {
                    const scrollContainer = document.getElementById('modal-scroll-container');
                    if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="ml-auto text-[10px] font-black uppercase tracking-[2px] text-accent flex items-center gap-2 hover:opacity-70 transition-all border-l border-white/10 pl-6"
                >
                  Subir <ChevronDown className="w-3 h-3 rotate-180" />
                </button>
              </div>

              {/* Columna Izquierda: Catálogo */}
              <div id="modal-scroll-container" className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 scroll-smooth will-change-scroll transform-gpu">
                <style>{`
                  .custom-scrollbar::-webkit-scrollbar {
                    width: 20px;
                  }
                  .custom-scrollbar::-webkit-scrollbar-track {
                    background: #111;
                    border-left: 1px solid rgba(255, 255, 255, 0.05);
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: linear-gradient(180deg, #FF5722, #f4511e);
                    border-radius: 10px;
                    border: 5px solid #111;
                    box-shadow: 0 0 15px rgba(249, 115, 22, 0.4);
                  }
                  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #f4511e;
                  }
                  /* Firefox support */
                  .custom-scrollbar {
                    scrollbar-width: auto;
                    scrollbar-color: #FF5722 rgba(255, 255, 255, 0.03);
                  }
                `}</style>
                
                <div className="max-w-[1400px] mx-auto">
                  <div className="mb-16">
                     <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                       {customerInfo.type === 'Público General' ? 'Público General' : `Catálogo Profesional - ${customerInfo.type}`}
                     </h2>
                     <p className="text-white/40 text-lg font-medium">Selecciona los materiales para tu próximo proyecto.</p>
                  </div>

                  {/* SEARCH BAR */}
                  <div className="mb-12 sticky top-0 md:top-[-10px] z-50 py-4 bg-black/50 backdrop-blur-md rounded-2xl">
                    <div className="relative max-w-xl">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-accent" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar productos (ej. cemento, pvc, block...)"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-16 pr-6 text-white placeholder:text-white/20 focus:border-accent outline-none transition-all shadow-xl"
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => setSearchQuery("")}
                          className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-white/40" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* MODAL 1 — PÚBLICO GENERAL */}
                  {activeModal === 'publico' && (
                    <div className="space-y-32 pb-40">
                      {Object.entries(filteredPublicProducts).map(([category, products]) => (
                        <div key={category} id={category} style={{ contentVisibility: 'auto' } as any}>
                          <div className="flex items-center gap-6 mb-8">
                               <h3 className="text-2xl font-bold text-white tracking-tight">{category}</h3>
                               <div className="flex-1 h-px bg-white/5" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(products as any[]).map((product) => (
                              <ProductCard 
                                key={product.id} 
                                product={product} 
                                addToCart={addToCart} 
                                isLowPowerMode={isLowPowerMode}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      {/* No results state */}
                      {Object.keys(filteredPublicProducts).length === 0 && (
                        <div className="text-center py-20">
                          <Package className="w-16 h-16 text-white/5 mx-auto mb-6" />
                          <p className="text-white/40 font-bold uppercase tracking-widest text-sm">No encontramos productos con ese nombre</p>
                        </div>
                      )}

                      {/* Herramientas y Ferretería Card */}
                      <div className="mt-20">
                        <div className="flex items-center justify-between gap-6 mb-12">
                           <div className="flex-1 h-px bg-white/5" />
                           <h3 className="text-sm font-black text-accent tracking-[10px] uppercase">Calidad para ferreterías</h3>
                           <div className="flex-1 h-px bg-white/5" />
                        </div>
                        
                        {/* Logo Pattern Marquee */}
                        <div className="relative mb-20 overflow-hidden py-10 bg-white/[0.02] border-y border-white/[0.05]">
                           <div className="flex gap-20 animate-marquee-fast hover:[animation-play-state:paused]">
                              {[...Array(12)].map((_, i) => (
                                <img 
                                  key={i} 
                                  src="/logo4a.png" 
                                  alt="Brand Pattern" 
                                  className="h-12 w-auto grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                                />
                              ))}
                           </div>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                           <h3 className="text-2xl font-bold text-white tracking-tight">Ferretería & herramientas</h3>
                           <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {QUOTE_CARDS_PUBLIC.map((card, idx) => (
                            <QuoteCard key={idx} card={card} isLowPowerMode={isLowPowerMode} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* MODAL 2 — CONSTRUCTORAS & FERRETERIAS */}
                  {activeModal === 'constructora' && (
                    <div className="space-y-32 pb-40">
                      {Object.entries(filteredConstructoraProducts).map(([category, products]) => (
                        <div key={category} id={category} style={{ contentVisibility: 'auto' } as any}>
                          <div className="flex items-center gap-6 mb-8">
                               <h3 className="text-2xl font-bold text-white tracking-tight">{category}</h3>
                               <div className="flex-1 h-px bg-white/5" />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(products as any[]).map((product) => (
                              <ProductCard 
                                key={product.id} 
                                product={product} 
                                addToCart={addToCart} 
                                isLowPowerMode={isLowPowerMode}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                      {/* No results state */}
                      {Object.keys(filteredConstructoraProducts).length === 0 && (
                        <div className="text-center py-20">
                          <Package className="w-16 h-16 text-white/5 mx-auto mb-6" />
                          <p className="text-white/40 font-bold uppercase tracking-widest text-sm">No encontramos productos con ese nombre</p>
                        </div>
                      )}

                      {/* Constructor Quote Cards */}
                      <div className="mt-20">
                        <div className="flex items-center justify-between gap-6 mb-12">
                           <div className="flex-1 h-px bg-white/5" />
                           <h3 className="text-sm font-black text-accent tracking-[10px] uppercase">Calidad para ferreterías</h3>
                           <div className="flex-1 h-px bg-white/5" />
                        </div>
                        
                        {/* Logo Pattern Marquee */}
                        <div className="relative mb-20 overflow-hidden py-10 bg-white/[0.02] border-y border-white/[0.05]">
                           <div className="flex gap-20 animate-marquee-fast hover:[animation-play-state:paused]">
                              {[...Array(12)].map((_, i) => (
                                <img 
                                  key={i} 
                                  src="/logo4a.png" 
                                  alt="Brand Pattern" 
                                  className="h-12 w-auto grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500" 
                                />
                              ))}
                           </div>
                        </div>

                        <div className="flex items-center gap-6 mb-8">
                           <h3 className="text-2xl font-bold text-white tracking-tight">Suministro especializado</h3>
                           <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {QUOTE_CARDS_CONSTRUCTORA.map((card, idx) => (
                            <QuoteCard key={idx} card={card} isLowPowerMode={isLowPowerMode} />
                          ))}
                        </div>
                      </div>

                      {/* Integrated supply Section */}
                      <div id="suministro-mro">
                        <div className="flex items-center gap-6 mb-8">
                           <h3 className="text-2xl font-bold text-white tracking-tight">Dicon Industrial Supply (MRO)</h3>
                           <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {QUOTE_CARDS_MAQUILA.map((card, idx) => (
                            <QuoteCard key={idx} card={card} isLowPowerMode={isLowPowerMode} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GLOBAL CART DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[500] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[420px] h-full shadow-2xl"
            >
              <CartContent 
                cart={cart} 
                customerInfo={customerInfo} 
                setIsCartOpen={setIsCartOpen} 
                removeFromCart={removeFromCart} 
                updateQuantity={updateQuantity} 
                whatsappUrl={whatsappUrl} 
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING CART BUTTON */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCartOpen(true)}
          className="bg-accent text-white w-16 h-16 rounded-full shadow-[0_15px_30px_rgba(255,87,34,0.4)] flex items-center justify-center relative border border-white/20 group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <ShoppingBag className="w-7 h-7 relative z-10" />
          <div className="absolute top-0 right-0 bg-white text-accent min-w-[24px] h-6 px-1 rounded-full text-xs font-black flex items-center justify-center border-2 border-accent shadow-lg">
            {cart.length}
          </div>
        </motion.button>
      </div>

      {/* Contact & Location */}
      <section id="contacto" className="py-24 md:py-40 relative bg-bg border-t border-border">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="h-[500px] rounded-[40px] overflow-hidden border border-border relative group shadow-2xl"
            >
              <img 
                src="/dicon_building.png" 
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover grayscale transition-transform duration-1000 group-hover:scale-105"
                alt="DICON Juárez"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-accent/10 group-hover:bg-transparent transition-colors" />
              <div className="absolute inset-x-8 bottom-8 z-30">
                 <div className="glass-card p-8 border border-white/10 backdrop-blur-2xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-accent p-2 rounded-lg text-white shadow-lg"><MapPin className="w-5 h-5" /></div>
                      <h4 className="font-bold text-white tracking-tight">Centro de suministro</h4>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">Calle Nahoas 3139, Aztecas, Ciudad Juárez, MX</p>
                    <a 
                      href="https://maps.app.goo.gl/jPKDXjQPvvTWdYzf9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-lg shadow-accent/20"
                    >
                      Ver en Google Maps <ExternalLink className="w-4 h-4" />
                    </a>
                 </div>
              </div>
            </motion.div>

            <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
              <div className="flex-1">
                <motion.span 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                className="text-accent font-bold text-xs tracking-[6px] uppercase mb-8 block"
                >
                  CONTACTO LOGÍSTICO
                </motion.span>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-12 tracking-[-0.05em] leading-tight text-white">
                  Conecta con <br className="hidden sm:block"/> el <span className="text-accent">Suministro.</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 relative z-10">
                  <div className="glass-card p-6 border border-white/5 hover:border-accent transition-colors block group">
                    <div className="text-accent mb-4 group-hover:scale-110 transition-transform flex items-center gap-2">
                       <Mail className="w-5 h-5" />
                       <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Ventas Corporativas</p>
                    </div>
                    <p className="text-white font-black text-sm uppercase italic">ventas@diconjrz.com.mx</p>
                  </div>
                  <a 
                    href="https://wa.me/5216568079485"
                    target="_blank"
                    className="glass-card p-6 border border-white/5 hover:border-accent transition-colors block group"
                  >
                    <div className="text-accent mb-4 group-hover:scale-110 transition-transform flex items-center gap-2">
                       <MessageCircle className="w-5 h-5" />
                       <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">WhatsApp Directo</p>
                    </div>
                    <p className="text-white font-black text-xl uppercase italic">+52 656 807 9485</p>
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 relative z-10 font-bold">
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <p className="text-accent text-[10px] uppercase tracking-[3px] mb-2 italic">Giovanni Acosta</p>
                      <p className="text-white text-xs mb-1">ventas1@diconjrz.com.mx</p>
                      <p className="text-white/40 text-xs">Cel. 656 322 2670</p>
                   </div>
                   <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                      <p className="text-accent text-[10px] uppercase tracking-[3px] mb-2 italic">Verónica Acosta</p>
                      <p className="text-white text-xs mb-1">ventas2@diconjrz.com.mx</p>
                      <p className="text-white/40 text-xs">Cel. 656 422 2210</p>
                   </div>
                </div>

                <div className="flex gap-6">
                   <a href="https://www.facebook.com/diconjrz" target="_blank" className="bg-white/5 p-4 rounded-xl text-white hover:bg-accent transition-all"><Facebook /></a>
                </div>
              </div>
             </div>
           </div>
         </div>
       </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-40 bg-[#0a0a0c] relative overflow-hidden contain-paint">
        {/* Layered Technical Background for FAQ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[#09090b]" />
          {/* Main animated glow */}
          {!isLowPowerMode && (
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.08)_0%,transparent_70%)]"
            />
          )}
          {isLowPowerMode && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.05)_0%,transparent_70%)] opacity-50" />
          )}
          <div className="absolute top-0 left-0 w-full h-full opacity-[0.04] pointer-events-none" 
               style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-accent/10 blur-[180px] rounded-full opacity-30" />
          <div className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-white/5 blur-[140px] rounded-full opacity-15" />
        </div>
        
        <div className="section-container relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-black tracking-[-0.05em] text-white">Preguntas frecuentes</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {[
              { q: "¿Tienen entrega a domicilio?", a: "Sí, contamos con flotilla propia para entregas en todo Ciudad Juárez y alrededores." },
              { q: "¿Manejan precios de mayoreo?", a: "Absolutamente. Tenemos escalas de precios para ferreterías y constructoras según volumen." },
              { q: "¿Los materiales son certificados?", a: "Solo trabajamos con marcas líderes y materiales que cumplen con todas las normas de calidad." },
              { q: "¿Tienen tienda física?", a: "Contamos con nuestro centro de distribución donde puedes recoger materiales o ver muestras." }
            ].map((faq, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={itemVariants}
                className="glass-card border border-white/5 overflow-hidden"
              >
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-8 flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-6">
                    <span className="text-accent font-black text-2xl group-hover:scale-125 transition-transform">{idx + 1}</span>
                    <span className="text-lg md:text-2xl font-bold tracking-tight text-white">{faq.q}</span>
                  </div>
                  <ChevronDown className={`transition-transform duration-500 text-accent ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-8 pb-8"
                    >
                      <p className="text-gray-400 font-medium italic border-l-2 border-accent pl-6 py-2">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-bg py-24 border-t border-border">
        <div className="section-container text-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16 px-4">
            <div className="flex items-center gap-4">
              <img 
                src="/logo.png" 
                alt="DICON" 
                className="h-16 md:h-20 lg:h-24 w-auto" 
                loading="lazy"
              />
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {navLinks.map(link => (
                <a key={link.name} href={link.href} className="text-xs font-black uppercase tracking-[3px] text-white/50 hover:text-accent transition-colors">
                  {link.name}
                </a>
              ))}
            </div>

            <p className="text-accent font-bold text-2xl tracking-tight">+52 1 656 807 9485</p>
          </div>

          <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] text-gray-500 uppercase tracking-[6px] font-bold">
              © 2026 DICON — Todos los derechos reservados
            </p>
            <div className="flex gap-10">
               <span className="text-[10px] text-gray-500 uppercase tracking-[3px] font-bold cursor-pointer hover:text-accent">Dicon Juárez — Suministro industrial</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Marquee Animation Styles & Technical Cleanups */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.33%, 0, 0); }
        }
        .animate-marquee-slow {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee-fast {
          animation: marquee 30s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ff5722;
          border-radius: 10px;
        }
        section {
          content-visibility: auto;
          contain-intrinsic-size: 10px 1000px;
        }
        #inicio, nav, header {
          content-visibility: visible;
        }
        .force-gpu {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
