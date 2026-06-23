import React, { useEffect, useRef } from 'react';
import { Sun, CloudRain, Snowflake } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const seasons = [
  { icon: <Sun className="w-6 h-6 text-yellow-500" />, name: "Summer", time: "Apr - Jun", desc: "Scorching heat. Avoid daytime outdoor tours.", img: "https://images.unsplash.com/photo-1546272989-40c92939c6c2?q=100&w=3840&auto=format&fit=crop" },
  { icon: <CloudRain className="w-6 h-6 text-blue-400" />, name: "Monsoon", time: "Jul - Sep", desc: "Humid with heavy burst showers. Green but chaotic.", img: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=100&w=3840&auto=format&fit=crop" },
  { icon: <Snowflake className="w-6 h-6 text-cyan-300" />, name: "Winter", time: "Dec - Feb", desc: "Cold with dense fog. Peak time to explore monuments.", img: "https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?q=100&w=3840&auto=format&fit=crop" }
];

export default function Climate() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.clim-card', {
        y: 30, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="climate" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[var(--bg-main)] border-t border-[var(--border-light)]">
      <div className="container mx-auto max-w-7xl">
         <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <p className="font-mono text-xs tracking-[0.2em] text-var(--color-delhi-saffron) uppercase mb-4">Atmosphere</p>
            <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)] mb-2">Climate</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {seasons.map((s, i) => (
            <div key={i} className="clim-card bento-panel overflow-hidden h-[350px] relative group flex flex-col justify-end p-8">
              <ImageWithFallback 
                src={s.img} 
                alt={s.name} 
                className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4] group-hover:brightness-50 group-hover:scale-105 transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-[var(--border-main)] group-hover:scale-110 transition-transform">{s.icon}</div>
                  <span className="font-mono text-xs text-[var(--text-main)] bg-black/40 px-3 py-1 rounded-full backdrop-blur-md uppercase tracking-widest">{s.time}</span>
                </div>
                <h3 className="text-3xl font-display font-bold text-[var(--text-main)] uppercase tracking-tight mb-2 group-hover:text-var(--color-delhi-saffron) transition-colors">{s.name}</h3>
                <p className="text-sm text-[var(--text-muted)]">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
