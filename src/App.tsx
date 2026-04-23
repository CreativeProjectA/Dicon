/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
  ExternalLink
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
  "3B"
];

const PUBLICO_PRODUCTS = {
  "Materiales de Construcción": [
    { id: 2, name: "Cemento Chihuahua", price: 210, unit: "bulto", img: "/cemento.png" },
    { id: 3, name: "Block de cemento", price: 12, unit: "pieza", img: "/block.png", variants: ["4 pulgadas", "6 pulgadas", "8 pulgadas"] },
    { id: 4, name: "Mortero Chuviscar", price: 95, unit: "bulto", img: "/mortero.png" },
    { id: 5, name: "Yeso Máximo", price: 85, unit: "bulto", img: "/yeso.png" },
    { id: 1, name: "Varilla de acero", price: 180, unit: "pieza", img: "/varilla.png", variants: ["3/8", "1/2", "5/8"] },
    { id: 6, name: "Castillo de construcción", price: null, unit: "cotización", img: "/castillo.png", variants: ["Hasta 2.5m", "Hasta 3m"] },
  ],
  "Plomería": [
    { id: 7, name: "Tubo PVC", price: 85, unit: "pieza", img: "/pvc.png", variants: ["1/2\"", "3/4\"", "1\""] },
    { id: 8, name: "Codo Negro 90", price: 18, unit: "pieza", img: "/codo_negro_1.png", variants: ["1/2\"", "3/4\""] },
    { id: 9, name: "Tee Negra", price: 22, unit: "pieza", img: "/tee_negra.png", variants: ["1/2\"", "3/4\""] },
    { id: 10, name: "Válvula Bola", price: 45, unit: "pieza", img: "/valbula.png", variants: ["1/2\"", "3/4\""] },
    { id: 11, name: "Tubo Negro Roscado", price: 120, unit: "pieza", img: "/tubo_negro_roscada.png", variants: ["1/2\"", "3/4\"", "1\""] },
  ],
  "Pintura y Adhesivos": [
    { id: 50, name: "Pintura Axel", price: 320, unit: "litro", img: "/axel.png", variants: ["Bronce", "Plata", "Oro"] },
    { id: 51, name: "Pintura Señalamiento", price: 280, unit: "cubeta", img: "/trafico.png", variants: ["Amarillo", "Blanco"] },
    { id: 52, name: "Adhesivo 3B Real", price: 280, unit: "cubeta", img: "/pega.png", variants: ["Piso", "Azulejo"] },
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

const GlowSpheres = () => {
  return (
    <>
      <div className="main-glow" />
      <div className="secondary-glow" />
    </>
  );
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
  }
};

const QuoteCard = memo(({ card, isLowPowerMode }: any) => {
  if (isLowPowerMode) {
    return (
      <div className="product-grid-item bg-white/[0.06] p-8 border border-white/[0.08] rounded-[24px] flex flex-col min-h-[300px] relative overflow-hidden transition-all shadow-sm">
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
          onClick={() => window.open(`https://wa.me/5216563222670?text=${encodeURIComponent(card.msg)}`, '_blank')}
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
      className="glass-card p-8 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] group flex flex-col min-h-[300px] relative overflow-hidden transition-all shadow-sm"
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
        onClick={() => window.open(`https://wa.me/5216563222670?text=${encodeURIComponent(card.msg)}`, '_blank')}
        className="w-full bg-accent text-white py-4 rounded-full font-bold text-sm tracking-wide hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-sm"
      >
        Cotizar por WhatsApp
        <MessageCircle className="w-4 h-4" />
      </button>
    </motion.div>
  );
});

const ProductCard = memo(({ product, addToCart, isLowPowerMode }: any) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants ? product.variants[0] : null);
  const [qty, setQty] = useState(1);

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

  // Optimización extrema: Bypass de Framer Motion en móvil para el catálogo
  // Optimización extrema: Bypass de Framer Motion en móvil para el catálogo
  if (isLowPowerMode) {
    return (
      <div className="product-grid-item bg-white/[0.06] p-6 border border-white/[0.08] rounded-[24px] flex flex-col h-full relative overflow-hidden transition-all shadow-sm">
        {product.constructorMode && product.price && (
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
            <div className="bg-orange-600 text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-sm tracking-widest uppercase">
              Módulo Constructor
            </div>
            {qty < 10 ? (
              <div className="bg-white/10 text-white/40 text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/5">
                10+ para activar mayoreo
              </div>
            ) : (
               <div className="bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-widest uppercase flex items-center gap-1">
                 <Sparkle className="w-2 h-2" /> Mayoreo activo (-15%)
               </div>
            )}
          </div>
        )}

        <div className="relative aspect-square mb-6 bg-white/[0.02] rounded-2xl flex items-center justify-center p-8 overflow-hidden will-change-transform">
          <img 
            src={product.img} 
            alt={product.name}
            className="w-full h-full object-contain" 
            loading="lazy"
            decoding="async"
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
                 <p className="text-xs text-white/40 mb-1 font-medium">Precio unitario</p>
                 <div className="flex items-center gap-2">
                   <span className="text-2xl font-bold text-accent">
                     {finalUnitPrice ? `$${Math.round(finalUnitPrice).toLocaleString()}` : 'Cotizar'}
                   </span>
                   {isMayoreoActive && (
                     <span className="text-xs text-white/20 line-through font-medium">${product.price}</span>
                   )}
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
              Añadir a la lista <ArrowRight className="w-4 h-4" />
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
      className="glass-card p-6 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] group flex flex-col h-full relative overflow-hidden transition-all shadow-sm"
    >
      {product.constructorMode && product.price && (
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-1">
          <div className="bg-orange-600 text-white text-[9px] font-bold px-3 py-1 rounded-full shadow-sm tracking-widest uppercase">
            Módulo Constructor
          </div>
          {qty < 10 ? (
            <div className="bg-white/10 backdrop-blur-md text-white/40 text-[7px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/5">
              10+ para activar mayoreo
            </div>
          ) : (
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               className="bg-green-500 text-white text-[8px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-widest uppercase flex items-center gap-1"
             >
               <Sparkle className="w-2 h-2" /> Mayoreo activo (-15%)
             </motion.div>
          )}
        </div>
      )}

      <div className="relative aspect-square mb-6 bg-white/[0.02] rounded-2xl flex items-center justify-center p-8 overflow-hidden will-change-transform">
        <img 
          src={product.img} 
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700" 
          loading="lazy"
          decoding="async"
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
               <p className="text-xs text-white/40 mb-1 font-medium">Precio unitario</p>
               <div className="flex items-center gap-2">
                 <span className="text-2xl font-bold text-accent">
                   {finalUnitPrice ? `$${Math.round(finalUnitPrice).toLocaleString()}` : 'Cotizar'}
                 </span>
                 {isMayoreoActive && (
                   <span className="text-xs text-white/20 line-through font-medium">${product.price}</span>
                 )}
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
            Añadir a la lista <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
});

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeModal, setActiveModal] = useState<null | 'publico' | 'constructora' | 'maquila'>(null);

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

  const scrollToSection = (ref: { current: HTMLElement | null }) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Cart logic - Precision fix
  const getPrice = useCallback((item: any) => {
    if (!item.price) return null;
    
    // Regla DICON: El mayoreo (15% dto al llegar a 10 piezas)
    if (item.constructorMode && item.quantity >= 10) {
      return item.price * 0.85; // Don't round yet for precision
    }
    
    return item.price;
  }, []);

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

  const totalCart = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price = getPrice(item);
      return sum + ((price || 0) * item.quantity);
    }, 0);
  }, [cart, getPrice]);

  const generateWhatsAppMessage = useCallback(() => {
    const header = "Hola DICON, aquí está mi lista:\n\n";
    const items = cart.map(item => {
      const price = getPrice(item);
      const isMayoreo = !item.constructorMode && item.quantity >= 10;
      const sub = price ? (price * item.quantity).toLocaleString() : "A Cotizar";
      const priceStr = price ? `$${price.toLocaleString()}/${item.unit || 'unidad'}` : "Cotizar";
      const tag = isMayoreo ? " — (MAYOREO)" : "";
      
      return `- ${item.quantity}x ${item.name}${item.selectedVariant ? ` (${item.selectedVariant})` : ""} — ${priceStr}${tag} — $${sub}`;
    }).join("\n");
    
    const subtotalStr = `Subtotal: $${totalCart.toLocaleString()}`;
    const ivaStr = `IVA (16%): $${(totalCart * 0.16).toLocaleString()}`;
    const totalStr = `TOTAL: $${(totalCart * 1.16).toLocaleString()}`;
    
    const footer = "\n\nQuedo a la espera de su cotización.";
    
    return encodeURIComponent(header + items + "\n\n" + subtotalStr + "\n" + ivaStr + "\n" + totalStr + footer);
  }, [cart, getPrice, totalCart]);

  const whatsappUrl = `https://wa.me/5216563222670?text=${generateWhatsAppMessage()}`;

  const CartContent = memo(() => {
    const regularTotal = useMemo(() => {
      return cart.reduce((sum, item) => {
        return sum + ((item.price || 0) * item.quantity);
      }, 0);
    }, [cart]);

    const discountedTotal = useMemo(() => {
      return cart.reduce((sum, item) => {
        const price = getPrice(item);
        // Precision subtotal for the item
        return sum + ((price || 0) * item.quantity);
      }, 0);
    }, [cart]);

    const totalSavings = useMemo(() => {
      // Direct savings calculation to ensure it matches what user sees
      return cart.reduce((sum, item) => {
        if (item.constructorMode && item.quantity >= 10 && item.price) {
          const regularItemTotal = item.price * item.quantity;
          const discountedItemTotal = (item.price * 0.85) * item.quantity;
          return sum + (regularItemTotal - discountedItemTotal);
        }
        return sum;
      }, 0);
    }, [cart]);

    const subtotalConAhorro = discountedTotal;
    const iva = subtotalConAhorro * 0.16;
    const finalTotal = Math.round(subtotalConAhorro + iva);

    return (
      <div className="flex flex-col h-full bg-[#000] text-white">
        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-black/50 backdrop-blur-xl sticky top-0 z-30">
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

        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black">
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
              {cart.map((item) => {
                const basePrice = item.price;
                const finalPrice = getPrice(item);
                const isMayoreo = item.constructorMode && item.quantity >= 10 && item.price;
                
                return (
                  <motion.div 
                    key={item.cartItemId} 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/[0.03] p-5 rounded-[24px] border border-white/[0.06] relative group overflow-hidden hover:bg-white/[0.05] transition-colors will-change-transform"
                  >
                    <div className="flex gap-5">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/[0.03] p-3 flex-shrink-0 flex items-center justify-center">
                        <img src={item.img} className="w-full h-full object-contain" loading="lazy" />
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
                            <span className={`text-[13px] font-bold ${item.constructorMode ? 'text-orange-400' : 'text-white/80'}`}>
                              {isMayoreo && <span className="line-through mr-1.5 opacity-20 font-normal italic">${basePrice?.toLocaleString()}</span>}
                              <span className={isMayoreo ? "text-green-400" : ""}>${finalPrice?.toLocaleString()}</span>
                              <span className="text-[10px] ml-1 opacity-40 font-medium">c/u</span>
                            </span>
                          </div>
                        </div>

                        {item.constructorMode && item.price && (
                          <div className="mt-4">
                            {isMayoreo ? (
                              <div className="flex items-center gap-1.5 text-green-400 text-[9px] font-black bg-green-500/10 w-fit px-2.5 py-1 rounded-full border border-green-500/10 uppercase tracking-widest">
                                <Sparkle className="w-2.5 h-2.5" /> Mayoreo Activo
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <div className="flex justify-between text-[8px] font-black text-white/20 uppercase tracking-[0.15em]">
                                  <span>Piezas para mayoreo</span>
                                  <span>{item.quantity}/10</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    className="h-full bg-orange-500/50" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (item.quantity / 10) * 100)}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/[0.04]">
                      <div className="flex items-center bg-white/[0.03] rounded-full p-1 border border-white/[0.05]">
                        <button onClick={() => updateQuantity(item.cartItemId, -1)} className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors"><Minus className="w-3 h-3"/></button>
                        <span className="w-8 text-center text-xs font-black tracking-tighter">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartItemId, 1)} className="w-8 h-8 flex items-center justify-center hover:text-accent transition-colors"><Plus className="w-3 h-3"/></button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest leading-none mb-1">Subtotal Item</p>
                        <p className={`text-lg font-black tracking-tighter ${isMayoreo ? 'text-green-400' : 'text-white'}`}>
                          {finalPrice ? `$${Math.round(finalPrice * item.quantity).toLocaleString()}` : 'A cotizar'}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-8 border-t border-white/10 bg-[#050505] shadow-[0_-20px_40px_rgba(0,0,0,0.4)] relative z-30">
          <div className="space-y-5 mb-10 text-[13px]">
            {totalSavings > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex justify-between text-green-400 font-bold bg-green-500/[0.03] p-4 rounded-2xl border border-green-500/10"
              >
                <div className="flex items-center gap-2">
                  <Sparkle className="w-4 h-4" />
                  <span>Ahorro aplicado:</span>
                </div>
                <span>-${totalSavings.toLocaleString()}</span>
              </motion.div>
            )}
            
            <div className="space-y-3 px-1">
              <div className="flex justify-between text-white/30 font-bold uppercase tracking-widest text-[10px]">
                <span>Precio Comercial (Sin Descuento)</span>
                <span className="text-white/40 line-through">${Math.round(regularTotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/30 font-bold uppercase tracking-widest text-[10px]">
                <span>Subtotal Neto</span>
                <span className="text-white/60">${Math.round(discountedTotal).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/30 font-bold uppercase tracking-widest text-[10px]">
                <span>IVA Trasladado (16%)</span>
                <span className="text-white/60">${Math.round(iva).toLocaleString()}</span>
              </div>
              <div className="pt-6 mt-4 border-t border-white/5 flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] text-accent font-black uppercase tracking-[0.3em] mb-1">Total a Pagar</span>
                  <span className="text-white font-black text-3xl tracking-[-0.05em] leading-none">
                    ${finalTotal.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                   <p className="text-[9px] text-white/20 font-bold leading-tight">Moneda Nacional MXN<br/>Precios sujetos a cambio</p>
                </div>
              </div>
            </div>
          </div>
          
          <motion.a 
            href={whatsappUrl}
            target="_blank"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-accent text-white py-5 rounded-2xl font-black text-sm tracking-[0.1em] uppercase hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(255,87,34,0.3)] group"
          >
            Enviar Cotización <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
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
    { name: 'Servicios', href: '#servicios' },
    { name: 'Historia', href: '#historia' },
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
    <div className="min-h-screen bg-transparent text-text-primary overflow-x-hidden selection:bg-accent/30">
      {/* Background - Replaces the mesh with solid deep black */}
      <div className="fixed inset-0 z-0 bg-[#080808] pointer-events-none translate-z-0" />

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
              className="h-10 w-auto"
              loading="lazy"
              decoding="async"
            />
            <div className="text-2xl font-black tracking-[-0.05em] text-white">
              Dicon
            </div>
          </motion.div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-white text-white/50"
              >
                {link.name}
              </a>
            ))}
            <a 
              href="https://wa.me/5216568079485" 
              target="_blank" 
              className="bg-accent text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-orange-600 transition-all"
            >
              Contactar
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
              <div className="flex flex-col gap-8">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.1 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-4xl font-black text-white tracking-tighter hover:text-accent transition-colors"
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
                  className="mt-4 bg-accent text-white py-5 rounded-2xl font-black text-center text-sm tracking-widest uppercase shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
                >
                  Contactar por WhatsApp
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
      <section id="inicio" className="hero-section relative min-h-[90vh] flex flex-col justify-center pt-32 pb-20 overflow-hidden bg-bg contain-paint">
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
                <a href="#catalogo" className="w-full sm:w-auto bg-accent text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-3 group">
                  Ver Catálogo <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </a>
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
              { label: "1.5", sub: "Años de experiencia", icon: <ShieldCheck /> },
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
        <div className="relative z-10">
          <div className="flex animate-marquee-fast md:animate-marquee-slow whitespace-nowrap gap-20 items-center will-change-transform translate-x-0 force-gpu">
            {[...BRANDS, ...BRANDS, ...BRANDS].map((brand, i) => (
              <span 
                key={i} 
                className="text-2xl md:text-5xl font-black text-accent/20 hover:text-accent transition-all duration-500 cursor-default select-none tracking-tighter uppercase"
              >
                {brand}
              </span>
            ))}
          </div>
          {/* Fades */}
          <div className="absolute inset-y-0 left-0 w-24 md:w-40 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 md:w-40 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />
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
                  <h3 className="text-2xl font-bold tracking-tight">Mi Lista</h3>
                  <p className="text-white/50 text-sm font-medium">{cart.length} materiales seleccionados</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <Box className="w-20 h-20 mb-6" />
                    <p className="text-xl font-bold tracking-tight">Tu lista está vacía</p>
                    <p className="text-sm mt-2">Agrega productos desde el catálogo para cotizar.</p>
                  </div>
                ) : (
                  <>
                    {cart.map((item) => {
                      const finalPrice = getPrice(item);
                      return (
                        <motion.div 
                          key={item.cartItemId} 
                          layout
                          className="flex gap-4 items-center bg-bg/40 p-5 rounded-2xl border border-border/50 group relative"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                            <img 
                              src={item.img} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                              loading="lazy"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="font-bold text-sm uppercase tracking-tight leading-none mb-1 truncate pr-2">{item.name}</p>
                              <button 
                                onClick={() => removeFromCart(item.cartItemId)}
                                className="p-1 text-text-secondary/50 hover:text-red-500 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-white font-bold text-xs ${item.constructorMode ? 'text-orange-400' : ''}`}>
                                ${finalPrice} c/u {item.constructorMode && <span className="text-[8px] ml-1 opacity-60 italic">CONSTRUCTORA (MAYOREO)</span>}
                              </span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center bg-white/5 border border-white/10 rounded-lg p-1">
                                <button 
                                  onClick={() => updateQuantity(item.cartItemId, -1)}
                                  className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-accent transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <motion.span 
                                  key={item.quantity}
                                  initial={{ y: -5, opacity: 0 }}
                                  animate={{ y: 0, opacity: 1 }}
                                  className="w-6 text-center text-xs font-black"
                                >
                                  {item.quantity}
                                </motion.span>
                                <button 
                                  onClick={() => updateQuantity(item.cartItemId, 1)}
                                  className="w-6 h-6 flex items-center justify-center text-text-secondary hover:text-accent transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              <p className="text-xs font-black text-accent">
                                {finalPrice ? `$${((finalPrice || 0) * item.quantity).toLocaleString()}` : 'A Cotizar'}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </>
                )}
              </div>

              <div className="p-8 border-t border-border bg-bg/50">
                {cart.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs text-text-secondary font-bold uppercase tracking-widest"><span>Subtotal (Sin IVA):</span><span>${totalCart.toLocaleString()}</span></div>
                    <div className="flex justify-between text-xs text-text-secondary font-bold uppercase tracking-widest"><span>IVA (16%):</span><span>${(totalCart * 0.16).toLocaleString()}</span></div>
                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/5">
                       <span className="text-white font-black uppercase tracking-widest text-sm">Total:</span>
                       <span className="text-[#FF5722] text-3xl font-black italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,87,34,0.3)]">${(totalCart * 1.16).toLocaleString()}</span>
                    </div>
                    <a 
                      href={whatsappUrl}
                      target="_blank"
                      className="bg-[#FF5722] text-white w-full py-6 rounded-2xl font-black text-lg shadow-[0_20px_40px_rgba(255,87,34,0.3)] hover:bg-orange-600 transition-all flex items-center justify-center gap-3"
                    >
                      PEDIR POR WHATSAPP <ArrowRight className="w-6 h-6" />
                    </a>
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
                  className="w-[300px] md:w-[500px] grayscale brightness-90 drop-shadow-[0_20px_60px_rgba(255,87,34,0.2)]"
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
      <section id="servicios" className="py-32 relative overflow-hidden bg-[#09090b] contain-layout">
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

        <div className="section-container relative z-10">
          <div className="text-center mb-20">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-white/40 font-bold text-xs tracking-[6px] uppercase mb-4 block"
            >
              Soluciones Especializadas
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-white"
            >
              ¿A quién le servimos?
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1400px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -15 }}
              onClick={() => setActiveModal('publico')}
              className="glass-card p-12 border border-white/10 group cursor-pointer hover:border-accent shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-24 h-24 rounded-[32px] bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(242,113,33,0.2)]">
                <Palette className="w-12 h-12" />
              </div>
              <span className="text-[10px] text-accent font-black tracking-[4px] uppercase mb-4 italic">Individual y Menudeo</span>
              <h3 className="text-4xl font-black mb-6 tracking-[-0.05em] leading-tight">Público general</h3>
              <p className="text-base text-white/50 leading-relaxed mb-10 font-normal max-w-[280px]">
                Suministro directo para tu hogar o pequeñas reparaciones con calidad industrial certificada.
              </p>
              <motion.div className="flex items-center gap-3 text-accent font-black text-xs uppercase tracking-[2px] group-hover:translate-x-2 transition-transform">
                Ver Catálogo <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -15 }}
              transition={{ delay: 0.1 }}
              onClick={() => setActiveModal('constructora')}
              className="glass-card p-12 border border-white/10 group cursor-pointer hover:border-accent shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-24 h-24 rounded-[32px] bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(242,113,33,0.2)]">
                <Construction className="w-12 h-12" />
              </div>
              <span className="text-[10px] text-accent font-black tracking-[4px] uppercase mb-4 italic">Mayoreo y Logística</span>
              <h3 className="text-4xl font-black mb-6 tracking-[-0.05em] leading-none">Constructoras <br /> & ferreterías</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-10 font-medium max-w-[280px]">
                Descuentos por volumen superiores al 15% y logística estratégica para Juárez.
              </p>
              <motion.div className="flex items-center gap-3 text-accent font-black text-xs uppercase tracking-[2px] group-hover:translate-x-2 transition-transform">
                Acceso Mayoreo <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -15 }}
              transition={{ delay: 0.2 }}
              onClick={() => setActiveModal('maquila')}
              className="glass-card p-12 border border-white/10 group cursor-pointer hover:border-accent shadow-2xl flex flex-col items-center justify-center text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-24 h-24 rounded-[32px] bg-accent/10 flex items-center justify-center text-accent mb-8 group-hover:scale-110 transition-transform shadow-[0_0_40px_rgba(242,113,33,0.2)]">
                <Zap className="w-12 h-12" />
              </div>
              <span className="text-[10px] text-accent font-black tracking-[4px] uppercase mb-4 italic">MRO e Industrial</span>
              <h3 className="text-4xl font-black mb-6 tracking-[-0.05em] leading-none">Industria <br /> maquiladora</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-10 font-medium max-w-[280px]">
                Mantenimiento, Reparación y Operaciones para manufactura avanzada con respuesta 24/7.
              </p>
              <div className="flex items-center gap-3 text-accent font-black text-xs uppercase tracking-[2px] group-hover:translate-x-2 transition-transform">
                Área Industrial <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FULLSCREEN MODALS */}
      <AnimatePresence>
        {activeModal && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-[200] bg-bg flex flex-col overflow-hidden"
          >
            {/* Modal Header Fijo */}
            <header className="flex items-center justify-between px-6 md:px-12 py-6 bg-bg border-b border-white/5 relative z-[210] md:backdrop-blur-3xl">
              <div className="flex items-center gap-4">
                <img 
                  src="/logo.png" 
                  alt="DICON" 
                  className="h-8 w-auto" 
                  loading="lazy"
                  decoding="async"
                />
                <span className="text-lg font-bold tracking-tight text-white border-l border-white/10 pl-4">
                  {`Catálogo — ${activeModal === 'publico' ? 'Público General' : activeModal === 'constructora' ? 'Constructoras' : 'Industria Maquiladora'}`}
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

            <div className="flex-1 flex flex-col overflow-hidden relative">
              {/* Columna Izquierda: Catálogo */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 transition-all duration-500">
                <div className="max-w-[1400px] mx-auto">
                  <div className="mb-16">
                     <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
                       {activeModal === 'publico' ? 'Público general' : activeModal === 'constructora' ? 'Constructoras' : 'Suministro industria'}
                     </h2>
                     <p className="text-white/40 text-lg font-medium">Selecciona los materiales para tu próximo proyecto.</p>
                  </div>

                  {/* MODAL 1 — PÚBLICO GENERAL */}
                  {activeModal === 'publico' && (
                    <div className="space-y-32 pb-40">
                      {Object.entries(PUBLICO_PRODUCTS).map(([category, products]) => (
                        <div key={category}>
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

                      {/* Herramientas y Ferretería Card */}
                      <div>
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

                  {/* MODAL 2 — CONSTRUCTORAS */}
                  {activeModal === 'constructora' && (
                    <div className="space-y-32 pb-40">
                      {Object.entries(CONSTRUCTORA_PRODUCTS).map(([category, products]) => (
                        <div key={category}>
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

                      {/* Constructor Quote Cards */}
                      <div>
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
                    </div>
                  )}

                  {/* MODAL 3 — INDUSTRIA MAQUILADORA */}
                  {activeModal === 'maquila' && (
                    <div className="space-y-32 pb-40">
                       <h3 className="text-2xl font-bold text-white tracking-tight mb-8">Suministro industrial MRO</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {QUOTE_CARDS_MAQUILA.map((card, idx) => (
                            <QuoteCard key={idx} card={card} isLowPowerMode={isLowPowerMode} />
                          ))}
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
              <CartContent />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FLOATING CART BUTTON */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12 relative z-10">
                  <div className="glass-card p-8 border border-white/5 hover:border-accent transition-colors">
                    <div className="text-accent mb-4"><Phone className="w-6 h-6" /></div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Ventas</p>
                    <p className="text-white font-black text-xl uppercase italic">656 634 8189</p>
                  </div>
                  <div className="glass-card p-8 border border-white/5 hover:border-accent transition-colors">
                    <div className="text-accent mb-4"><MessageCircle className="w-6 h-6" /></div>
                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">WhatsApp</p>
                    <p className="text-white font-black text-xl uppercase italic">+52 1 656 807 9485</p>
                  </div>
                </div>

                <div className="flex gap-6">
                   <a href="https://www.facebook.com/diconjrz" target="_blank" className="bg-white/5 p-4 rounded-xl text-white hover:bg-accent transition-all"><Facebook /></a>
                </div>
              </div>

              {/* THE TRUCK - Now properly positioned in layout */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{ 
                  delay: 0.3, 
                  duration: 1, 
                  type: "spring",
                  y: { 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }
                }}
                className="w-full max-w-[400px] lg:w-[400px] z-20 pointer-events-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                <img 
                  src="/camion.png" 
                  alt="Dicon Truck" 
                  className="w-full h-auto grayscale brightness-75 contrast-110"
                  style={{ filter: 'grayscale(1) brightness(0.75)' }}
                  loading="lazy"
                  decoding="async"
                />
              </motion.div>
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
                className="h-10 w-auto" 
                loading="lazy"
              />
              <span className="text-3xl font-black tracking-[-0.05em] text-white">Dicon <span className="text-accent">Juárez</span></span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {navLinks.map(link => (
                <a key={link.name} href={link.href} className="text-xs font-black uppercase tracking-[3px] text-white/50 hover:text-accent transition-colors">
                  {link.name}
                </a>
              ))}
            </div>

            <p className="text-accent font-bold text-2xl tracking-tight">656 634 8189</p>
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

      {/* Floating Cart Button (Mobile) */}
      <AnimatePresence>
        {cart.length > 0 && !isCartOpen && !activeModal && (
          <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsCartOpen(true)}
            className="md:hidden fixed bottom-6 right-6 z-[60] h-16 px-6 bg-accent rounded-full flex items-center justify-center text-white shadow-[0_20px_50px_rgba(249,115,22,0.4)] border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart className="w-7 h-7" />
                <span className="absolute -top-3 -right-3 bg-white text-accent w-6 h-6 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-accent">
                  {cart.length}
                </span>
              </div>
              <span className="font-bold text-sm tracking-tight">Ver mi lista</span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Marquee Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.33%, 0, 0); }
        }
        .animate-marquee-slow {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee-fast {
          animation: marquee 40s linear infinite;
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
