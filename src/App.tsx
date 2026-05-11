import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ChefHat, Clock, MapPin, Phone, Instagram, Facebook, Utensils, Star, Quote, Mail } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

// --- Constants ---
const RESTAURANT_INFO = {
  name: "Tasva - The Fine Dine",
  tagline: "Tradition Reimagined. Heritage Reclaimed.",
  address: "KN Road, Tadepalligudem – 534101",
  phone: "+91 88188 88188",
  email: "tasvathefinedine@gmail.com",
  hours: "11:30 AM - 10:30 PM",
  description: "The premier fine-dining destination in the Godavari heartland, where ancestral Telugu recipes meet contemporary culinary artistry.",
  location: { lat: 16.8219, lng: 81.5305 }
};

const MENU_CATEGORIES = [
  { id: 'starters', title: 'Starters' },
  { id: 'mains', title: 'Main Course' },
  { id: 'biryanis', title: 'Biryanis' },
  { id: 'desserts', title: 'Desserts' },
];

const MENU_ITEMS = {
  starters: [
    { name: "Godavari Paneer Kanti", price: "349", desc: "Velvety cottage cheese medallions kissed by the hearth and local heirloom spices" },
    { name: "Kodi Miriyala Roast", price: "429", desc: "Tender chicken tossed in a robust black pepper and curry leaf reduction" },
    { name: "Mokkajonna Vepudu", price: "299", desc: "Crispy sweet corn tempered with green chilies and fresh coriander" },
    { name: "Gongura Royyala Vepudu", price: "489", desc: "Zesty prawns sautéed with slow-cooked sorrel leaf paste" }
  ],
  mains: [
    { name: "Godavari Rajulu Bojanam", price: "549", desc: "A royal assembly of seasonal curries, served with traditional heritage rice" },
    { name: "Korameenu Pulusu", price: "589", desc: "Murrel fish slow-simmered in a tangy tamarind and spice infusion" },
    { name: "Mamsam Iguru", price: "529", desc: "Slow-braised country lamb in a thick, aromatically charged gravy" },
    { name: "Beerakaya Paalu-Posina Kura", price: "329", desc: "Ridge gourd cooked in a delicate milk-based heritage sauce" }
  ],
  biryanis: [
    { name: "Nizam-e-Tasva Biryani", price: "529", desc: "Fragrant Basmati and succulent meat, steam-sealed in ancient clay pots" },
    { name: "Ulavacharu Pottel Biryani", price: "549", desc: "Our signature blend of slow-reduced horse gram and spice-crusted lamb" },
    { name: "Konaseema Veg Pulao", price: "429", desc: "Garden-fresh produce layered with spice-infused long grain rice" }
  ],
  desserts: [
    { name: "Mamidi Tandra Phirni", price: "249", desc: "A fusion of mango jelly and silk-smooth rice pudding" },
    { name: "Kakinada Gaja with Rabri", price: "229", desc: "Traditional regional sweet served with a modern creamy glaze" },
    { name: "Elachi Annam Payasam", price: "279", desc: "Heirloom rice slow-simmered in cardamom-infused milk and jaggery" }
  ]
};

const IMAGES = {
  hero: "/src/IMG_6388-HDR_1.jpg", 
  about: "/src/IMG_6303-HDR_1.jpg",
  food1: "/src/IMG_6318-HDR_1.jpg",
  food2: "/src/IMG_6303-HDR_1.jpg",
  interior: "/src/IMG_6388-HDR_1.jpg", 
  gallery: [
    "/src/IMG_6303-HDR_1.jpg",
    "/src/IMG_6318-HDR_1.jpg",
    "/src/IMG_6388-HDR_1.jpg"
  ]
};

