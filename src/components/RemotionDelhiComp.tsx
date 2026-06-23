import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, spring } from 'remotion';

export const DelhiComp: React.FC = () => {
  const { fps, width, height } = useVideoConfig();
  const frame = Math.floor(useCurrentFrame() % (fps * 10)); // 10 second loop

  // Animated skyline paths (abstract)
  const drawSkyline1 = interpolate(frame, [0, 60], [0, 100], { extrapolateRight: 'clamp' });
  const drawSkyline2 = interpolate(frame, [20, 80], [0, 100], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  
  const opacity = interpolate(Math.abs(frame - 150), [0, 150], [0.8, 0.4]);

  return (
    <AbsoluteFill style={{ backgroundColor: '#0F172A', overflow: 'hidden' }}>
      {/* Background glow */}
      <div 
        style={{ 
          position: 'absolute', 
          top: '30%', 
          left: '20%', 
          width: '50%', 
          height: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(255,153,51,0.15) 0%, rgba(0,0,0,0) 70%)',
          filter: 'blur(40px)'
        }} 
      />
      
      {/* Moving Particles */}
      {Array.from({ length: 20 }).map((_, i) => {
        const xOffset = (i * 153) % width;
        const yOffset = (i * 92) % height;
        const yAnim = (yOffset - frame * (i % 3 + 1)) % height;
        const glowOpacity = Math.sin(frame / 30 + i) * 0.5 + 0.5;

        return (
          <div 
            key={i}
            style={{
              position: 'absolute',
              left: xOffset,
              top: yAnim < 0 ? height + yAnim : yAnim,
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: '#00B1D2',
              opacity: glowOpacity * 0.6,
              boxShadow: '0 0 10px #00B1D2'
            }}
          />
        );
      })}

      {/* Abstract vector skyline */}
      <svg 
        viewBox="0 0 1000 300"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          opacity
        }}
        preserveAspectRatio="none"
      >
        <path
          d="M0 300 L0 150 L50 150 L50 200 L120 200 L120 180 L140 180 L140 100 L160 100 L160 180 L200 180 L200 130 L250 130 L250 220 L300 220 L300 160 L320 160 L320 180 L400 180 L400 80 L440 80 L440 250 L500 250 L500 190 L550 190 L550 120 L600 120 L600 200 L700 200 L700 150 L750 150 L750 280 L850 280 L850 170 L900 170 L900 260 L950 260 L950 190 L1000 190 L1000 300 Z"
          fill="none"
          stroke="url(#grad2)"
          strokeWidth="3"
          strokeDasharray="4000"
          strokeDashoffset={interpolate(drawSkyline2, [0, 100], [4000, 0])}
        />
        <path
          d="M0 300 L0 200 L80 200 L80 120 L180 120 L180 250 L280 250 L280 160 L380 160 L380 280 L480 280 L480 180 L580 180 L580 220 L680 220 L680 100 L780 100 L780 260 L880 260 L880 140 L1000 140 L1000 300 Z"
          fill="rgba(15, 23, 42, 0.8)"
          stroke="url(#grad1)"
          strokeWidth="2"
          strokeDasharray="4000"
          strokeDashoffset={interpolate(drawSkyline1, [0, 100], [4000, 0])}
        />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF9933" />
            <stop offset="50%" stopColor="#D42835" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00B1D2" />
            <stop offset="100%" stopColor="#0A8B58" />
          </linearGradient>
        </defs>
      </svg>
    </AbsoluteFill>
  );
};
