import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ChefHat, Clock, MapPin, Phone, Instagram, Facebook, Utensils, Star, Quote, Mail } from 'lucide-react';
import { useState, useRef, useEffect, FormEvent } from 'react';
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
  { id: 'rice_biryani', title: 'Rice & Biryani' },
  { id: 'fried_rice_noodles', title: 'Fried Rice & Noodles' },
  { id: 'curries', title: 'Main Course' },
  { id: 'breads', title: 'Breads' },
  { id: 'desserts', title: 'Desserts' },
];

const MENU_ITEMS = {
  starters: [
    { name: "Godavari Paneer Kanti", price: "349", desc: "Artisanal cottage cheese medallions, char-grilled over embers and infused with a secret blend of Godavari heritage spices." },
    { name: "Kodi Miriyala Roast", price: "429", desc: "Succulent morsels of chicken, triple-tempered with cracked black peppercorns and aromatic curry leaves." },
    { name: "Coriander Chicken", price: "399", desc: "Vibrant South Indian chicken tossed in a lush, house-made coriander and green chili paste." },
    { name: "Mutton Ghee Roast", price: "460", desc: "Tender mutton slow-cooked in clarified butter with a rich blend of Kundapur spices." },
    { name: "Guntur Chilli Wings", price: "389", desc: "Crispy wings tossed in a fiery Guntur red chili glaze." },
    { name: "Apollo Fish", price: "449", desc: "Coastal style spicy fried fish medallions tossed in a signature curry leaf temper." },
    { name: "Veg Manchurian", price: "299", desc: "Crispy vegetable dumplings in a dark, tangy soy-garlic reduction." },
    { name: "Honey Chilli Potato", price: "289", desc: "Golden fried potato batons coated in a sweet and spicy sesame glaze." },
    { name: "Bangla Paneer", price: "320", desc: "Potato-crusted cottage cheese batons, deep-fried to a golden crunch." },
    { name: "Gongura Mushrooms", price: "299", desc: "Fresh mushrooms sautéed with tangy roselle leaves and regional spices." }
  ],
  rice_biryani: [
    { name: "Nizam-e-Tasva Biryani", price: "529", desc: "Fragrant long-grain Basmati and marrow-soft meat, 'Dum' cooked in sealed earthen vessels." },
    { name: "Ulavacharu Pottel Biryani", price: "549", desc: "Basmati rice infused with slow-reduced horse gram broth and spice-lacquered lamb." },
    { name: "Avakaya Chicken Pulao", price: "489", desc: "A spicy regional specialty featuring chicken flavored with traditional mango pickle." },
    { name: "Gongura Mutton Biryani", price: "559", desc: "Tangy Gongura leaves layered with tender mutton and aromatic saffron rice." },
    { name: "Konaseema Veg Pulao", price: "429", desc: "Fragrant rice layered with garden produce, mace, star anise, and toasted cashews." },
    { name: "Paneer 65 Biryani", price: "459", desc: "Spiced paneer cubes layered with fragrant Basmati rice and caramelised onions." }
  ],
  fried_rice_noodles: [
    { name: "Schezwan Chicken Fried Rice", price: "369", desc: "Wok-tossed rice with shredded chicken and house-made fiery Schezwan sauce." },
    { name: "Egg Soft Noodles", price: "329", desc: "Classic stir-fried noodles with farm eggs and crunchy garden vegetables." },
    { name: "Tasva Special Mix Fried Rice", price: "419", desc: "A lavish blend of prawns, chicken, and egg tossed with aromatic jasmine rice." },
    { name: "Burnt Garlic Veg Noodles", price: "299", desc: "Silken noodles infused with deeply toasted garlic and spring onions." },
    { name: "Chilli Garlic Chicken Noodles", price: "379", desc: "Spicy noodles tossed with chicken and a robust garlic-chili infusion." }
  ],
  curries: [
    { name: "Kodi Koora (Godavari Style)", price: "399", desc: "Bone-in chicken slow-cooked in a robust gravy infused with Guntur red chilies." },
    { name: "Gongura Mamsam", price: "459", desc: "Andhra masterpiece: tender mutton meet the distinctive, tangy punch of Roselle leaves." },
    { name: "Kaju Mushroom Masala", price: "329", desc: "Whole roasted cashews and button mushrooms in a rich, creamy onion-tomato base." },
    { name: "Nellore Chepala Pulusu", price: "489", desc: "Authentic tangine fish curry cooked with raw mango and tamarind." },
    { name: "Paneer Butter Masala", price: "349", desc: "Cottage cheese cubes in a velvety, mildly spiced tomato and butter gravy." }
  ],
  breads: [
    { name: "Butter Naan", price: "90", desc: "Soft and chewy leavened bread brushed with premium butter." },
    { name: "Garlic Naan", price: "110", desc: "Artisanal naan infused with fresh garlic and coriander." },
    { name: "Lachha Paratha", price: "89", desc: "Multi-layered whole wheat bread baked in the tandoor." },
    { name: "Tandoori Roti", price: "65", desc: "Classic whole wheat bread baked in a clay oven." }
  ],
  desserts: [
    { name: "Signature Jalebi Platter", price: "249", desc: "Crisp, golden jalebis served with aromatic syrup and silken rabri." },
    { name: "Elaneer Payasam", price: "225", desc: "Tender coconut pulp and cooling coconut milk, sweetened with palm jaggery." },
    { name: "Baked Gulab Jamun", price: "239", desc: "Reduced milk dumplings baked in a rich cardamom-infused syrup." }
  ]
};

