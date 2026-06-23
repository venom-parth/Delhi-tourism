import React, { useEffect, useRef, useState } from 'react';
import Hero from './components/Hero';
import Geography from './components/Geography';
import Monuments from './components/Monuments';
import Gardens from './components/Gardens';
import Markets from './components/Markets';
import Food from './components/Food';
import Transport from './components/Transport';
import Climate from './components/Climate';
import CultureItinerary from './components/CultureItinerary';
import Footer from './components/Footer';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sun, Moon } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }, [isLightMode]);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to('.progress-bar', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: mainRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      });
    }, mainRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-[var(--bg-main)] min-h-screen font-sans text-[var(--text-main)] selection:bg-var(--color-delhi-saffron) selection:text-[#050505]">
      {/* Texture Overlay */}
      <div className="bg-noise" />
      
      {/* Scroll Progress */}
      <div className="progress-bar fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-var(--color-delhi-blue) to-var(--color-delhi-saffron) origin-left z-[100] transform scale-x-0" />
      
      {/* Sleek Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav px-6 py-4 flex justify-between items-center">
        <div className="font-display font-black text-[var(--text-main)] tracking-[0.2em] text-xl uppercase">
          DELHI<span className="text-var(--color-delhi-saffron)">.</span>
        </div>
        <div className="flex items-center gap-8 text-[11px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
          <div className="hidden md:flex gap-8">
            <a href="#explore" className="hover:text-[var(--text-main)] transition-colors">Geo</a>
            <a href="#monuments" className="hover:text-[var(--text-main)] transition-colors">Monuments</a>
            <a href="#food" className="hover:text-[var(--text-main)] transition-colors">Food</a>
            <a href="#transport" className="hover:text-[var(--text-main)] transition-colors">Guide</a>
          </div>
          <button 
            onClick={() => setIsLightMode(!isLightMode)}
            className="p-2 rounded-full hover:bg-[var(--overlay-hover)] text-[var(--text-main)] transition-all flex items-center justify-center cursor-pointer border border-[var(--border-light)]"
            title="Toggle Theme"
          >
            {isLightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      <main ref={mainRef} className="relative flex flex-col w-full overflow-hidden">
        <Hero />
        <Geography />
        <Monuments />
        <Gardens />
        <Markets />
        <Food />
        <Transport />
        <Climate />
        <CultureItinerary />
      </main>

      <Footer />
    </div>
  );
}
