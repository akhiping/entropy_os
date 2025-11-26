'use client';

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: 'glass' | 'solid' | 'gradient' | 'outline';
  hover?: boolean;
  glow?: 'energy' | 'plasma' | 'void' | 'frost' | 'solar' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  hover = true,
  glow = 'none',
  padding = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variantStyles = {
    glass: `
      bg-bg-elevated/60 backdrop-blur-xl
      border border-white/10
    `,
    solid: `
      bg-bg-elevated
      border border-white/5
    `,
    gradient: `
      bg-gradient-to-br from-bg-elevated to-bg-surface
      border border-white/10
    `,
    outline: `
      bg-transparent
      border border-white/20
    `,
  };

  const glowStyles = {
    energy: 'hover:shadow-glow-sm',
    plasma: 'hover:shadow-glow-plasma',
    void: 'hover:shadow-glow-void',
    frost: 'hover:shadow-glow-frost',
    solar: 'hover:shadow-glow-solar',
    none: '',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hover
    ? 'hover:border-white/20 hover:-translate-y-1'
    : '';

  return (
    <motion.div
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${glowStyles[glow]}
        ${paddingStyles[padding]}
        ${hoverStyles}
        ${className}
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={hover ? { scale: 1.01 } : {}}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;