const IMAGES = {
  hero: "/images/IMG_6388-HDR_1.jpg", 
  about: "/images/IMG_6303-HDR_1.jpg",
  food1: "/images/IMG_6318-HDR_1.jpg",
  food2: "/images/IMG_6303-HDR_1.jpg", // Fallback to existing
  interior: "/images/IMG_6388-HDR_1.jpg", 
  gallery: [
    "/images/IMG_6303-HDR_1.jpg",
    "/images/IMG_6318-HDR_1.jpg",
    "/images/IMG_6388-HDR_1.jpg"
  ]
};

const GUEST_EXPERIENCES = [
  {
    name: "Satish Tirumala",
    rating: 5,
    text: "Dining experience was excellent, good ambience and good service by staff.",
    source: "Google Reviews",
    date: "2 months ago"
  },
  {
    name: "Aditya Verma",
    rating: 5,
    text: "The Konaseema Veg Pulao is a revelation. The aromatic spices are perfectly balanced. Truly a fine dining gem in Tadepalligudem.",
    source: "Google Reviews",
    date: "1 month ago"
  },
  {
    name: "Priyanka Reddy",
    rating: 5,
    text: "Exquisite presentation and authentic Godavari flavors. The Mamsam Iguru is a must-try for any meat lover.",
    source: "Google Reviews",
    date: "3 weeks ago"
  }
];

const RATINGS_SUMMARY = [
  { platform: "Google", score: "4.6", total: "343 reviews", icon: "/images/logo.png" },
  { platform: "Zomato", score: "4.0", total: "343 votes", icon: "/images/logo.png" },
  { platform: "Swiggy", score: "4.2", total: "44 ratings", icon: "/images/logo.png" }
];

