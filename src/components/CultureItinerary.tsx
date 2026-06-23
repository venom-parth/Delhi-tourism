import React, { useEffect, useRef } from 'react';
import ImageWithFallback from './ImageWithFallback';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const itinerary = [
  {
    day: "Day 1",
    title: "Mughal Legacy",
    desc: "Start your journey at the majestic Red Fort. Navigate the chaotic, aromatic lanes of Chandni Chowk on a rickshaw, and witness the grandeur of Jama Masjid. End your evening taking a stroll down Rajpath towards India Gate.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Gurudwara_Sisganj_Sahib_Chandni_Chowk_19.jpg/3840px-Gurudwara_Sisganj_Sahib_Chandni_Chowk_19.jpg"
  },
  {
    day: "Day 2",
    title: "Sultanate to Spiritual",
    desc: "Spend your morning marveling at the towering Qutub Minar complex. Move towards the serene Lotus Temple for meditation. End your day catching a breathtaking sunset at the pristine Humayun's Tomb.",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/75/India_Gate_%28All_India_War_Memorial%29.jpg"
  },
  {
    day: "Day 3",
    title: "Modern & Museums",
    desc: "Dive into history at the National Museum. Head over to Connaught Place for upscale dining and retail shopping. Conclude your trip witnessing the spellbinding light and sound show at Swaminarayan Akshardham.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/3840px-Qutb_Minar_2022.jpg"
  }
];

export default function CultureItinerary() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.culture-card', {
        y: 50, duration: 1, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="culture" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[var(--bg-main)] border-t border-[var(--border-light)]">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-var(--color-delhi-saffron) uppercase mb-4">Curated Experience</p>
            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)] mb-2">Culture & Itinerary</h2>
          </div>
          <p className="max-w-sm text-sm text-[var(--text-muted)] md:text-right">
            A comprehensive 72-hour guide designed to give you the perfect balance of history, spirituality, and modern urban chaos.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {itinerary.map((item, idx) => (
            <div key={idx} className="culture-card bento-panel group overflow-hidden flex flex-col">
              <div className="h-64 sm:h-80 w-full relative overflow-hidden">
                 <ImageWithFallback 
                   src={item.img} 
                   alt={item.title} 
                   className="w-full h-full object-cover filter brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                 />
                 <div className="absolute top-4 left-4 inline-block px-4 py-1.5 bg-[var(--glass-bg)] backdrop-blur-md rounded-full border border-[var(--border-main)] text-[var(--text-main)] font-mono text-xs tracking-widest uppercase font-bold">
                    {item.day}
                 </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h3 className="text-2xl font-bold text-[var(--text-main)] uppercase tracking-tight mb-4 group-hover:text-var(--color-delhi-saffron) transition-colors">{item.title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-6 flex-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
