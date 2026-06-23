import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, Map, Navigation, Train, ShieldAlert, 
  Info, Leaf, Clock, MapPin, Eye, Radio, RefreshCw 
} from 'lucide-react';
import gsap from 'gsap';

// Interface for Landmarks on the map
interface Landmark {
  id: string;
  name: string;
  type: 'heritage' | 'gardens' | 'markets' | 'modern';
  lat: number;
  lng: number;
  x: number; // SVG X (0 - 1000)
  y: number; // SVG Y (0 - 800)
  color: string;
  year: string;
  builtBy: string;
  metric: string;
  description: string;
  trivia: string[];
  metroLine: string;
}

// Interface for Delhi Districts (regions)
interface District {
  id: string;
  name: string;
  color: string;
  hoverColor: string;
  description: string;
  path: string; // SVG path
  centerText: { x: number; y: number };
}

export default function DelhiInteractiveMap() {
  const [activeLayer, setActiveLayer] = useState<'grid' | 'metro' | 'heritage' | 'eco'>('grid');
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<Landmark | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<District | null>(null);
  const [scanSpeed, setScanSpeed] = useState<number>(3); // seconds for full sweep
  const [showRadar, setShowRadar] = useState<boolean>(true);
  const [coords, setCoords] = useState({ lat: 28.6139, lng: 77.2090, x: 500, y: 390 });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalLandmark, setActiveModalLandmark] = useState<Landmark | null>(null);
  const [activeModalFact, setActiveModalFact] = useState<string>('');
  
  const mapSvgRef = useRef<SVGSVGElement>(null);
  const infoPanelRef = useRef<HTMLDivElement>(null);

  // Landmarks Data
  const landmarks: Landmark[] = [
    {
      id: 'red-fort',
      name: 'Red Fort (Lal Qila)',
      type: 'heritage',
      lat: 28.6562,
      lng: 77.2410,
      x: 771,
      y: 373,
      color: '#E60000', // Saffron-Crimson
      year: '1648 AD',
      builtBy: 'Emperor Shah Jahan',
      metric: 'Octagonal Layout • 2.4km walls',
      description: 'The monumental fort of the Mughal Empire, built with red sandstones, hosting the iconic Lahore Gate where the Independence Day flag is hoisted.',
      trivia: [
        'Built when Shah Jahan decided to shift his capital from Agra to Delhi (Shahjahanabad).',
        'The Peacock Throne once resided here in the Diwan-i-Khas before being looted.',
        'Its design represents the pinnacle of Mughal creativity blending Persian & Timurid art.'
      ],
      metroLine: 'Chandni Chowk / Lal Quila (Violet/Yellow Line)'
    },
    {
      id: 'qutub-minar',
      name: 'Qutub Minar',
      type: 'heritage',
      lat: 28.5244,
      lng: 77.1855,
      x: 664,
      y: 593,
      color: '#FF6B00', // Saffron
      year: '1199 AD',
      builtBy: 'Qutb al-Din Aibak',
      metric: '72.5m Tall • 5 tiers',
      description: 'The tallest brick minaret in the world, an masterpiece of early Indo-Islamic architecture, adorned with intricate geometric carvings and Quranic verses.',
      trivia: [
        'Each tier has a distinctive style, completed by different rulers over centuries.',
        'An iron pillar inside the complex has stood rust-free for over 1,600 years.',
        'Features a slight convergence tilt (only 2.9 degrees from vertical).'
      ],
      metroLine: 'Qutub Minar (Yellow Line)'
    },
    {
      id: 'india-gate',
      name: 'India Gate',
      type: 'modern',
      lat: 28.6129,
      lng: 77.2295,
      x: 749,
      y: 445,
      color: '#00E5FF', // Blue
      year: '1931 AD',
      builtBy: 'Edwin Lutyens',
      metric: '42m High Triumphal Arch',
      description: 'The monumental war memorial situated along the ceremonial Rajpath, honoring the soldiers of the British Indian Army who died in World War I.',
      trivia: [
        'Inspired by the famous Arc de Triomphe in Paris.',
        'Underneath burns the Amar Jawan Jyoti, the eternal flame for unrecognized fallen heroes.',
        'Constructed using pink and yellow Bharatpur sandstone.'
      ],
      metroLine: 'Central Secretariat (Yellow/Violet Line)'
    },
    {
      id: 'humayun-tomb',
      name: "Humayun's Tomb",
      type: 'heritage',
      lat: 28.5933,
      lng: 77.2507,
      x: 790,
      y: 478,
      color: '#FFD600', // Gold
      year: '1570 AD',
      builtBy: 'Empress Bega Begum',
      metric: 'First Garden-Tomb of India',
      description: 'The patron tomb of Emperor Humayun, which pioneered the grand Mughal double-dome geometry and Charbagh (four-quadrant garden) landscaping.',
      trivia: [
        'Directly inspired the architectural design of the Taj Mahal in Agra.',
        'Contains over 150 graves of the Mughal royal family, earned title "Necropolis of Mughals".',
        'Restored back to pristine glory in 2013 via advanced stone masonry projects.'
      ],
      metroLine: 'JLN Stadium (Violet Line)'
    },
    {
      id: 'lotus-temple',
      name: 'Lotus Temple',
      type: 'modern',
      lat: 28.5535,
      lng: 77.2588,
      x: 805,
      y: 544,
      color: '#B000FF', // Purple
      year: '1986 AD',
      builtBy: 'Fariborz Sahba',
      metric: '27 white-marble petals',
      description: 'A Bahá\'í House of Worship notable for its flowerlike lotus shape, serving as a sanctuary of unity where people of all faiths can chant in silent meditation.',
      trivia: [
        'The structure consists of 27 free-standing petals clad in Greek white marble.',
        'Employs natural passive ventilation where cool air rises over pools of water.',
        'One of the most visited buildings in the world, outperforming even the Eiffel Tower.'
      ],
      metroLine: 'Kalkaji Mandir (Violet/Magenta Line)'
    },
    {
      id: 'akshardham',
      name: 'Swaminarayan Akshardham',
      type: 'modern',
      lat: 28.6127,
      lng: 77.2773,
      x: 841,
      y: 445,
      color: '#00E676', // Emerald
      year: '2005 AD',
      builtBy: 'BAPS Swaminarayan Sanstha',
      metric: '141ft High • 20,000 murtis',
      description: 'A colossal modern temple complex built without structural steel, showcasing millennia of traditional Hindu culture, spirituality, and ornate stone craftsmanship.',
      trivia: [
        'Built entirely of pink sandstones from Rajasthan and Italian Carrara marbles.',
        'Features an IMAX screen, a musical fountain, and a 12-minute boat ride of Indian history.',
        'Holds the Guinness World Record for the World\'s Largest Comprehensive Hindu Temple.'
      ],
      metroLine: 'Akshardham (Blue Line)'
    },
    {
      id: 'chandni-chowk',
      name: 'Chandni Chowk',
      type: 'markets',
      lat: 28.6560,
      lng: 77.2300,
      x: 750,
      y: 373,
      color: '#FFEA00', // Yellow
      year: '1650 AD',
      builtBy: 'Jahanara Begum (Shah Jahan\'s daughter)',
      metric: 'Density Index: Extreme',
      description: 'One of Delhi\'s oldest and busiest wholesale markets, famous for rich street food, exotic spices, wedding textiles, and silver jewelry.',
      trivia: [
        'Originally designed with canals containing reflecting pools that glowed under moonlight.',
        'Houses religious places of five major world religions on its central main high street.',
        'Home to "Paranthe Wali Gali", which has served deep-fried stuffed flatbreads since 1870.'
      ],
      metroLine: 'Chandni Chowk (Yellow Line)'
    },
    {
      id: 'sunder-nursery',
      name: 'Sunder Nursery',
      type: 'gardens',
      lat: 28.5910,
      lng: 77.2440,
      x: 777,
      y: 482,
      color: '#00D1B2', // Teal
      year: '2018 AD (Restored)',
      builtBy: 'Aga Khan Trust for Culture',
      metric: '90 Acres • 300+ tree species',
      description: 'A beautifully restored 16th-century heritage park complex containing six grand Mughal monuments, ecological trails, and botanical rare species gardens.',
      trivia: [
        'Originally called "Azim Bagh", built during the Mughal era alongside Humayun\'s Tomb.',
        'Restored from a neglected nursery into a world-class heritage garden.',
        'Named by TIME Magazine as one of the World\'s 100 Greatest Places in 2018.'
      ],
      metroLine: 'JLN Stadium (Violet Line)'
    }
  ];

  // Delhi Districts Polygons
  const districts: District[] = [
    {
      id: 'north',
      name: 'North Delhi',
      color: 'rgba(230,0,0,0.05)',
      hoverColor: 'rgba(230,0,0,0.18)',
      description: 'The ancient Mughal capital "Shahjahanabad", dense narrow lanes, extreme culinary legacy, and Delhi University campus.',
      path: 'M550,50 L750,80 L800,250 L770,350 L600,350 L500,200 Z',
      centerText: { x: 650, y: 200 }
    },
    {
      id: 'central-new',
      name: 'New Delhi (Lutyens)',
      color: 'rgba(0,229,255,0.05)',
      hoverColor: 'rgba(0,229,255,0.18)',
      description: 'Designed by Sir Edwin Lutyens, featuring wide tree-lined boulevards, government ministries, high-class bungalows, and India Gate.',
      path: 'M600,350 L770,350 L810,480 L650,550 L550,450 Z',
      centerText: { x: 680, y: 450 }
    },
    {
      id: 'south',
      name: 'South Delhi',
      color: 'rgba(255,107,0,0.05)',
      hoverColor: 'rgba(255,107,0,0.18)',
      description: 'A wealthy sector home to iconic monuments, ruins of ancient cities (Lal Kot, Siri, Jahanpanah), high-end cafes, and lush forests.',
      path: 'M650,550 L810,480 L860,650 L750,780 L550,700 Z',
      centerText: { x: 700, y: 650 }
    },
    {
      id: 'east',
      name: 'East Delhi (Trans-Yamuna)',
      color: 'rgba(0,230,118,0.05)',
      hoverColor: 'rgba(0,230,118,0.18)',
      description: 'Lying east of the Yamuna floodplains, dense development hubs, historic markets, and the monumental Akshardham temple.',
      path: 'M770,350 L950,380 L980,500 L860,650 L810,480 Z',
      centerText: { x: 880, y: 450 }
    },
    {
      id: 'west',
      name: 'West Delhi',
      color: 'rgba(255,214,0,0.05)',
      hoverColor: 'rgba(255,214,0,0.18)',
      description: 'Vibrant urban expansions, major residential spaces, shopping avenues, industrial estates, and robust Punjabi cultural centers.',
      path: 'M300,400 L550,450 L650,550 L550,700 L350,600 L200,500 Z',
      centerText: { x: 400, y: 520 }
    },
    {
      id: 'north-west',
      name: 'North West Delhi',
      color: 'rgba(176,0,255,0.04)',
      hoverColor: 'rgba(176,0,255,0.14)',
      description: 'The largest sub-city expansions, featuring modern educational institutes, Rohini sub-city, and sprawling agricultural-urban boundaries.',
      path: 'M250,150 L500,200 L600,350 L550,450 L300,400 L150,300 Z',
      centerText: { x: 380, y: 280 }
    }
  ];

  // Calculate mouse coordinate overlays based on SVG viewpoint
  const handleMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!mapSvgRef.current) return;
    const rect = mapSvgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1000;
    const y = ((e.clientY - rect.top) / rect.height) * 800;

    // Linearly map SVG coordinates to Delhi bounding box
    // Delhi approximately fits in: Lat 28.40N to 28.88N, Lng 76.84E to 77.36E
    const mappedLat = 28.88 - (y / 800) * 0.48;
    const mappedLng = 76.84 + (x / 1000) * 0.52;

    setCoords({
      lat: Number(mappedLat.toFixed(4)),
      lng: Number(mappedLng.toFixed(4)),
      x: Math.round(x),
      y: Math.round(y)
    });
  };

  const handleLandmarkClick = (landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setSearchQuery('');
    
    // Animate view focus effect using custom GSAP if needed
    if (infoPanelRef.current) {
      gsap.fromTo(infoPanelRef.current, 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }
      );
    }
  };

  const filteredLandmarks = searchQuery.trim() 
    ? landmarks.filter(l => l.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : landmarks;

  return (
    <div className="w-full flex flex-col xl:flex-row gap-6 p-4 md:p-6 bg-[var(--bg-sec)] rounded-2xl border border-[var(--border-light)] overflow-hidden shadow-2xl relative min-h-[580px]">
      
      {/* Dynamic Digital Scanner Background and Grids */}
      <div className="absolute inset-x-0 bottom-0 top-0 bg-[linear-gradient(rgba(18,18,24,0.4)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,24,0.4)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-25"></div>
      
      {/* 1. Sidebar Control Panel */}
      <div className="w-full xl:w-[350px] flex flex-col justify-between z-10 gap-6">
        
        {/* Layer Selectors */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-[var(--border-light)] pb-3">
            <Compass className="w-5 h-5 text-var(--color-delhi-saffron) animate-spin-slow" />
            <h4 className="font-display font-bold uppercase tracking-widest text-sm text-[var(--text-main)]">Navigation Deck</h4>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'grid', label: 'Tactical Grid', desc: 'Vector layout & sonar', icon: Eye, color: 'text-var(--color-delhi-blue)' },
              { id: 'metro', label: 'Metro Spine', desc: 'Animated urban transit', icon: Train, color: 'text-var(--color-delhi-purple)' },
              { id: 'heritage', label: 'Heritage Axis', desc: 'Dynasty alignments', icon: MapPin, color: 'text-var(--color-delhi-saffron)' },
              { id: 'eco', label: 'Eco Canopy', desc: 'Sunder nursery & Lodi', icon: Leaf, color: 'text-var(--color-delhi-emerald)' },
            ].map(layer => (
              <button
                key={layer.id}
                onClick={() => {
                  setActiveLayer(layer.id as any);
                  if (layer.id === 'heritage') {
                    // Set Red Fort default focus
                    setSelectedLandmark(landmarks[0]);
                  }
                }}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  activeLayer === layer.id 
                    ? 'bg-[var(--overlay)] border-[var(--border-main)] shadow-md ring-1 ring-white/10' 
                    : 'bg-transparent border-[var(--border-light)] hover:bg-white/[0.02] hover:border-[var(--border-main)]'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <layer.icon className={`w-4 h-4 ${layer.color} ${activeLayer === layer.id ? 'animate-pulse' : ''}`} />
                  <span className="text-[11px] font-bold tracking-wider uppercase text-[var(--text-main)]">{layer.label}</span>
                </div>
                <span className="text-[9px] text-[var(--text-muted)] font-mono tracking-tight leading-tight">{layer.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Search / Directory */}
        <div className="space-y-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Golden Landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-sec)] border border-[var(--border-main)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-main)] placeholder-slate-500 focus:outline-none focus:border-var(--color-delhi-blue) transition-colors"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[var(--text-muted)] hover:text-[var(--text-main)] text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="max-h-[160px] overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-white/10 pr-1">
            {filteredLandmarks.map(landmark => (
              <button
                key={landmark.id}
                onClick={() => handleLandmarkClick(landmark)}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all border text-xs ${
                  selectedLandmark?.id === landmark.id 
                    ? 'bg-[var(--overlay)] border-[var(--panel-border-hover)] text-[var(--text-main)] font-bold' 
                    : 'bg-transparent border-transparent hover:bg-white/[0.01] hover:text-[var(--text-main)] text-[var(--text-muted)]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: landmark.color }}></span>
                  <span className="truncate">{landmark.name}</span>
                </div>
                <span className="text-[9px] font-mono opacity-50 px-1 border border-[var(--border-light)] rounded uppercase">{landmark.type}</span>
              </button>
            ))}
            {filteredLandmarks.length === 0 && (
              <div className="text-center py-4 text-xs text-[var(--text-muted)] uppercase tracking-wider font-mono">No structures localized</div>
            )}
          </div>
        </div>

        {/* Realtime Telemetry Grid */}
        <div className="bg-white/[0.01] border border-[var(--border-light)] rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase text-[var(--text-muted)]">
            <span className="flex items-center gap-1"><Radio className="w-3 h-3 text-red-500 animate-pulse" /> Telemetry Stream</span>
            <span>Active Feed</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="bg-white/[0.01] rounded p-2 border border-[var(--border-light)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">GEO LAT</span>
              <span className="text-[var(--text-main)] font-bold tracking-wider">{coords.lat}° N</span>
            </div>
            <div className="bg-white/[0.01] rounded p-2 border border-[var(--border-light)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">GEO LNG</span>
              <span className="text-[var(--text-main)] font-bold tracking-wider">{coords.lng}° E</span>
            </div>
            <div className="bg-white/[0.01] rounded p-2 border border-[var(--border-light)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Alt Range</span>
              <span className="text-[var(--text-main)] text-[10px] font-bold">218m ASL</span>
            </div>
            <div className="bg-white/[0.01] rounded p-2 border border-[var(--border-light)]">
              <span className="text-[var(--text-muted)] block text-[9px] uppercase tracking-wider">Active Region</span>
              <span className="text-var(--color-delhi-saffron) font-bold truncate block">
                {hoveredDistrict ? hoveredDistrict.name : hoveredLandmark ? hoveredLandmark.name.split(' ')[0] : 'Delhi NCR'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono border-t border-[var(--border-light)] pt-2">
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setShowRadar(!showRadar)} 
                className={`px-1.5 py-0.5 rounded text-[9px] transition-colors ${showRadar ? 'bg-var(--color-delhi-blue)/10 text-var(--color-delhi-blue) border border-var(--color-delhi-blue)/20' : 'bg-[var(--overlay)] text-[var(--text-muted)]'}`}
              >
                Scan Sweeper
              </button>
              {showRadar && (
                <span className="flex items-center gap-1 ml-1">
                  <span className="w-1.5 h-1.5 bg-var(--color-delhi-emerald) rounded-full animate-ping"></span>
                  <span className="text-[9px] text-[var(--text-muted)] font-mono tracking-tighter">Sweep speed</span>
                </span>
              )}
            </div>
            <span className="opacity-40">SYSTEM: ONLINE</span>
          </div>
        </div>

      </div>

      {/* 2. Interactive SVG Map Centerpiece */}
      <div className="flex-1 relative flex items-center justify-center bg-[var(--glass-bg)] rounded-xl border border-[var(--border-light)] overflow-hidden group/map cursor-crosshair min-h-[400px] lg:min-h-[500px]">
        
        {/* Scan Sweeper Ray Effect */}
        {showRadar && (
          <div 
            className="absolute inset-y-0 w-[4px] bg-gradient-to-r from-transparent via-var(--color-delhi-blue)/40 to-transparent pointer-events-none z-20 shadow-[0_0_20px_rgba(0,229,255,0.4)]"
            style={{
              left: '0%',
              animation: `laserSweep ${scanSpeed}s linear infinite alternate`
            }}
          />
        )}

        {/* Map Coordinates Cursor Crosshairs */}
        <div 
          className="absolute border-l border-[var(--border-main)] h-full pointer-events-none z-10 transition-all duration-75"
          style={{ left: `${(coords.x / 1000) * 100}%` }}
        />
        <div 
          className="absolute border-t border-[var(--border-main)] w-full pointer-events-none z-10 transition-all duration-75"
          style={{ top: `${(coords.y / 800) * 100}%` }}
        />

        <svg
          ref={mapSvgRef}
          viewBox="0 0 1000 800"
          onMouseMove={handleMapMouseMove}
          className="w-full h-full object-contain filter selection:bg-transparent relative z-10 p-2 select-none"
        >
          {/* Defs to support glowing shadows, patterns, and templates */}
          <defs>
            <filter id="neon-glow-blue" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-glow-saffron" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <radialGradient id="canopy-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(0,230,118,0.25)" />
              <stop offset="70%" stopColor="rgba(0,230,118,0.05)" />
              <stop offset="100%" stopColor="rgba(0,230,118,0)" />
            </radialGradient>
          </defs>

          {/* BACKGROUND TACTICAL BOUNDARY & COORD CIRCLES */}
          <circle cx="500" cy="400" r="380" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="5,10" />
          <circle cx="500" cy="400" r="250" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" strokeDasharray="3,6" />
          <line x1="500" y1="0" x2="500" y2="800" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="10,10" />
          <line x1="0" y1="400" x2="1000" y2="400" stroke="rgba(255,255,255,0.02)" strokeWidth="1" strokeDasharray="10,10" />

          {/* DISTRICTS BASE LAYER (CLICKABLE) */}
          <g id="districts-group">
            {districts.map(dist => (
              <path
                key={dist.id}
                d={dist.path}
                fill={hoveredDistrict?.id === dist.id ? dist.hoverColor : dist.color}
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="1.5"
                strokeLinejoin="round"
                className="transition-all duration-300 cursor-pointer"
                onMouseEnter={() => setHoveredDistrict(dist)}
                onMouseLeave={() => setHoveredDistrict(null)}
              />
            ))}
          </g>

          {/* DELIMITING BORDERS (Tactical outer line) */}
          <path
            d="M550,50 L750,80 L800,250 L950,380 L980,500 L860,650 L750,780 L550,700 L350,600 L200,500 L150,300 L250,150 Z"
            fill="none"
            stroke="rgba(255, 107, 0, 0.15)"
            strokeWidth="3"
            strokeDasharray="8,6"
            className="animate-pulse-slow"
          />

          {/* DYNAMIC LAYER O_1: YAMUNA RIVER FLOW */}
          <g id="river-layer">
            {/* Soft cyan background flow layer */}
            <path
              d="M780,0 C780,100 810,150 800,250 C790,320 770,350 780,410 C790,450 820,550 860,650 C890,750 880,800 880,800"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.08"
            />
            {/* Core current line */}
            <path
              d="M780,0 C780,100 810,150 800,250 C790,320 770,350 780,410 C790,450 820,550 860,650 C890,750 880,800 880,800"
              fill="none"
              stroke="#00E5FF"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="15,10"
              strokeDashoffset="100"
              style={{
                strokeDashoffset: 100,
                animation: 'riverFlow 10s linear infinite'
              }}
              className="filter drop-shadow-[0_0_4px_rgba(0,229,255,0.8)]"
            />
            {/* Label along river curve */}
            <text x="590" y="460" fill="rgba(0,229,255,0.4)" fontSize="9" fontWeight="bold" fontFamily="monospace" letterSpacing="3" transform="rotate(78 590 460)">
              YAMUNA RIVER
            </text>
          </g>

          {/* DYNAMIC LAYER O_2: ECO CANOPY FORESTS */}
          {activeLayer === 'eco' && (
            <g id="eco-canopy-layer">
              {/* Sunder Nursery & Humayun area */}
              <circle cx="777" cy="482" r="75" fill="url(#canopy-grad)" className="animate-pulse-slow font-sans" />
              {/* Lodi Gardens region */}
              <circle cx="730" cy="480" r="55" fill="url(#canopy-grad)" />
              {/* Delhi South Ridge forest */}
              <ellipse cx="600" cy="600" rx="90" ry="45" fill="url(#canopy-grad)" transform="rotate(-30 600 600)" />
              {/* Northern Ridge */}
              <ellipse cx="650" cy="300" rx="60" ry="25" fill="url(#canopy-grad)" transform="rotate(45 650 300)" />
            </g>
          )}

          {/* DYNAMIC LAYER 0_3: METRO SPINE TRACKS AND TRAINS */}
          {activeLayer === 'metro' && (
            <g id="metro-routes" className="opacity-90">
              {/* 1. Yellow Line Route */}
              <path
                id="yellow-line-track"
                d="M650,100 L730,250 L750,373 L745,400 L749,445 L700,520 L664,593 L620,750"
                fill="none"
                stroke="rgba(255,214,0,0.3)"
                strokeWidth="3"
                className="transition-all"
              />
              <path
                d="M650,100 L730,250 L750,373 L745,400 L749,445 L700,520 L664,593 L620,750"
                fill="none"
                stroke="#FFD600"
                strokeWidth="1"
                strokeDasharray="4,8"
                className="animate-pulse"
              />

              {/* 2. Blue Line Route (East-West Suburb Link) */}
              <path
                id="blue-line-track"
                d="M250,500 L450,480 L600,460 L749,445 L800,445 L841,445 L950,420"
                fill="none"
                stroke="rgba(0,110,255,0.3)"
                strokeWidth="3"
              />
              <path
                d="M250,500 L450,480 L600,460 L749,445 L800,445 L841,445 L950,420"
                fill="none"
                stroke="#00E5FF"
                strokeWidth="1"
                strokeDasharray="4,8"
              />

              {/* Running Metro Train - Yellow Line */}
              <circle r="5" fill="#FFD600" filter="url(#neon-glow-saffron)">
                <animateMotion
                  dur="7s"
                  repeatCount="indefinite"
                  path="M650,100 L730,250 L750,373 L745,400 L749,445 L700,520 L664,593 L620,750"
                />
              </circle>

              {/* Running Metro Train 2 - Blue Line */}
              <circle r="5" fill="#00E5FF" filter="url(#neon-glow-blue)">
                <animateMotion
                  dur="6s"
                  repeatCount="indefinite"
                  path="M250,500 L450,480 L600,460 L749,445 L800,445 L841,445 L950,420"
                />
              </circle>
            </g>
          )}

          {/* DYNAMIC LAYER O_4: ANCIENT DYNASTY ALIGNMENTS */}
          {activeLayer === 'heritage' && (
            <g id="heritage-alignments" className="transition-all duration-500">
              {/* Connect Qutub Minar (Sultanate core 1199 AD) to Humayun Tomb to Red Fort (1648 AD Shahjahanabad) */}
              <line 
                x1="664" y1="593" x2="790" y2="478" 
                stroke="rgba(255, 107, 0, 0.4)" 
                strokeWidth="2" 
                strokeDasharray="6,4" 
                className="animate-pulse"
              />
              <line 
                x1="790" y1="478" x2="771" y2="373" 
                stroke="rgba(255, 107, 0, 0.4)" 
                strokeWidth="2" 
                strokeDasharray="6,4" 
                className="animate-pulse"
              />
              <line 
                x1="771" y1="373" x2="750" y2="373" 
                stroke="rgba(255, 107, 0, 0.4)" 
                strokeWidth="1.5" 
                strokeDasharray="4,4" 
              />
              <line 
                x1="749" y1="445" x2="790" y2="478" 
                stroke="rgba(0, 229, 255, 0.3)" 
                strokeWidth="1.5" 
                strokeDasharray="5,5" 
              />

              {/* Text labels about spatial coordinates */}
              <text x="750" y="630" fill="rgba(255,107,0,0.5)" fontSize="8.5" fontFamily="monospace" letterSpacing="1">
                heritage triad alignment: 16.2km
              </text>
            </g>
          )}

          {/* LANDMARK HOTSPOTS (PULSING ACTIVE RADAR NODES) */}
          <g id="landmark-nodes" className="z-30">
            {landmarks.map(landmark => {
              const isSelected = selectedLandmark?.id === landmark.id;
              const isHovered = hoveredLandmark?.id === landmark.id;
              
              return (
                <g 
                  key={landmark.id} 
                  transform={`translate(${landmark.x}, ${landmark.y})`}
                  className="cursor-pointer"
                  onClick={() => handleLandmarkClick(landmark)}
                  onMouseEnter={() => setHoveredLandmark(landmark)}
                  onMouseLeave={() => setHoveredLandmark(null)}
                >
                  {/* Outer expander ripple auras */}
                  <circle 
                    r={isSelected || isHovered ? "28" : "15"}
                    fill="none" 
                    stroke={landmark.color} 
                    strokeWidth="1.5" 
                    opacity={isSelected || isHovered ? "0.45" : "0.15"}
                    className="transition-all duration-300 transform"
                    style={{
                      animation: 'radarPulse 2s cubic-bezier(0.215, 0.610, 0.355, 1) infinite'
                    }}
                  />
                  <circle 
                    r={isSelected || isHovered ? "18" : "9"} 
                    fill="none" 
                    stroke={landmark.color} 
                    strokeWidth="1" 
                    opacity={isSelected || isHovered ? "0.6" : "0.3"}
                    className="transition-all duration-300"
                  />
                  
                  {/* Solid central glowing pin node */}
                  <circle 
                    r={isSelected ? "6" : "4.5"} 
                    fill={landmark.color}
                    className="transition-all duration-300 drop-shadow-[0_0_8px_currentColor]"
                    style={{ color: landmark.color }}
                  />

                  {/* Tiny text labels for pins if hovered or selected */}
                  {(isHovered || isSelected || activeLayer === 'heritage') && (
                    <g transform="translate(12, -12)">
                      <rect 
                        x="0"
                        y="0"
                        width={landmark.name.length * 6.8 + 16} 
                        height="20" 
                        rx="4" 
                        fill="rgba(5, 5, 5, 0.85)" 
                        stroke={landmark.color} 
                        strokeWidth="1"
                        className="backdrop-blur-md"
                      />
                      <text 
                        x="8" 
                        y="14" 
                        fill="#fff" 
                        fontSize="9.5" 
                        fontWeight="bold" 
                        fontFamily="monospace"
                        letterSpacing="1"
                      >
                        {landmark.name.toUpperCase()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Hover quick overlay floating stats box */}
        {hoveredLandmark && (
          <div className="absolute top-4 right-4 z-30 bg-[var(--glass-bg-heavy)] border border-[var(--border-main)] p-3 rounded-lg max-w-[210px] backdrop-blur-md shadow-lg pointer-events-none transition-opacity duration-200">
            <h5 className="font-display font-bold text-[var(--text-main)] text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: hoveredLandmark.color }}></span>
              {hoveredLandmark.name}
            </h5>
            <div className="font-mono text-[9px] text-var(--color-delhi-saffron) mb-1.5">{hoveredLandmark.year} • {hoveredLandmark.builtBy}</div>
            <p className="text-[10px] text-[var(--text-muted)] leading-normal">{hoveredLandmark.description.slice(0, 65)}...</p>
          </div>
        )}

        {/* District Highlight info overlay */}
        {hoveredDistrict && !hoveredLandmark && (
          <div className="absolute top-4 left-4 z-30 bg-[var(--glass-bg-heavy)] border border-[var(--border-main)] p-3 rounded-lg max-w-[210px] backdrop-blur-md shadow-lg pointer-events-none">
            <h5 className="font-display font-medium text-[var(--text-main)] text-[11px] uppercase tracking-widest border-b border-[var(--border-light)] pb-1 mb-1.5">
              {hoveredDistrict.name}
            </h5>
            <p className="text-[10px] text-[var(--text-muted)] leading-normal mb-1">{hoveredDistrict.description}</p>
            <span className="text-[8px] font-mono text-[var(--text-muted)] uppercase">ZONE ID: IN-DL-0{hoveredDistrict.id}</span>
          </div>
        )}

      </div>

      {/* 3. Sleek Interactive Landmark Inspector Panel */}
      <div 
        ref={infoPanelRef} 
        id="inspector-panel"
        className="w-full xl:w-[380px] bg-[var(--glass-bg)] border border-[var(--border-light)] p-5 sm:p-6 rounded-xl flex flex-col justify-between z-10 relative overflow-hidden backdrop-blur-md min-h-[380px]"
      >
        {selectedLandmark ? (
          <div className="space-y-5 h-full flex flex-col justify-between">
            <div>
              {/* Header category badge & title */}
              <div className="flex items-center justify-between pointer-events-none">
                <span className="text-[9px] font-mono font-bold uppercase py-1 px-2.5 rounded bg-[var(--overlay)] text-[var(--text-muted)] border border-[var(--border-light)] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: selectedLandmark.color }}></span>
                  {selectedLandmark.type} CORE
                </span>
                <span className="text-[10px] font-mono opacity-50 tracking-wider">EST. {selectedLandmark.year}</span>
              </div>

              {/* Landmark Title */}
              <h3 className="font-display font-bold text-[var(--text-main)] text-2xl sm:text-3xl tracking-tight mt-3 mb-1 uppercase leading-none">
                {selectedLandmark.name}
              </h3>
              
              <div className="font-mono text-[10px] text-var(--color-delhi-saffron) tracking-widest border-b border-[var(--border-light)] pb-3 mb-4">
                BUILT BY: {selectedLandmark.builtBy.toUpperCase()}
              </div>

              {/* Structural stats */}
              <div className="bg-white/[0.01] border border-[var(--border-light)] rounded-xl p-3.5 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5 font-mono"><Compass className="w-3.5 h-3.5 opacity-60" /> Metrics:</span>
                  <span className="text-[var(--text-main)] font-medium">{selectedLandmark.metric}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5 font-mono"><Train className="w-3.5 h-3.5 opacity-60" /> Metro Link:</span>
                  <span className="text-var(--color-delhi-blue) max-w-[210px] text-right truncate font-mono text-[11px] block">{selectedLandmark.metroLine}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-4">
                {selectedLandmark.description}
              </p>

              {/* Live Trivia/Fun Facts */}
              <div className="mt-5 space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-var(--color-delhi-saffron) animate-pulse" /> Historic Trivia Chronology
                </div>
                <div className="space-y-2">
                  {selectedLandmark.trivia.map((triv, i) => (
                    <div key={i} className="flex gap-2 text-[11px] leading-relaxed text-[var(--text-muted)] bg-white/[0.01] border border-[var(--border-light)] p-2 rounded">
                      <span className="text-var(--color-delhi-blue) font-mono">0{i+1}</span>
                      <span>{triv}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Simulated Action: Generate travel advice / Metro Route map */}
            <div className="border-t border-[var(--border-light)] pt-4 mt-6">
              <button 
                onClick={() => {
                  const randomFact = selectedLandmark.trivia[Math.floor(Math.random() * selectedLandmark.trivia.length)];
                  setActiveModalFact(randomFact);
                  setActiveModalLandmark(selectedLandmark);
                }}
                className="w-full bg-white text-black hover:bg-slate-200 transition-colors py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                <Clock className="w-4 h-4" /> Inspect Metro Transit Coordinates
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center text-center p-6 space-y-5">
            <div className="relative">
              <Compass className="w-12 h-12 text-slate-600 animate-spin-slow" />
              <div className="absolute inset-0 border border-dashed border-[var(--border-main)] rounded-full animate-pulse-slow"></div>
            </div>
            <div>
              <h4 className="font-display font-bold text-[var(--text-main)] uppercase text-sm tracking-widest mb-1.5">No Landmark Selected</h4>
              <p className="text-xs text-[var(--text-muted)] max-w-[240px] mx-auto leading-relaxed">
                Interact with the sonar map pins or search to unlock historical records, Lutyen's alignments, and metro indices.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setSelectedLandmark(landmarks[0])}
                className="px-4 py-1.5 bg-[var(--overlay)] border border-[var(--border-main)] rounded-lg text-[10px] uppercase font-bold tracking-wider hover:bg-[var(--overlay-hover)] text-[var(--text-main)] transition-colors"
              >
                Focus Red Fort
              </button>
              <button 
                onClick={() => setSelectedLandmark(landmarks[1])}
                className="px-4 py-1.5 bg-[var(--overlay)] border border-[var(--border-main)] rounded-lg text-[10px] uppercase font-bold tracking-wider hover:bg-[var(--overlay-hover)] text-[var(--text-main)] transition-colors"
              >
                Focus Qutub Minar
              </button>
            </div>
          </div>
        )}

        {/* Absolute Decorative Tech Accents */}
        <div className="absolute bottom-1 right-2 font-mono text-[8px] tracking-widest opacity-25 uppercase pointer-events-none select-none">
          Holo-Map Ver 4.0.2
        </div>
      </div>

      {/* Cyber-Tactical Transit Modal */}
      {activeModalLandmark && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-[var(--border-main)] rounded-2xl max-w-md w-full p-6 relative overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Hologram Light Ray Effect */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-var(--color-delhi-blue) to-transparent shadow-[0_0_15px_rgba(0,229,255,0.8)]"></div>
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-3 mb-4">
              <span className="text-[10px] font-mono font-bold text-var(--color-delhi-blue) tracking-widest uppercase flex items-center gap-1.5">
                <Train className="w-3.5 h-3.5" /> METRO TRANSIT COORDINATES
              </span>
              <button 
                onClick={() => {
                  setActiveModalLandmark(null);
                  setActiveModalFact('');
                }}
                className="text-[var(--text-muted)] hover:text-[var(--text-main)] font-mono text-xs cursor-pointer border border-[var(--border-main)] rounded px-1.5 py-0.5 hover:bg-[var(--overlay)] transition-colors"
              >
                [CLOSE]
              </button>
            </div>

            {/* Destination Panel */}
            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase block tracking-wider">TACTICAL DESTINATION</span>
                <h4 className="font-display font-black text-[var(--text-main)] text-xl uppercase tracking-tight mt-0.5">
                  {activeModalLandmark.name}
                </h4>
              </div>

              {/* Metro Station and Lines */}
              <div className="bg-slate-950/60 border border-[var(--border-light)] p-4 rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[8px] font-mono text-[var(--text-muted)] uppercase tracking-widest block">RECOMMENDED METRO STATION</span>
                    <span className="text-sm text-[var(--text-main)] font-bold tracking-tight block mt-0.5">
                      {activeModalLandmark.metroLine.split(' (')[0]}
                    </span>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full mt-1.5 animate-ping" style={{ backgroundColor: activeModalLandmark.color }}></span>
                </div>

                <div className="border-t border-[var(--border-light)] pt-2 flex justify-between text-xs">
                  <span className="text-[var(--text-muted)] font-mono">Metro Link Details:</span>
                  <span className="text-var(--color-delhi-blue) font-medium font-mono">{activeModalLandmark.metroLine}</span>
                </div>
              </div>

              {/* Historical Fun Fact */}
              <div className="bg-white/[0.01] border border-[var(--border-light)] p-4 rounded-xl">
                <span className="text-[8px] font-mono text-var(--color-delhi-saffron) uppercase tracking-widest block mb-1">💡 COGNITIVE HISTORICAL TRIVIA</span>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">
                  "{activeModalFact}"
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-6">
              <button 
                onClick={() => {
                  setActiveModalLandmark(null);
                  setActiveModalFact('');
                }}
                className="w-full bg-white text-black hover:bg-slate-200 transition-colors py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
              >
                DISMISS SYSTEM COORDINATES
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