// --- Components ---
const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .cursor-pointer')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full border border-gold/30 pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
      animate={{
        x: position.x - 16,
        y: position.y - 16,
        scale: isHovering ? 2.5 : 1,
        backgroundColor: isHovering ? "rgba(197, 160, 89, 0.1)" : "rgba(197, 160, 89, 0)",
      }}
      transition={{ type: "spring", damping: 30, stiffness: 200, mass: 0.5 }}
    >
      <div className="w-1 h-1 bg-gold rounded-full" />
    </motion.div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
      isScrolled ? 'bg-maroon/95 backdrop-blur-xl py-6 border-b border-gold/10' : 'bg-maroon py-12 border-b border-gold/20'
    }`}>
      <motion.div 
        className="absolute bottom-0 left-0 h-[2px] bg-gold z-[70] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      <div className="max-w-7xl mx-auto px-8 md:px-12 flex justify-between items-center">
        <a href="/" className="flex items-center gap-4 group">
          {/* Logo Container */}
          <div className={`transition-all duration-700 flex items-center ${isScrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}>
            <img 
              src="/images/logo.png" 
              alt="Tasva Logo" 
              className="h-full w-auto object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-all duration-700"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-3xl font-light tracking-[0.6em] uppercase text-cream">
              Tasva <span className="text-gold font-medium">.</span>
            </div>
          </div>
        </a>
        <div className="hidden md:flex gap-8 lg:gap-16 text-[10px] lg:text-[11px] uppercase tracking-[0.4em] text-cream/70">
          {['Menu', 'Offers', 'About', 'Gallery', 'Reviews', 'Contact'].map((item) => (
             <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-gold transition-all relative group py-2">
               {item}
               <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gold transition-all group-hover:w-full"></span>
             </a>
          ))}
        </div>
        <div className="flex items-center gap-8">
           <div className="hidden xl:flex flex-col items-end gap-1">
             <span className="text-[8px] uppercase tracking-widest text-gold/40">Reservations</span>
             <span className="text-[10px] text-gold font-light tracking-widest">+91 88188 88188</span>
           </div>
           <a href="#contact" className="px-10 py-4 border border-gold/40 text-gold text-[10px] uppercase tracking-[0.3em] hover:bg-gold hover:text-maroon transition-all duration-500 rounded-sm bg-gold/5">
             Book Table
           </a>
        </div>
      </div>
    </nav>
  );
};