// --- Components ---
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-maroon/90 backdrop-blur-xl py-6 border-b border-gold/10' : 'bg-transparent py-10'}`}>
      <div className="max-w-7xl mx-auto px-8 md:px-12 flex justify-between items-center">
        <a href="/" className="flex items-center gap-3 group">
          {/* Logo Container */}
          <div className="h-10 md:h-12 flex items-center">
            {/* Logic: If you upload logo.png to /src, this will work. Otherwise it fails gracefully to text */}
            <img 
              src="/src/logo.png" 
              alt="Tasva Logo" 
              className="h-full w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-2xl font-light tracking-[0.4em] uppercase text-cream">
              Tasva <span className="text-gold font-medium">.</span>
            </div>
          </div>
        </a>
        <div className="hidden md:flex gap-12 text-[10px] uppercase tracking-[0.3em] text-cream/60">
          {['Menu', 'About', 'Gallery', 'Contact'].map((item) => (
             <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-gold transition-all relative group py-2">
               {item}
               <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all group-hover:w-full"></span>
             </a>
          ))}
        </div>
        <a href="#contact" className="px-8 py-3 bg-gold/10 border border-gold/30 text-gold text-[10px] uppercase tracking-widest hover:bg-gold hover:text-maroon transition-all duration-500 rounded-sm">
          Reserve
        </a>
      </div>
    </nav>
  );
};

const SectionHeading = ({ title, subtitle, centered = true }: { title: string; subtitle?: string; centered?: boolean }) => (
  <div className={`mb-24 ${centered ? 'text-center' : ''}`}>
    <motion.div
      initial={{ opacity: 0, letterSpacing: '0.2em' }}
      whileInView={{ opacity: 1, letterSpacing: '0.6em' }}
      transition={{ duration: 1 }}
      className="text-gold font-sans text-[10px] font-medium uppercase mb-6 block"
    >
      {subtitle}
    </motion.div>
    <motion.h2 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="font-serif text-5xl md:text-8xl text-cream italic font-extralight tracking-tight"
    >
      {title}
    </motion.h2>
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 80 }}
      transition={{ duration: 1, delay: 0.5 }}
      className={`h-[1px] bg-gold/30 mt-10 ${centered ? 'mx-auto' : ''}`} 
    />
  </div>
);

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 800], [1, 1.1]);

  return (
    <div id="hero" className="relative h-screen overflow-hidden flex items-center bg-black">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div style={{ scale }} className="w-full h-full">
          <iframe 
            src="https://player.vimeo.com/video/1191169232?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&controls=0&transparent=1&speed=0.75"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto scale-[1.05] aspect-video object-cover"
            frameBorder="0" 
            allow="autoplay; fullscreen; picture-in-picture" 
            allowFullScreen
          />
        </motion.div>
        
        {/* Layered Overlays for Depth */}
        <div className="absolute inset-0 bg-maroon/40 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon via-maroon/20 to-maroon/30 opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-maroon/40 via-transparent to-maroon/40" />
        
        {/* Aesthetic Textures */}
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstripe-light.png')]" />
      </div>

      <motion.div style={{ y, opacity }} className="max-w-7xl mx-auto px-8 md:px-12 relative z-20 w-full text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <span className="text-gold font-sans text-[10px] sm:text-xs font-medium uppercase tracking-[0.8em] mb-12 block">
            An Unrivalled Culinary Legacy
          </span>
          
          <h1 className="font-serif text-6xl md:text-9xl lg:text-[11rem] text-cream mb-12 tracking-tighter leading-[0.85] italic font-thin drop-shadow-2xl">
            A Heritage <br/>
            of <span className="text-gold italic font-extralight tracking-tight">Flavor.</span>
          </h1>

          <div className="flex flex-col items-center gap-10">
            <p className="text-lg md:text-2xl text-cream/80 max-w-2xl font-serif italic font-extralight leading-relaxed tracking-tight">
              Traditional Telugu soul, modern elegance. Discover the golden ratio of spice and culture at Godavari's first premium fine-dining atelier.
            </p>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="flex flex-col md:flex-row items-center gap-12 mt-10"
            >
              <a href="#menu" className="px-16 py-5 bg-gold text-maroon text-[11px] uppercase tracking-[0.5em] font-medium hover:bg-cream hover:tracking-[0.6em] transition-all duration-700">
                Explore the Menu
              </a>
              <a href="#contact" className="group flex items-center gap-4 text-[10px] uppercase tracking-[0.4em] text-cream/60 hover:text-gold transition-all">
                <span className="w-12 h-[1px] bg-gold/30 group-hover:w-20 transition-all duration-700"></span>
                Secure Availability
              </a>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Decorative Accents */}
      <div className="absolute left-12 bottom-12 z-20 hidden md:block">
        <div className="flex flex-col gap-4">
          <div className="text-gold/20 text-[8px] uppercase tracking-[0.5em] font-medium rotate-90 origin-left mb-12">Latitude 16.82</div>
          <div className="w-[1px] h-24 bg-gradient-to-t from-gold/30 to-transparent" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 z-20"
      >
        <span className="text-[9px] uppercase tracking-[0.8em] text-gold/40 font-medium">Begin Journey</span>
        <div className="w-[1px] h-16 bg-gradient-to-b from-gold/40 via-gold/10 to-transparent animate-pulse" />
      </motion.div>
    </div>
  );
};

