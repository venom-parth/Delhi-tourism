import React, { useEffect, useRef } from 'react';
import { Train, Plane, Car, AlertCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Transport() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.transport-item', {
        y: 30, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="transport" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 bg-[var(--bg-main)]">
      <div className="container mx-auto max-w-7xl">
        <div className="border-t border-[var(--border-main)] pt-16 mb-16">
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-[var(--text-main)] mb-4">
            Urban Veins
          </h2>
          <p className="max-w-xl text-[var(--text-muted)]">
            Navigate the megacity through its world-class metro infrastructure or vivid local transport.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Metro Block - High span */}
          <div className="transport-item bento-panel md:col-span-8 p-8 md:p-12 relative overflow-hidden group">
            <div className="absolute inset-0 pointer-events-none">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/DelhiMetroYellowLine.JPG/3840px-DelhiMetroYellowLine.JPG" 
                   alt="Metro" 
                   referrerPolicy="no-referrer"
                   className="w-full h-full object-cover filter brightness-[0.25] group-hover:brightness-[0.35] transition-all duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-[var(--bg-main)]/80 to-transparent" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-var(--color-delhi-purple)/20 rounded-full flex items-center justify-center mb-6 border border-var(--color-delhi-purple)/30">
                 <Train className="w-5 h-5 text-var(--color-delhi-purple)" />
              </div>
              <h3 className="font-display text-3xl font-bold text-[var(--text-main)] uppercase tracking-tight mb-4">Delhi Metro (DMRC)</h3>
              <p className="text-[var(--text-muted)] text-sm md:text-base max-w-md leading-relaxed mb-8">
                The absolute lifeline of the city. Spotlessly clean, highly efficient, and fully air-conditioned. Connects all major monuments, markets, and the airport effortlessly.
              </p>
              
              <div className="flex flex-wrap gap-2 text-[10px] font-mono tracking-widest uppercase font-bold text-black">
                <span className="px-3 py-1.5 bg-yellow-500 rounded-sm">Yellow Line</span>
                <span className="px-3 py-1.5 bg-blue-500 text-[var(--text-main)] rounded-sm">Blue Line</span>
                <span className="px-3 py-1.5 bg-red-600 text-[var(--text-main)] rounded-sm">Red Line</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 flex flex-col gap-6 transport-item">
            <div className="bento-panel p-8 flex-1 flex flex-col justify-center">
               <Plane className="w-6 h-6 text-var(--color-delhi-blue) mb-4" />
               <h3 className="font-bold text-[var(--text-main)] text-xl mb-2 uppercase">IGI Airport</h3>
               <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                 Terminal 3 is a major global hub. Quickest city connection is via the dedicated Airport Express line (20 mins).
               </p>
            </div>
            <div className="bento-panel p-8 flex-1 flex flex-col justify-center">
               <Car className="w-6 h-6 text-var(--color-delhi-saffron) mb-4" />
               <h3 className="font-bold text-[var(--text-main)] text-xl mb-2 uppercase">Auto Rickshaws</h3>
               <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                 Iconic green and yellow fleets. Use ride-hailing apps to lock in fixed fares and avoid endless negotiations.
               </p>
            </div>
          </div>
          
          <div className="transport-item md:col-span-12 bento-panel p-6 flex flex-col text-center sm:text-left sm:flex-row items-center gap-6 border-yellow-500/20 bg-yellow-500/5">
             <AlertCircle className="w-8 h-8 text-yellow-500 shrink-0" />
             <div>
                <h4 className="text-sm font-bold text-[var(--text-main)] uppercase tracking-widest mb-1">Verify fares & timings locally</h4>
                <p className="text-xs text-[var(--text-muted)]">Buy a Metro Smart Card to avoid queues. Secure belongings in crowded markets.</p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
