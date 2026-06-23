import React, { useEffect, useRef } from 'react';
import { Map, Navigation, Compass } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Delhi3DModel } from './Delhi3DModel';
import DelhiInteractiveMap from './DelhiInteractiveMap';

export default function Geography() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.bento-item', {
        y: 40,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="explore" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 z-20">
      <div className="container mx-auto max-w-7xl space-y-12">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[var(--border-main)] pb-8">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[var(--text-main)] leading-[0.9]">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-var(--color-delhi-blue) to-teal-400">Heart</span> <br />of India
          </h2>
          <p className="max-w-sm text-[var(--text-muted)] text-sm md:text-base md:text-right">
            Nestled on the banks of the Yamuna River, Delhi represents a geographical nexus where ancient trade routes met the future skyline.
          </p>
        </div>

        {/* Brand New Spectacular Interactive Map & Hologram Selector */}
        <div className="bento-item">
          <DelhiInteractiveMap />
        </div>

        {/* Secondary geographical attributes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 3D Model Box */}
          <div className="bento-panel bento-item relative overflow-hidden flex flex-col items-center justify-center p-6 min-h-[280px]">
            <Delhi3DModel />
            <div className="relative z-10 p-6 flex flex-col items-center justify-center h-full w-full pointer-events-none">
              <Compass className="w-8 h-8 text-var(--color-delhi-blue) mb-6 opacity-60" />
              <div className="mt-auto text-center bg-[var(--bg-main)]/70 backdrop-blur-md w-full p-4 rounded-xl border border-[var(--border-light)]">
                <h4 className="font-bold text-[var(--text-main)] text-sm uppercase tracking-wider">Topography Model</h4>
                <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-widest">Digital Abstract</p>
              </div>
            </div>
          </div>

          <div className="bento-panel bento-item p-8 flex flex-col justify-center">
            <Map className="w-8 h-8 text-var(--color-delhi-emerald) mb-6" />
            <h4 className="font-bold text-[var(--text-main)] text-xl mb-2">Yamuna River</h4>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">The historical floodplains that divide the city into East and West regions.</p>
          </div>

          <div className="bento-panel bento-item p-8 flex flex-col justify-center">
            <Navigation className="w-8 h-8 text-var(--color-delhi-saffron) mb-6" />
            <h4 className="font-bold text-[var(--text-main)] text-xl mb-2">Aravalli Range</h4>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">The Delhi Ridge acts as the protective green lungs of the metropolis.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