const About = () => (
  <section id="about" className="py-48 px-8 md:px-12 bg-maroon relative overflow-hidden">
    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-32 items-center">
      <div className="relative">
        <motion.div 
           initial={{ opacity: 0, scale: 1.02 }}
           whileInView={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5 }}
           className="relative z-10 overflow-hidden ring-1 ring-gold/10 group"
        >
          <div className="relative w-full aspect-video bg-black overflow-hidden">
            <iframe 
              src="https://player.vimeo.com/video/1191169232?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&controls=0&transparent=1"
              className="absolute inset-[0%] w-full h-full pointer-events-none scale-[1.01] group-hover:scale-110 transition-transform duration-[4s] ease-out"
              frameBorder="0" 
              allow="autoplay; fullscreen; picture-in-picture" 
              allowFullScreen
              title="TASVA - THE FINE DINE"
            />
            
            <img 
              src={IMAGES.about} 
              className="fallback-image absolute inset-0 w-full h-full object-cover brightness-50 -z-10 group-hover:scale-110 transition-transform duration-[4s]" 
              alt="Restaurant Interior" 
            />

            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-t from-maroon/80 via-transparent to-maroon/40 opacity-60" />
              <div className="absolute inset-0 bg-gradient-to-r from-maroon/20 via-transparent to-maroon/20 opacity-30" />
              <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
              
              <div className="absolute inset-8 border border-gold/10 opacity-30 group-hover:opacity-60 transition-opacity duration-1000" />
              <div className="absolute top-4 left-4 w-2 h-2 border-t-2 border-l-2 border-gold/40 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute top-4 right-4 w-2 h-2 border-t-2 border-r-2 border-gold/40 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-4 left-4 w-2 h-2 border-b-2 border-l-2 border-gold/40 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-4 right-4 w-2 h-2 border-b-2 border-r-2 border-gold/40 group-hover:scale-150 transition-transform duration-700" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-px h-0 bg-gold/40 group-hover:h-32 transition-all duration-1000" />
                <div className="absolute flex flex-col items-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0">
                  <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center backdrop-blur-md bg-maroon/20">
                    <Star className="text-gold h-5 w-5 stroke-[1.5] animate-pulse" />
                  </div>
                  <span className="text-[8px] uppercase tracking-[0.8em] text-gold/60 font-medium">Est. 2024</span>
                </div>
                <div className="w-px h-0 bg-gold/40 group-hover:h-32 transition-all duration-1000 mt-auto" />
              </div>
            </div>
          </div>
        </motion.div>
        <div className="absolute top-1/2 -left-10 -translate-y-1/2 w-[1px] h-80 bg-gold/20" />
      </div>
      
      <div className="xl:pl-12">
        <SectionHeading title="A Heritage of Flavor. Reclaimed." subtitle="Our Ethos" centered={false} />
        <motion.p 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-2xl text-cream/80 leading-relaxed mb-10 font-serif italic font-extralight tracking-tight"
        >
          "At Tasva, we believe culture is best preserved through the senses. Our kitchen is where ancestral Telugu soul meets the precision of modern elegance."
        </motion.p>
        <motion.p 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-cream/40 leading-relaxed mb-16 font-light text-lg"
        >
          Born in the heart of Tadepalligudem, Tasva is a tribute to the Godavari spirit. We honor the slow preparation of every dish—curating hand-picked spices and locally sourced produce to define the new standard of regional fine-dining.
        </motion.p>
        <div className="grid grid-cols-2 gap-16 border-t border-gold/10 pt-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="group"
          >
            <h4 className="text-gold font-serif text-2xl mb-4 italic font-light">The Atelier</h4>
            <p className="text-[11px] text-cream/40 uppercase tracking-widest leading-relaxed">A sanctuary for flavor, where master chefs blend heirloom recipes with contemporary aesthetics.</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="group"
          >
            <h4 className="text-gold font-serif text-2xl mb-4 italic font-light">The Ambiance</h4>
            <p className="text-[11px] text-cream/40 uppercase tracking-widest leading-relaxed">An atmosphere designed for dialogue—minimalist, hushed, and profoundly welcoming.</p>
          </motion.div>
        </div>
      </div>
    </div>
  </section>
);

