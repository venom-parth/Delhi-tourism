import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import ImageWithFallback from './ImageWithFallback';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const foodItems = [
  { name: "Chaat", tag: "Street Food", desc: "Crispy, tangy, intensely spiced.", img: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Dahi_puri%2C_Doi_phuchka.jpg" },
  { name: "Kebabs", tag: "Mughlai", desc: "Char-grilled, marinated overnight.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lula_kebab_2.jpg/3840px-Lula_kebab_2.jpg" },
  { name: "Chole Bhature", tag: "Breakfast Classic", desc: "Fluffy fried bread with spicy chickpeas.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Chole_Bhature_from_Nagpur.JPG/3840px-Chole_Bhature_from_Nagpur.JPG" },
  { name: "Butter Chicken", tag: "Iconic", desc: "Velvety tomato gravy, smoky tandoori chicken.", img: "https://upload.wikimedia.org/wikipedia/commons/4/41/Butter_Chicken_%26_Butter_Naan_-_Home_-_Chandigarh_-_India_-_0006.jpg" },
  { name: "Paranthas", tag: "Stuffed Flatbreads", desc: "Deep fried or roasted, served with butter & pickles.", img: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Triangle_paratha_%28cropped%29.JPG" },
  { name: "Jalebi & Rabri", tag: "Dessert", desc: "Crispy sugar-soaked spirals with thickened milk.", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Basavanagudi_Kadalekai_Parishe_%282025%29_Bangalore_%2886%29.jpg/3840px-Basavanagudi_Kadalekai_Parishe_%282025%29_Bangalore_%2886%29.jpg" }
];

export default function Food() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    let ctx = gsap.context(() => {
      // Horizontal Marquee effect on scroll
      gsap.to('.marquee-inner', {
        x: '-20%',
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: 1 }
      });

      gsap.from('.food-box', {
        y: 50, duration: 0.8, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.food-grid', start: 'top 80%' }
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="food" className="py-24 sm:py-32 bg-[var(--bg-main)] overflow-hidden">
      
      {/* Background Marquee */}
      <div className="w-full flex whitespace-nowrap overflow-hidden opacity-[0.03] select-none pointer-events-none mb-12">
         <div className="marquee-inner text-[15vw] font-display font-black uppercase text-[var(--text-main)] tracking-tighter leading-none">
            OLD DELHI SPICE • NEW DELHI DINING • STREET CHAAT • 
         </div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 sm:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[var(--text-main)] leading-[0.9]">
            Culinary <br/> <span className="text-var(--color-delhi-saffron)">Capital</span>
          </h2>
          <p className="max-w-sm text-sm text-[var(--text-muted)] md:text-right">
            A clash of intense spices and rich culinary heritage. Explore the flavors that define the city's streets.
          </p>
        </div>

        <div className="food-grid grid grid-cols-1 md:grid-cols-3 gap-6">
           {foodItems.map((item, i) => (
             <div key={i} className="food-box group bento-panel overflow-hidden h-[450px] relative flex flex-col justify-end p-6">
                <ImageWithFallback
                  src={item.img}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-50 group-hover:brightness-75 group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80" />
                
                <div className="relative z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                   <div className="inline-block px-3 py-1 border border-var(--color-delhi-saffron)/50 text-var(--color-delhi-saffron) text-[10px] font-mono tracking-widest uppercase mb-4 backdrop-blur-md rounded-full">
                     {item.tag}
                   </div>
                   <h3 className="font-display text-3xl font-bold text-[var(--text-main)] uppercase mb-2">
                     {item.name}
                   </h3>
                   <p className="text-sm text-[var(--text-muted)] mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                     {item.desc}
                   </p>
                   <div className="w-10 h-10 rounded-full border border-[var(--border-main)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-white hover:text-black">
                      <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </section>
  );
}
