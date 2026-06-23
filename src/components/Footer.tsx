import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#000000] py-16 px-6 sm:px-12 lg:px-24 border-t border-[var(--border-main)]">
      <div className="container mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-12">
        <div>
          <h2 className="font-display text-5xl md:text-8xl font-black uppercase tracking-tighter text-[var(--text-main)] leading-none">
            DELHI<span className="text-var(--color-delhi-saffron)">.</span>
          </h2>
          <p className="font-mono text-xs text-[var(--text-muted)] uppercase tracking-[0.3em] mt-4">Future Meets Heritage</p>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-8 text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
            <a href="#explore" className="hover:text-[var(--text-main)] transition-colors">Geo</a>
            <a href="#monuments" className="hover:text-[var(--text-main)] transition-colors">Monuments</a>
            <a href="#food" className="hover:text-[var(--text-main)] transition-colors">Food</a>
          </div>
          
          <div className="flex gap-4">
            <a href="https://github.com/VenomDevX" target="_blank" rel="noopener noreferrer" className="p-3 bg-[var(--overlay)] hover:bg-[var(--overlay-hover)] rounded-full text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors" title="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/parth-sharma-b96661245/" target="_blank" rel="noopener noreferrer" className="p-3 bg-[var(--overlay)] hover:bg-[var(--overlay-hover)] rounded-full text-[var(--text-muted)] hover:text-[#0a66c2] transition-colors" title="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://venomparth.dev" target="_blank" rel="noopener noreferrer" className="p-3 bg-[var(--overlay)] hover:bg-[var(--overlay-hover)] rounded-full text-[var(--text-muted)] hover:text-var(--color-delhi-emerald) transition-colors" title="Portfolio">
              <Globe className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      
      <div className="mt-16 text-center text-[10px] font-mono text-slate-600 uppercase tracking-widest border-t border-[var(--border-light)] pt-8">
        Designed & Built by 𝔭𝔞𝔯𝔱𝔥
      </div>
    </footer>
  );
}
