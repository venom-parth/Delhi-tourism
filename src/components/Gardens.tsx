import React, { useEffect, useRef } from 'react';
import ImageWithFallback from './ImageWithFallback';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Trees, Flower2 } from 'lucide-react';

const gardens = [
  {
    name: "Lodhi Gardens",
    icon: <Trees className="w-6 h-6 text-var(--color-delhi-emerald)" />,
    desc: "A sprawling city park scattered with 15th-century architectural monuments from the Sayyid and Lodi dynasties. A favorite morning spot for locals.",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lodhi_Gardens_on_a_sunny_day.jpg/3840px-Lodhi_Gardens_on_a_sunny_day.jpg"
  },
  {
    name: "Sunder Nursery",
    icon: <Flower2 className="w-6 h-6 text-pink-400" />,
    desc: "A beautifully restored 16th-century heritage park complex. Often compared to Central Park, featuring vibrant flora, lakes, and Mughal ruins.",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/0d/Sunder_Nursery_Sep-2019.jpg"
  }
];

export default function Gardens() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.garden-card', {
        scale: 0.95, duration: 0.8, stagger: 0.2, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="gardens" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[var(--bg-main)]">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-5 h-5 text-var(--color-delhi-emerald)" />
            <p className="font-mono text-xs tracking-[0.2em] text-var(--color-delhi-emerald) uppercase">Urban Oasis</p>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)] mb-2">Green Lungs</h2>
          <p className="max-w-xl text-[var(--text-muted)] mt-4 leading-relaxed">
            Despite its extreme urbanization, Delhi remains one of the greenest capitals, harboring vast parks seamlessly blending nature with history.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {gardens.map((g, idx) => (
            <div key={idx} className="garden-card bento-panel p-8 md:p-12 relative overflow-hidden group min-h-[400px] flex flex-col justify-end">
              <div className="absolute inset-0 z-0">
                 <ImageWithFallback 
                   src={g.img} 
                   alt={g.name} 
                   className="w-full h-full object-cover filter brightness-[0.35] group-hover:brightness-[0.6] group-hover:scale-105 transition-all duration-1000"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/40 to-transparent" />
              </div>
              
              <div className="relative z-10">
                 <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-[var(--border-main)] w-fit mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                   {g.icon}
                 </div>
                 <h3 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-main)] uppercase tracking-tight mb-4">{g.name}</h3>
                 <p className="text-[var(--text-muted)] text-sm md:text-base max-w-md leading-relaxed">
                   {g.desc}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
