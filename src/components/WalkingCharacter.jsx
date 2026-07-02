import { useEffect, useRef } from 'react'
import characterImg from '../assets/pix/right.png'

export default function WalkingCharacter() {
  const charRef = useRef(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight - 150;
    let dx = 1;
    let dy = 0.2;
    const speed = 1.2;
    const width = 80;
    const height = 80;

    let animationFrameId;

    const animate = () => {
      x += dx * speed;
      y += dy * speed;

      // Bounce off edges
      if (x <= 0) {
        x = 0;
        dx = Math.abs(dx) || 1;
      } else if (x >= window.innerWidth - width) {
        x = window.innerWidth - width;
        dx = -Math.abs(dx) || -1;
      }

      // 40px taskbar avoidance
      if (y <= 0) {
        y = 0;
        dy = Math.abs(dy) || 1;
      } else if (y >= window.innerHeight - height - 40) { 
        y = window.innerHeight - height - 40;
        dy = -Math.abs(dy) || -1;
      }

      // Random occasional direction change (1% chance per frame)
      if (Math.random() < 0.01) {
        dx += (Math.random() - 0.5) * 0.5;
        dy += (Math.random() - 0.5) * 0.5;
        
        // Normalize velocity vector
        const len = Math.sqrt(dx*dx + dy*dy) || 1;
        dx = dx / len;
        dy = dy / len;
      }

      if (charRef.current) {
        // Apply position via translation for better performance, and flip if moving left
        charRef.current.style.transform = `translate(${x}px, ${y}px) ${dx < 0 ? 'scaleX(-1)' : 'scaleX(1)'}`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <img 
      ref={charRef}
      src={characterImg.src} 
      alt="Walking character" 
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        width: '90px', 
        height: '90px', 
        objectFit: 'contain',
        zIndex: 5, // Above wallpaper, below windows (which usually start at zIndex 10+)
        pointerEvents: 'none',
        willChange: 'transform'
      }} 
    />
  )
}
