import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export default function ImageWithFallback({ src, alt, fallbackText, className, ...props }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Generate a deterministic gradient based on the text
  const text = fallbackText || alt || 'Delhi';
  const charCode = text.charCodeAt(0) || 0;
  const gradients = [
    'from-orange-900/40 via-slate-900 to-slate-900',
    'from-emerald-900/40 via-slate-900 to-slate-900',
    'from-indigo-900/40 via-slate-900 to-slate-900',
    'from-rose-900/40 via-slate-900 to-slate-900',
    'from-amber-900/40 via-slate-900 to-slate-900',
  ];
  const bgGradient = gradients[charCode % gradients.length];

  if (error || !src) {
    return (
      <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${bgGradient} text-[var(--text-muted)] overflow-hidden ${className} border border-[var(--border-light)]`}>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="z-10 flex flex-col items-center p-6 text-center">
          <ImageIcon className="w-6 h-6 mb-3 opacity-30" />
          <span className="text-xs uppercase tracking-[0.3em] font-mono opacity-60">
            {text}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Placeholder before load */}
      {!loaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
}
