'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Network,
  Sparkles,
  Link2,
  RefreshCw,
  Zap,
  Terminal,
  Users,
  Filter,
  Download,
} from 'lucide-react';
import { staggerContainer } from '@/lib/animations';

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: Network,
    title: 'Visual Knowledge Graph',
    description: 'See your entire digital workspace as an interactive, beautiful graph. Every repo, doc, task, and idea connected in one living map.',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    icon: Sparkles,
    title: 'AI Agents That Understand Context',
    description: 'Intelligent agents that see your entire workspace and act across all your tools. Summarize, connect, automate—all from one place.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Link2,
    title: 'Unified Across All Tools',
    description: 'Connect GitHub, Notion, Slack, and more. Entropy creates connections your apps can\'t see on their own.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    icon: RefreshCw,
    title: 'Always Up to Date',
    description: 'Automatic syncing keeps your graph current. Changes in GitHub or Notion appear instantly in your workspace.',
    gradient: 'from-green-500 to-cyan-600',
  },
  {
    icon: Zap,
    title: 'Automate the Boring Stuff',
    description: 'Set up workflows that run automatically. Weekly summaries, blocker detection, status updates—all hands-free.',
    gradient: 'from-yellow-500 to-orange-600',
  },
  {
    icon: Terminal,
    title: 'Keyboard-First Power',
    description: 'Press ⌘K to access everything instantly. Search nodes, run commands, navigate your workspace at the speed of thought.',
    gradient: 'from-gray-500 to-white',
  },
  {
    icon: Users,
    title: 'Built for Teams',
    description: 'Share your graph with teammates. Real-time collaboration, permissions, and shared knowledge—all visual.',
    gradient: 'from-blue-500 to-purple-600',
  },
  {
    icon: Filter,
    title: 'Find What Matters',
    description: 'Filter by type, date, status, or custom tags. Focus on what\'s important, hide the noise.',
    gradient: 'from-purple-500 to-pink-600',
  },
  {
    icon: Download,
    title: 'Your Data, Your Way',
    description: 'Export your graph as JSON, CSV, or images. Full API access for custom integrations and workflows.',
    gradient: 'from-green-500 to-blue-600',
  },
];

const FeatureCard: React.FC<{ feature: Feature; index: number }> = ({ feature, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const Icon = feature.icon;

  return (
    <motion.div
      ref={cardRef}
      className="relative group h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="relative h-full p-8 rounded-2xl bg-white/[0.03] backdrop-blur-lg border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20 hover:-translate-y-2">
        {/* Icon container */}
        <motion.div
          className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} p-[2px] mb-6`}
          animate={{
            y: [0, -4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="w-full h-full rounded-xl bg-bg-void flex items-center justify-center">
            <Icon className="w-7 h-7 text-white" />
          </div>
        </motion.div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-white mb-3">
          {feature.title}
        </h3>

        {/* Description */}
        <p className="text-base text-white/70 leading-relaxed">
          {feature.description}
        </p>

        {/* Hover gradient effect */}
        <motion.div
          className={`absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-br ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
        />
      </div>
    </motion.div>
  );
};

export const FeaturesComplete: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative py-32 px-6 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-void via-[#0f0f1a] to-bg-void" />
      
      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Everything you need to visualize your work
          </h2>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Powerful features that transform how you see and manage your digital workspace
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? 'animate' : 'initial'}
        >
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesComplete;

