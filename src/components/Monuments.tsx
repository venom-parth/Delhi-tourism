import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Info } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const monuments = [
  {
    id: "red-fort",
    name: "Red Fort",
    period: "1639",
    desc: "The iconic red sandstone fort that was the main residence of Mughal emperors.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/3840px-Delhi_fort.jpg",
    verify: "Ticket required. Closed on Mondays."
  },
  {
    id: "india-gate",
    name: "India Gate",
    period: "1931",
    desc: "A majestic war memorial archway situated on the Rajpath. Stunning when illuminated.",
    image: "https://upload.wikimedia.org/wikipedia/commons/7/75/India_Gate_%28All_India_War_Memorial%29.jpg",
    verify: "Open public space. Free entry."
  },
  {
    id: "qutub-minar",
    name: "Qutub Minar",
    period: "1192",
    desc: "A towering 73-meter high tower of victory intricately carved with floral motifs.",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Qutb_Minar_2022.jpg/3840px-Qutb_Minar_2022.jpg",
    verify: "Ticket required. Open sunrise to sunset."
  },
  {
    id: "lotus-temple",
    name: "Lotus Temple",
    period: "1986",
    desc: "A Bahá'í House of Worship famous for its elegant flower-like, white marble shape.",
    image: "https://upload.wikimedia.org/wikipedia/commons/f/fc/LotusDelhi.jpg",
    verify: "Free entry. Closed on Mondays."
  },
  {
    id: "akshardham",
    name: "Akshardham",
    period: "2005",
    desc: "A sprawling temple complex showcasing millennia of traditional culture and architecture.",
    image: "https://akshardham.com/newdelhi/wp-content/uploads/2015/05/akshardham_monument_with_sarovar-002.jpg",
    verify: "Free entry. Closed Mondays. No photography."
  }
];

export default function Monuments() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.monument-header', {
        y: 30, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' }
      });
      
      gsap.from('.monument-list-item', {
        x: 50, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: listRef.current, start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="monuments" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-24 z-20 bg-[var(--bg-main)]">
      <div className="container mx-auto max-w-7xl">
        <div className="monument-header flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
           <div>
              <p className="font-mono text-xs tracking-[0.2em] text-var(--color-delhi-saffron) uppercase mb-4">Historical Archives</p>
              <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[var(--text-main)] leading-[0.9]">
                Echoes of <br/> <span className="text-stroke-hover cursor-default">Empires</span>
              </h2>
           </div>
           <p className="max-w-xs text-sm text-[var(--text-muted)]">
              Hover through the landmarks that have shaped the aesthetic and historical foundation of the capital.
           </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Sticky Image Reveal */}
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] relative rounded-[32px] overflow-hidden border border-[var(--border-main)] order-2 lg:order-1">
             {monuments.map((m, i) => (
                <div 
                  key={m.id} 
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeIdx === i ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                   <ImageWithFallback 
                     src={m.image} 
                     alt={m.name} 
                     className="w-full h-full object-cover filter contrast-125 transition-transform duration-[2s] scale-105"
                     style={{ transform: activeIdx === i ? 'scale(1)' : 'scale(1.05)' }}
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                   
                   {/* Verification tag inside image */}
                   <div className="absolute bottom-8 left-8 right-8 flex items-start gap-3 p-4 bento-panel backdrop-blur-md">
                     <Info className="w-5 h-5 text-var(--color-delhi-blue) shrink-0 mt-0.5" />
                     <div>
                       <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-bold mb-1">Verify before travel</p>
                       <p className="text-sm text-[var(--text-main)]">{m.verify}</p>
                     </div>
                   </div>
                </div>
             ))}
          </div>

          {/* Interactive typography list */}
          <div ref={listRef} className="w-full lg:w-1/2 flex flex-col justify-center gap-0 order-1 lg:order-2">
            {monuments.map((m, i) => (
              <div 
                key={m.id}
                onMouseEnter={() => setActiveIdx(i)}
                className={`monument-list-item group flex flex-col py-6 border-b border-[var(--border-light)] cursor-pointer transition-all duration-300 ${activeIdx === i ? 'opacity-100 pl-4' : 'opacity-40 hover:opacity-70'}`}
              >
                <div className="flex justify-between items-baseline mb-2">
                   <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold uppercase tracking-tight text-[var(--text-main)] group-hover:text-var(--color-delhi-saffron) transition-colors">
                     {m.name}
                   </h3>
                   <span className="font-mono text-xs text-[var(--text-muted)] tracking-widest">{m.period}</span>
                </div>
                <div className={`overflow-hidden transition-all duration-500 ${activeIdx === i ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                   <p className="text-sm text-[var(--text-muted)] max-w-md pt-2 pb-4">
                     {m.desc}
                   </p>
                   <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-main)] tracking-widest uppercase">
                      Inspect <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </section>
  );
}
