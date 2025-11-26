'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Zap, Brain, Network, ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem, fadeInUp } from '@/lib/animations';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Zap,
    title: 'Visual Intelligence',
    description: 'See your entire digital workspace as a living knowledge graph. Discover hidden patterns and connections across all your tools.',
    color: '#FFB800',
    gradient: 'from-[#FFB800] to-[#FF6B00]',
  },
  {
    icon: Brain,
    title: 'AI Orchestration',
    description: 'Autonomous agents that understand context across all your tools. They work in the background, surfacing insights when you need them.',
    color: '#00FFA3',
    gradient: 'from-[#00FFA3] to-[#00E0FF]',
  },
  {
    icon: Network,
    title: 'Unified Context',
    description: 'One place to see everything, connected intelligently. No more tab switching, no more context loss. Pure flow state.',
    color: '#8B5CF6',
    gradient: 'from-[#8B5CF6] to-[#FF006E]',
  },
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-100px' });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* Card background */}
      <div className="relative h-full p-8 rounded-3xl bg-bg-elevated/40 backdrop-blur-xl border border-white/5 overflow-hidden transition-all duration-500 group-hover:border-white/10 group-hover:-translate-y-2">
        
        {/* Gradient orb */}
        <motion.div
          className={`absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br ${feature.gradient} opacity-0 blur-[60px] group-hover:opacity-20 transition-opacity duration-500`}
        />

        {/* Icon container */}
        <motion.div
          className="relative w-16 h-16 rounded-2xl mb-6 flex items-center justify-center overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${feature.color}15, ${feature.color}05)` }}
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {/* Icon glow */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at center, ${feature.color}40, transparent 70%)`,
            }}
          />
          
          <Icon
            className="w-8 h-8 relative z-10 transition-colors duration-300"
            style={{ color: feature.color }}
          />
          
          {/* Animated border */}
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ borderColor: `${feature.color}40` }}
            animate={{
              boxShadow: [
                `0 0 0px ${feature.color}00`,
                `0 0 20px ${feature.color}40`,
                `0 0 0px ${feature.color}00`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300" 
          style={{ 
            backgroundImage: `linear-gradient(135deg, white, ${feature.color})`,
          }}
        >
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-300">
          {feature.description}
        </p>

        {/* Learn more link */}
        <motion.div
          className="flex items-center gap-2 mt-6 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ color: feature.color }}
        >
          <span>Learn more</span>
          <ArrowRight className="w-4 h-4" />
        </motion.div>

        {/* Bottom gradient line */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
          }}
        />
      </div>
    </motion.div>
  );
};

export const Features: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-void to-bg-void" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block px-4 py-2 rounded-full text-sm font-medium text-accent-energy bg-accent-energy/10 border border-accent-energy/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Why Entropy?
          </motion.span>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for the way you{' '}
            <span className="gradient-text-energy">actually</span> work
          </h2>
          
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Stop juggling tabs. Stop losing context. Start seeing the full picture
            of your digital workspace.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/40 text-sm">
            Join 1,000+ knowledge workers who&apos;ve transformed their workflow
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;

