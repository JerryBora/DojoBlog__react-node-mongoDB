import React, { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';

const Background = () => {
  const { isDarkMode } = useTheme();
  const [bubbles, setBubbles] = useState(() => Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 20 + Math.random() * 40,
    speed: 0.5 + Math.random() * 1,
    angle: Math.random() * Math.PI * 2,
    opacity: 0.4 + Math.random() * 0.4
  })));

  const updateBubblePosition = useCallback((bubble, mouseX, mouseY) => {
    const dx = mouseX - bubble.x;
    const dy = mouseY - bubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const repelRadius = 150;

    if (distance < repelRadius) {
      const force = (1 - distance / repelRadius) * 15;
      const angle = Math.atan2(dy, dx);
      return {
        ...bubble,
        x: bubble.x - Math.cos(angle) * force,
        y: bubble.y - Math.sin(angle) * force,
        opacity: Math.max(0.2, bubble.opacity - 0.1)
      };
    }

    const newX = bubble.x + Math.cos(bubble.angle) * bubble.speed;
    const newY = bubble.y + Math.sin(bubble.angle) * bubble.speed;

    if (newX < -50) return { ...bubble, x: window.innerWidth + 50 };
    if (newX > window.innerWidth + 50) return { ...bubble, x: -50 };
    if (newY < -50) return { ...bubble, y: window.innerHeight + 50 };
    if (newY > window.innerHeight + 50) return { ...bubble, y: -50 };

    return {
      ...bubble,
      x: newX,
      y: newY,
      opacity: Math.min(bubble.opacity + 0.02, 0.8)
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      setBubbles(prevBubbles =>
        prevBubbles.map(bubble => updateBubblePosition(bubble, mouseX, mouseY))
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [updateBubblePosition]);

  // Define theme-specific colors
  const lightModeBackground = 'linear-gradient(to bottom, rgba(248, 237, 235, 0.8), rgba(252, 213, 206, 0.3))';
  const darkModeBackground = 'linear-gradient(to bottom, rgba(42, 42, 42, 0.9), rgba(58, 50, 56, 0.7))';
  
  const lightModeBubbleGradient = 'radial-gradient(circle at 30% 30%, rgba(252, 213, 206, 0.6), rgba(252, 213, 206, 0.2))';
  const darkModeBubbleGradient = 'radial-gradient(circle at 30% 30%, rgba(110, 69, 85, 0.4), rgba(58, 50, 56, 0.2))';
  
  const lightModeShadow = '0 4px 16px rgba(110, 69, 85, 0.15)';
  const darkModeShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: -1,
      overflow: 'hidden',
      background: isDarkMode ? darkModeBackground : lightModeBackground
    }}>
      {bubbles.map(bubble => (
        <div
          key={bubble.id}
          style={{
            position: 'absolute',
            left: `${bubble.x}px`,
            top: `${bubble.y}px`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: isDarkMode ? darkModeBubbleGradient : lightModeBubbleGradient,
            borderRadius: '50%',
            opacity: bubble.opacity,
            transform: `scale(${1 + Math.sin(Date.now() * 0.001 + bubble.id) * 0.1})`,
            transition: 'opacity 0.3s ease-out',
            boxShadow: isDarkMode ? darkModeShadow : lightModeShadow,
            backdropFilter: 'blur(4px)'
          }}
        />
      ))}
    </div>
  );
};

export default Background;