const Menu = () => {
  const [activeTab, setActiveTab] = useState('starters');

  return (
    <section id="menu" className="py-48 px-8 md:px-12 bg-maroon-light relative border-y border-gold/5">
      <div className="max-w-5xl mx-auto">
        <SectionHeading title="The Gourmet Selection" subtitle="Savour" />
        
        <div className="flex justify-center gap-16 mb-24 border-b border-cream/5 overflow-x-auto pb-8 scrollbar-hide">
          {MENU_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`text-[10px] uppercase tracking-[0.5em] transition-all whitespace-nowrap relative pb-3 flex items-center gap-3 ${
                activeTab === cat.id ? 'text-gold' : 'text-cream/30 hover:text-cream'
              }`}
            >
              {activeTab === cat.id && <span className="w-1 h-1 bg-gold rounded-full" />}
              {cat.title}
              {activeTab === cat.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-gold" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              },
              exit: {
                opacity: 0,
                y: -10,
                transition: { duration: 0.3 }
              }
            }}
            className="grid md:grid-cols-2 gap-x-24 gap-y-16"
          >
            {MENU_ITEMS[activeTab as keyof typeof MENU_ITEMS].map((item, idx) => (
              <motion.div 
                key={`${activeTab}-${idx}`} 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="group py-4 border-b border-gold/5 flex flex-col gap-2"
              >
                <div className="flex justify-between items-baseline gap-4">
                  <h4 className="font-serif text-2xl text-cream group-hover:text-gold transition-colors italic font-light">
                    {item.name}
                  </h4>
                  <div className="h-[1px] flex-grow bg-gold/5 group-hover:bg-gold/20 transition-all" />
                  <span className="text-gold font-light tracking-widest text-sm italic">₹{item.price}</span>
                </div>
                <p className="text-[11px] text-cream/40 font-light tracking-wide italic">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-28 text-center">
           <button className="px-16 py-5 border border-gold/20 text-[10px] text-cream/40 uppercase tracking-[0.5em] hover:border-gold hover:text-gold transition-all duration-500 rounded-sm">
             Download Full Journal
           </button>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [index, setIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const images = IMAGES.gallery;

  const next = () => setIndex((prev) => (prev + 1) % images.length);
  const prev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <section id="gallery" className="py-48 bg-maroon overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <SectionHeading title="Visual Narrative" subtitle="The Gallery" />
        
        <div className="relative max-w-5xl mx-auto">
          <div className="relative aspect-[16/10] md:aspect-video overflow-hidden ring-1 ring-gold/10 group bg-black">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ x: 100, opacity: 0, scale: 1.1 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 cursor-pointer"
                onClick={() => setSelectedImage(images[index])}
              >
                <img 
                  src={images[index]} 
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
                  alt={`Gallery ${index + 1}`}
                />
                <div className="absolute inset-0 bg-maroon/20 group-hover:bg-transparent transition-colors duration-1000" />
              </motion.div>
            </AnimatePresence>

            {/* Navigation Overlay */}
            <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <button 
                onClick={(e) => { e.stopPropagation(); prev(); }}
                className="w-14 h-14 rounded-full border border-gold/30 backdrop-blur-md bg-gold/5 flex items-center justify-center text-gold hover:bg-gold hover:text-maroon transition-all pointer-events-auto"
              >
                <Star size={18} className="-rotate-90" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); next(); }}
                className="w-14 h-14 rounded-full border border-gold/30 backdrop-blur-md bg-gold/5 flex items-center justify-center text-gold hover:bg-gold hover:text-maroon transition-all pointer-events-auto"
              >
                <Star size={18} className="rotate-90" />
              </button>
            </div>

            {/* Counter */}
            <div className="absolute top-10 right-10 z-20">
              <span className="text-[10px] text-gold uppercase tracking-[0.5em] font-medium backdrop-blur-md bg-maroon/40 px-4 py-2 border border-gold/10">
                0{index + 1} / 0{images.length}
              </span>
            </div>

            {/* Hint */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
               <div className="flex items-center gap-4 text-gold/60">
                 <div className="w-10 h-[1px] bg-gold/30" />
                 <span className="text-[8px] uppercase tracking-[0.6em]">Tap to Enlarge</span>
                 <div className="w-10 h-[1px] bg-gold/30" />
               </div>
            </div>
          </div>

          {/* Dots/Thumbnails */}
          <div className="mt-12 flex justify-center gap-6">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="group relative py-4"
              >
                <div className={`h-[1px] transition-all duration-700 ${i === index ? 'w-16 bg-gold' : 'w-6 bg-gold/20 group-hover:bg-gold/40'}`} />
                <span className={`absolute -top-2 left-0 text-[8px] font-medium tracking-widest transition-all duration-500 ${i === index ? 'text-gold opacity-100' : 'text-cream/20 opacity-0 group-hover:opacity-100'}`}>
                  0{i + 1}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* Note For User: You can add more images by updating IMAGES.gallery array and adding more blocks here */}

      {/* Lightbox Integration */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-24 bg-maroon/95 backdrop-blur-2xl"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-full max-h-full overflow-hidden ring-1 ring-gold/20 shadow-4xl bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={selectedImage} 
                className="w-auto h-full max-h-[85vh] object-contain px-2 py-2" 
                alt="Enlarged Narrative" 
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-10 right-10 text-gold flex flex-col items-center gap-2 group transition-all"
              >
                <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center group-hover:bg-gold group-hover:text-maroon transition-all">
                   <Star size={16} className="rotate-45" /> 
                </div>
                <span className="text-[10px] uppercase tracking-widest font-medium opacity-50 group-hover:opacity-100">Close</span>
              </button>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center pointer-events-none">
                <span className="text-[10px] text-gold/40 uppercase tracking-[0.8em] font-medium">Fine Dine Experience</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-0 top-1/4 w-[1px] h-96 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
      <div className="absolute left-0 bottom-1/4 w-[1px] h-96 bg-gradient-to-b from-transparent via-gold/10 to-transparent" />
    </section>
  );
};

const LocationMap = () => {
  const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || ''; // Fixed: Using import.meta.env
  const hasValidKey = Boolean(API_KEY);

  if (!hasValidKey) {
    return (
      <div className="h-full min-h-[500px] flex items-center justify-center bg-maroon-light rounded-sm border border-gold/5 text-center px-8 relative overflow-hidden group">
        <div className="absolute inset-0 bg-gold/2 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="max-w-sm relative z-10">
           <MapPin className="text-gold mx-auto mb-8 h-16 w-16 stroke-1" />
           <p className="text-xl font-serif italic text-cream/70 mb-4 tracking-tight">{RESTAURANT_INFO.address}</p>
           <p className="text-[10px] text-gold/40 uppercase tracking-[0.5em] font-medium">Tadepalligudem HO, Andhra Pradesh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-[500px] rounded-sm overflow-hidden border border-gold/5 shadow-2xl">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={RESTAURANT_INFO.location}
          defaultZoom={15}
          mapId="TASVA_MAP_ID_V2"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling="greedy"
          disableDefaultUI={true}
        >
          <AdvancedMarker position={RESTAURANT_INFO.location}>
            <Pin background="#C5A059" glyphColor="#1e0808" borderColor="#C5A059" scale={1.2} />
          </AdvancedMarker>
        </Map>
      </APIProvider>
    </div>
  );
};

const ReservationForm = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setTimeout(() => setStatus('success'), 1500);
  };

  if (status === 'success') {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="h-full min-h-[500px] flex flex-col items-center justify-center p-12 bg-maroon-light ring-1 ring-gold/20 text-center"
      >
        <Star className="text-gold mb-6 animate-pulse" size={48} />
        <h3 className="font-serif text-3xl text-cream italic font-light mb-4 text-balance">The table is being prepared.</h3>
        <p className="text-cream/40 text-[11px] uppercase tracking-[0.5em] max-w-xs leading-relaxed italic">
          We have received your requested time. A host will contact you shortly to confirm your fine-dining experience.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 bg-maroon-light p-10 md:p-16 ring-1 ring-gold/10 shadow-3xl">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-medium block">Full Name</label>
          <input 
            required
            type="text" 
            placeholder="John Doe"
            className="w-full bg-transparent border-b border-gold/10 py-3 text-cream/90 font-light placeholder:text-cream/10 focus:border-gold outline-none transition-all"
          />
        </div>
        <div className="space-y-4">
          <label className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-medium block">Phone Number</label>
          <input 
            required
            type="tel" 
            placeholder="+91 00000 00000"
            className="w-full bg-transparent border-b border-gold/10 py-3 text-cream/90 font-light placeholder:text-cream/10 focus:border-gold outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-medium block">Email Address</label>
          <input 
            required
            type="email" 
            placeholder="john@example.com"
            className="w-full bg-transparent border-b border-gold/10 py-3 text-cream/90 font-light placeholder:text-cream/10 focus:border-gold outline-none transition-all"
          />
        </div>
        <div className="space-y-4">
          <label className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-medium block">Number of Guests</label>
          <select 
            required
            className="w-full bg-transparent border-b border-gold/10 py-3 text-cream/90 font-light focus:border-gold outline-none transition-all appearance-none cursor-pointer"
          >
            {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n} className="bg-maroon text-cream">{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
            <option value="9+" className="bg-maroon text-cream">9+ Guests</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-medium block">Preferred Date</label>
          <input 
            required
            type="date" 
            className="w-full bg-transparent border-b border-gold/10 py-3 text-cream/90 font-light focus:border-gold outline-none transition-all dark:[color-scheme:dark]"
          />
        </div>
        <div className="space-y-4">
          <label className="text-gold/40 text-[9px] uppercase tracking-[0.4em] font-medium block">Time Selection</label>
          <input 
            required
            type="time" 
            className="w-full bg-transparent border-b border-gold/10 py-3 text-cream/90 font-light focus:border-gold outline-none transition-all dark:[color-scheme:dark]"
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={status === 'submitting'}
        className="w-full py-5 bg-gold text-maroon text-[11px] uppercase tracking-[0.5em] font-medium hover:bg-cream transition-all duration-500 disabled:opacity-50"
      >
        {status === 'submitting' ? 'Preparing your request...' : 'Secure Availability'}
      </button>
    </form>
  );
};

const Contact = () => (
  <section id="contact" className="py-48 px-8 md:px-12 bg-maroon relative">
    <div className="max-w-7xl mx-auto">
      <SectionHeading title="Reservations & Queries" subtitle="Contact" />
      
      <div className="grid lg:grid-cols-12 gap-24 items-start">
        <div className="lg:col-span-5 flex flex-col space-y-20">
          <div className="group cursor-default">
            <p className="text-gold/40 text-[9px] uppercase tracking-[0.6em] font-medium mb-6 transition-all group-hover:text-gold group-hover:tracking-[0.8em]">Location</p>
            <p className="text-2xl font-serif italic text-cream/80 leading-snug">
              {RESTAURANT_INFO.address}<br/>
              Near NTR Stadium, Tadepalligudem
            </p>
          </div>

          <div className="group cursor-default">
            <p className="text-gold/40 text-[9px] uppercase tracking-[0.6em] font-medium mb-6 transition-all group-hover:text-gold group-hover:tracking-[0.8em]">The Experience</p>
            <p className="text-2xl font-serif italic text-cream/80 mb-3">{RESTAURANT_INFO.phone}</p>
            <p className="text-[10px] text-cream/30 uppercase tracking-[0.4em] italic font-light">{RESTAURANT_INFO.hours}</p>
          </div>

          <div className="group cursor-default">
            <p className="text-gold/40 text-[9px] uppercase tracking-[0.6em] font-medium mb-6 transition-all group-hover:text-gold group-hover:tracking-[0.8em]">Write to Us</p>
            <p className="text-2xl font-serif italic text-cream/80 underline decoration-gold/20 underline-offset-8 hover:decoration-gold transition-all duration-500">
              {RESTAURANT_INFO.email}
            </p>
          </div>

          <div className="pt-4 flex gap-10">
             {[['Instagram', Instagram], ['Facebook', Facebook]].map(([name, Icon]) => (
               <a key={name as string} href="#" className="flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-cream/30 hover:text-gold transition-all group">
                 <span className="p-2 border border-gold/10 rounded-full group-hover:border-gold/30 transition-all">
                   <Icon size={14} className="stroke-1" />
                 </span>
                 {name as string}
               </a>
             ))}
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="lg:col-span-7"
        >
          <ReservationForm />
        </motion.div>
      </div>

      <div className="mt-40 h-[600px] ring-1 ring-gold/10 relative">
        <LocationMap />
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-20 border-t border-gold/5 bg-maroon">
    <div className="max-w-7xl mx-auto px-8 md:px-12">
      <div className="grid md:grid-cols-3 gap-20 items-center mb-20">
        <div className="h-10 flex items-center">
          <img 
            src="/src/logo.png" 
            alt="Tasva Logo" 
            className="h-full w-auto object-contain brightness-0 invert opacity-60 hover:opacity-100 transition-opacity"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
          <div className="hidden text-2xl font-light tracking-[0.5em] uppercase text-cream">
            Tasva <span className="text-gold font-medium">.</span>
          </div>
        </div>
        <div className="flex justify-center gap-12 text-[9px] uppercase tracking-[0.5em] text-cream/20 italic">
          <a href="#menu" className="hover:text-gold transition-colors">Menu</a>
          <a href="#about" className="hover:text-gold transition-colors">Story</a>
          <a href="#gallery" className="hover:text-gold transition-colors">Gallery</a>
        </div>
        <div className="flex md:justify-end gap-10 text-[9px] uppercase tracking-[0.4em] text-cream/20">
          <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-gold/5 pt-12">
        <p className="text-[10px] uppercase tracking-[0.4em] text-gold/30 font-light italic">
          &copy; 2024 Tasva Fine Dine. All Rights Reserved.
        </p>
        <div className="flex items-center gap-4">
           <div className="h-[1px] w-12 bg-gold/10" />
           <p className="text-[9px] uppercase tracking-[0.5em] text-cream/10">Crafted in Andhra Pradesh</p>
        </div>
      </div>
    </div>
  </footer>
);

export default function App() {
  return (
    <div className="bg-maroon text-cream font-sans selection:bg-gold selection:text-maroon scroll-smooth overflow-x-hidden relative">
      {/* Global Grain Archive Texture */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      <Navbar />
      <main>
        <Hero />
        <About />
        <Menu />
        <Gallery />
        <Contact />
      </main>

      <div className="fixed left-0 top-0 bottom-0 w-[1px] bg-gold/5 hidden 3xl:block" />
      <div className="fixed right-0 top-0 bottom-0 w-[1px] bg-gold/5 hidden 3xl:block" />
      
      {/* Scroll indicator - right side */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center hidden xl:flex z-40 opacity-20 hover:opacity-50 transition-opacity">
        {['hero', 'about', 'menu', 'gallery', 'contact'].map((section) => (
          <a key={section} href={`#${section}`} className="w-1 h-1 rounded-full bg-gold transition-all hover:scale-[3]" />
        ))}
      </div>
    </div>
  );
}
