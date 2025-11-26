'use client';

import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Github, Play, ChevronDown } from 'lucide-react';
import Button from '@/components/ui/Button';
import { staggerContainer, staggerItem, textReveal } from '@/lib/animations';
import Link from 'next/link';

// Animated counter component
const AnimatedCounter: React.FC<{ target: number; duration?: number }> = ({ 
  target, 
  duration = 2 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setCount(Math.floor(target * progress));
        requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
};

// Floating particle component
const Particle: React.FC<{ delay: number }> = ({ delay }) => {
  const randomX = Math.random() * 100;
  const randomDuration = 15 + Math.random() * 10;
  
  return (
    <motion.div
      className="absolute w-1 h-1 bg-accent-energy/30 rounded-full"
      style={{ left: `${randomX}%`, bottom: '-10px' }}
      animate={{
        y: [0, -window.innerHeight - 100],
        opacity: [0, 1, 1, 0],
        scale: [0.5, 1, 1, 0.5],
      }}
      transition={{
        duration: randomDuration,
        repeat: Infinity,
        delay,
        ease: 'linear',
      }}
    />
  );
};

export const Hero: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Logos for social proof
  const logos = [
    { name: 'GitHub', opacity: 0.6 },
    { name: 'Notion', opacity: 0.5 },
    { name: 'Linear', opacity: 0.5 },
    { name: 'Figma', opacity: 0.5 },
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-mesh-animated" />
      
      {/* Gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-accent-void/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent-plasma/15 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-accent-frost/10 rounded-full blur-[80px]"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Particle key={i} delay={i * 0.5} />
        ))}
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
        style={{ y, opacity }}
      >
        {/* Eyebrow text */}
        <motion.p
          className="text-accent-energy text-sm font-medium tracking-[0.2em] uppercase mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          The Operating System for Knowledge Work
        </motion.p>

        {/* Main heading with staggered animation */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="mb-8"
        >
          <motion.h1
            variants={textReveal}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold leading-[1.05] tracking-tight"
          >
            <span className="gradient-text">Your Digital World,</span>
          </motion.h1>
          <motion.h1
            variants={textReveal}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[80px] font-bold leading-[1.05] tracking-tight mt-2"
          >
            <span className="text-white">Visualized.</span>
          </motion.h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed"
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Connect your tools. See the invisible connections.
          <br className="hidden sm:block" />
          Let AI orchestrate your work.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Link href="/auth/signup">
            <Button
              variant="primary"
              size="lg"
              icon={Github}
              className="min-w-[200px]"
            >
              Connect GitHub
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="lg"
            icon={Play}
            className="min-w-[200px]"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Social proof */}
        <motion.div
          className="flex flex-col items-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <p className="text-sm text-white/40">
            Trusted by{' '}
            <span className="text-accent-energy font-semibold">
              <AnimatedCounter target={1000} />+
            </span>{' '}
            developers at
          </p>
          <motion.div
            className="flex items-center gap-8"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {logos.map((logo, index) => (
              <motion.div
                key={logo.name}
                variants={staggerItem}
                className="text-white/40 font-semibold text-lg"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
                style={{ opacity: logo.opacity }}
              >
                {logo.name}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="flex flex-col items-center gap-2 text-white/30"
        >
          <span className="text-xs uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

