import React, { useEffect, useRef } from 'react';
import ImageWithFallback from './ImageWithFallback';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Store, Tag, Coffee, ShoppingBag } from 'lucide-react';

const markets = [
  {
    name: "Chandni Chowk",
    tag: "Heritage",
    icon: <Store className="w-5 h-5 text-var(--color-delhi-saffron)" />,
    desc: "One of the oldest and busiest markets. Famous for spices (Khari Baoli), jewelry, and traditional bridal wear.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Gurudwara_Sisganj_Sahib_Chandni_Chowk_19.jpg/3840px-Gurudwara_Sisganj_Sahib_Chandni_Chowk_19.jpg"
  },
  {
    name: "Khan Market",
    tag: "Boutique",
    icon: <Coffee className="w-5 h-5 text-var(--color-delhi-blue)" />,
    desc: "Upscale shopping destination featuring high-end boutiques, bookstores, and expat-friendly cafes.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/FabIndia_outlet%2C_Khan_Market%2C_New_Delhi.jpg/3840px-FabIndia_outlet%2C_Khan_Market%2C_New_Delhi.jpg"
  },
  {
    name: "Dilli Haat",
    tag: "Handicrafts",
    icon: <ShoppingBag className="w-5 h-5 text-var(--color-delhi-emerald)" />,
    desc: "An open-air craft bazaar showcasing regional artisans, handicrafts, and regional state food stalls.",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/1f/Dilli_Haat_-_INA.jpg"
  },
  {
    name: "Sarojini Nagar",
    tag: "Fashion",
    icon: <Tag className="w-5 h-5 text-var(--color-delhi-purple)" />,
    desc: "The ultimate destination for street fashion, thrift finds, and extreme bargaining.",
    img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=100&w=3840&auto=format&fit=crop"
  }
];

export default function Markets() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.market-card', {
        y: 40, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="markets" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[var(--bg-main)]">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[var(--border-main)] pb-8">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-var(--color-delhi-purple) uppercase mb-4">Retail Therapy</p>
            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)] mb-2">Bazaars & <br/>Boutiques</h2>
          </div>
          <p className="max-w-sm text-sm text-[var(--text-muted)] md:text-right">
            From 17th-century spice markets to contemporary designer stores, navigate through layers of commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {markets.map((m, idx) => (
            <div key={idx} className="market-card bento-panel overflow-hidden group flex flex-col pt-6">
               <div className="px-6 mb-6">
                 <div className="flex justify-between items-start mb-4">
                   <div className="p-3 bg-black/40 backdrop-blur-md rounded-xl border border-[var(--border-main)]">
                     {m.icon}
                   </div>
                   <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-widest border border-[var(--border-main)] px-2 py-1 rounded-full">{m.tag}</span>
                 </div>
                 <h3 className="text-xl font-bold text-[var(--text-main)] uppercase tracking-tight mb-2">{m.name}</h3>
                 <p className="text-xs text-[var(--text-muted)] leading-relaxed min-h-[60px]">{m.desc}</p>
               </div>
               
               <div className="h-48 w-full relative overflow-hidden mt-auto">
                 <ImageWithFallback 
                   src={m.img} 
                   alt={m.name} 
                   className="w-full h-full object-cover filter brightness-[0.6] group-hover:brightness-100 group-hover:scale-110 transition-all duration-700"
                 />
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
