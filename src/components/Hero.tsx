import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.hero-bg', {
        scale: 1.1,
        duration: 2.5,
        ease: "power2.out"
      });
      gsap.from('.hero-char', {
        y: 120,
        opacity: 0,
        duration: 1.2,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.2
      });
      gsap.from('.hero-meta', {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 1,
        ease: "power2.out"
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const title = "DELHI";

  return (
    <section ref={containerRef} className="relative min-h-[100svh] w-full flex flex-col justify-end pb-24 px-6 sm:px-12 xl:px-24 z-10 overflow-hidden" id="hero">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2500&auto=format&fit=crop" 
          alt="Delhi Skyline" 
          referrerPolicy="no-referrer"
          className="hero-bg w-full h-full object-cover filter brightness-[0.6] contrast-125 transition-transform"
        />
        {/* Theme-adaptive solid overlay to ensure text contrast */}
        <div className="absolute inset-0 bg-[var(--hero-overlay)] transition-colors duration-500" />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-main)] via-[var(--bg-main)]/50 to-transparent transition-colors duration-500" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-main)] via-transparent to-transparent opacity-80 transition-colors duration-500" />
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto">
        <div className="hero-meta flex items-center gap-4 mb-6">
          <div className="h-px w-12 bg-var(--color-delhi-saffron)" />
          <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[var(--text-main)] font-medium drop-shadow-md">Future Meets Heritage</span>
        </div>
        
        <h1 className="font-display text-[22vw] lg:text-[16vw] font-black leading-[0.8] tracking-tighter text-[var(--text-main)] uppercase flex overflow-hidden -ml-2 drop-shadow-2xl">
          {title.split('').map((char, i) => (
            <span key={i} className="hero-char inline-block relative">
              {char}
            </span>
          ))}
        </h1>
        
        <div className="mt-12 flex flex-col md:flex-row gap-8 justify-between items-end">
          <p className="hero-meta text-base md:text-lg font-light text-[var(--text-main)] max-w-md leading-relaxed border-l-2 border-var(--color-delhi-saffron) pl-6 drop-shadow">
            Step into a vibrant fusion of ancient Mughal monuments, urban skylines, and electric street culture.
          </p>

          <a href="#explore" className="hero-meta inline-flex items-center gap-4 text-xs font-mono tracking-widest text-[var(--text-main)] uppercase group w-fit">
            <span className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all bg-black/20 backdrop-blur-sm">↓</span>
            Discover
          </a>
        </div>
      </div>
    </section>
  );
}