const Offers = () => (
  <section id="offers" className="py-32 px-8 md:px-12 bg-maroon-dark relative overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <SectionHeading title="Gourmet Privileges" subtitle="Special Offers" />
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { title: "Corporate Excellence", desc: "Flat ₹150 Off on corporate orders above ₹1299.", code: "AXISREWARDS", icon: ChefHat },
          { title: "Midweek Indulgence", desc: "10% Off up to ₹75 on select credit cards.", code: "VISAPLATINUMCC", icon: Utensils },
          { title: "First Visit Grace", desc: "Extra ₹50 Off on orders above ₹299 for newcomers.", code: "NO CODE REQUIRED", icon: Star }
        ].map((offer, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 border border-gold/10 bg-maroon/40 backdrop-blur-sm relative group hover:border-gold/30 transition-all rounded-sm overflow-hidden"
          >
            <offer.icon className="absolute -right-4 -bottom-4 h-24 w-24 text-gold/5 group-hover:text-gold/10 transition-all" />
            <h3 className="font-serif text-2xl text-gold mb-4 italic font-light">{offer.title}</h3>
            <p className="text-cream/60 text-sm mb-8 leading-relaxed">{offer.desc}</p>
            <div className="flex flex-col gap-2">
              <span className="text-[9px] uppercase tracking-widest text-gold/40">Use Code</span>
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-cream">{offer.code}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

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
    <div id="hero" className="relative h-[85vh] md:h-[calc(100vh-160px)] min-h-[700px] overflow-hidden flex items-center bg-black">
      {/* Cinematic Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.div style={{ scale }} className="w-full h-full">
          <iframe 
            src="https://player.vimeo.com/video/1191169232?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&controls=0&transparent=1&speed=0.75"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vh] min-w-[177.77vh] min-h-[56.25vw] object-cover pointer-events-none"
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
           initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
           animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
           transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span 
            initial={{ opacity: 0, letterSpacing: '0.4em' }}
            animate={{ opacity: 1, letterSpacing: '0.8em' }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="text-gold font-sans text-[10px] sm:text-xs font-medium uppercase mb-12 block"
          >
            An Unrivalled Culinary Legacy
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-6xl md:text-9xl lg:text-[11rem] text-cream mb-12 tracking-tighter leading-[0.85] italic font-thin drop-shadow-2xl"
          >
            A Heritage <br/>
            of <span className="text-gold italic font-extralight tracking-tight">Flavor.</span>
          </motion.h1>

          <div className="flex flex-col items-center gap-10">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1.5 }}
              className="text-lg md:text-2xl text-cream/80 max-w-2xl font-serif italic font-extralight leading-relaxed tracking-tight"
            >
              Traditional Telugu soul, modern elegance. Discover the golden ratio of spice and culture at Godavari's first premium fine-dining atelier.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
              className="flex flex-col md:flex-row items-center gap-12 mt-10"
            >
              <a href="#menu" className="relative group px-16 py-5 overflow-hidden">
                <div className="absolute inset-0 bg-gold transition-transform duration-700 group-hover:scale-x-110" />
                <span className="relative z-10 text-maroon text-[11px] uppercase tracking-[0.5em] font-medium transition-all group-hover:tracking-[0.6em]">
                  Explore the Menu
                </span>
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
          <div className="relative w-full aspect-video bg-black overflow-hidden rounded-sm ring-1 ring-gold/20">
            <iframe 
              src="https://player.vimeo.com/video/1191169232?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1&controls=0&transparent=1"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[102%] min-h-[102%] w-auto h-auto aspect-video object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
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
        
        <div className="relative mb-32 group/menu">
          {/* Decorative scroll indicators for mobile */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-maroon-light to-transparent z-10 md:hidden pointer-events-none opacity-0 group-hover/menu:opacity-100 transition-opacity" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-maroon-light to-transparent z-10 md:hidden pointer-events-none opacity-0 group-hover/menu:opacity-100 transition-opacity" />
          
          <div className="flex md:flex-wrap md:justify-center items-center gap-x-4 md:gap-x-10 gap-y-6 lg:gap-x-16 border-b border-cream/5 overflow-x-auto md:overflow-x-visible pb-8 scrollbar-hide px-4 md:px-0 scroll-smooth">
            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                id={`tab-${cat.id}`}
                onClick={() => {
                  setActiveTab(cat.id);
                  document.getElementById(`tab-${cat.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                }}
                className={`text-[12px] md:text-[13px] uppercase tracking-[0.4em] md:tracking-[0.6em] transition-all whitespace-nowrap relative py-5 px-6 flex items-center gap-3 group/btn cursor-pointer ${
                  activeTab === cat.id ? 'text-gold' : 'text-cream/30 hover:text-gold/60'
                }`}
              >
                <div className={`w-2 h-2 rounded-full transition-all duration-500 ring-1 ring-offset-2 ring-offset-maroon-light ${
                  activeTab === cat.id ? 'bg-gold scale-100 ring-gold/40' : 'bg-transparent scale-0 ring-transparent'
                }`} />
                <span className="font-medium">{cat.title}</span>
                {activeTab === cat.id && (
                  <motion.div 
                    layoutId="tab-underline" 
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold shadow-[0_0_10px_rgba(197,160,89,0.3)]" 
                  />
                )}
              </button>
            ))}
          </div>
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

const GalleryImage = ({ src, alt, className, onClick }: { src: string; alt: string; className?: string; onClick?: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black/20 group">
      {/* Shimmer/Placeholder */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-maroon-dark/50 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="w-8 h-8 rounded-full border border-gold/10 border-t-gold/40 animate-spin" />
            <span className="text-[8px] uppercase tracking-[0.4em] text-gold/30">Loading Narrative</span>
          </motion.div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-maroon-dark/80 p-6 text-center">
          <Utensils className="text-gold/20 mb-4 h-8 w-8 stroke-1" />
          <p className="text-[10px] text-gold/40 uppercase tracking-widest leading-relaxed">Identity Lost in Transit</p>
        </div>
      )}

      <img 
        src={src} 
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        onClick={onClick}
        className={`${className} ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'} transition-all duration-[1.5s] ease-out-expo`} 
        alt={alt}
      />
    </div>
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
              >
                <GalleryImage 
                  src={images[index]} 
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105"
                  onClick={() => setSelectedImage(images[index])}
                />
                <div className="absolute inset-0 bg-maroon/20 group-hover:bg-transparent transition-colors duration-1000 pointer-events-none" />
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

const Reviews = () => (
  <section id="reviews" className="py-48 bg-maroon-light relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-8 md:px-12 relative z-10">
      <SectionHeading title="Guest Experiences" subtitle="Memoirs" />
      
      {/* Ratings Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {RATINGS_SUMMARY.map((rating, idx) => (
          <motion.div
            key={rating.platform}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="p-8 border border-gold/10 bg-maroon flex flex-col items-center text-center group hover:border-gold/30 transition-all duration-700"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className={i < Math.floor(parseFloat(rating.score)) ? "fill-gold text-gold" : "text-gold/20"} 
                />
              ))}
            </div>
            <span className="text-4xl font-serif italic text-cream mb-2">{rating.score}</span>
            <span className="text-[10px] uppercase tracking-[0.4em] text-gold font-medium mb-4">{rating.platform}</span>
            <div className="w-8 h-[1px] bg-gold/20 group-hover:w-16 transition-all duration-700 mb-4" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-cream/30">{rating.total}</span>
          </motion.div>
        ))}
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        {GUEST_EXPERIENCES.map((review, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
            className="relative p-10 border border-gold/5 hover:border-gold/20 transition-all duration-700 flex flex-col"
          >
            <Quote className="text-gold/10 absolute top-8 right-8 h-12 w-12 stroke-[0.5]" />
            <div className="flex gap-1 mb-6">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} size={10} className="fill-gold text-gold" />
              ))}
            </div>
            <p className="text-lg font-serif italic text-cream/70 leading-relaxed mb-10 relative z-10">
              "{review.text}"
            </p>
            <div className="mt-auto pt-8 border-t border-gold/5 flex items-center justify-between">
              <div>
                <h4 className="text-[11px] uppercase tracking-widest text-gold mb-1">{review.name}</h4>
                <p className="text-[9px] uppercase tracking-widest text-cream/20">{review.source} &bull; {review.date}</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-gold/10 flex items-center justify-center">
                <Star size={12} className="text-gold/20" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-32 text-center">
        <a 
          href="https://share.google/zATtVwLC7DrQfVMHm" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group inline-flex flex-col items-center gap-6"
        >
          <span className="text-[10px] uppercase tracking-[0.6em] text-cream/40 group-hover:text-gold transition-colors">Read All Memoirs</span>
          <div className="w-20 h-[1px] bg-gold/20 relative overflow-hidden">
            <motion.div 
              animate={{ x: ['100%', '-100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 bg-gold w-1/2"
            />
          </div>
        </a>
      </div>
    </div>

    {/* Decorative BG elements */}
    <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gold/2 blur-[150px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-maroon-dark blur-[150px] pointer-events-none" />
  </section>
);

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
  
  const handleSubmit = (e: FormEvent) => {
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
            src="/images/logo.png" 
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
      <CustomCursor />
      {/* Global Grain Archive Texture */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      <Navbar />
      <div className="h-0 md:h-40" /> {/* Spacer for Fixed Navbar */}
      <main>
        <Hero />
        <Offers />
        <About />
        <Menu />
        <Gallery />
        <Reviews />
        <Contact />
      </main>

      <Footer />

      <div className="fixed left-0 top-0 bottom-0 w-[1px] bg-gold/5 hidden 3xl:block" />
      <div className="fixed right-0 top-0 bottom-0 w-[1px] bg-gold/5 hidden 3xl:block" />
      
      {/* Scroll indicator - right side */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 items-center hidden xl:flex z-40 opacity-20 hover:opacity-50 transition-opacity">
        {['hero', 'offers', 'about', 'menu', 'gallery', 'reviews', 'contact'].map((section) => (
          <a key={section} href={`#${section}`} className="w-1 h-1 rounded-full bg-gold transition-all hover:scale-[3]" title={section} />
        ))}
      </div>
    </div>
  );
}
