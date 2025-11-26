'use client';

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Rocket,
  Plug,
  Brain,
  Map,
  Code,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface DocCard {
  icon: React.ElementType;
  title: string;
  description: string;
  link: string;
}

const docCards: DocCard[] = [
  {
    icon: Rocket,
    title: 'Quick Start',
    description: 'Connect your first integration and see your workspace visualized in under 5 minutes.',
    link: '/docs/quick-start',
  },
  {
    icon: Plug,
    title: 'Integrations',
    description: 'Step-by-step guides for connecting GitHub, Notion, Slack, and more to Entropy.',
    link: '/docs/integrations',
  },
  {
    icon: Brain,
    title: 'AI Agents',
    description: 'Learn how to use pre-built agents and create your own custom workflows.',
    link: '/docs/ai-agents',
  },
  {
    icon: Map,
    title: 'Navigating Your Graph',
    description: 'Master the visual interface, filters, search, and keyboard shortcuts.',
    link: '/docs/navigation',
  },
  {
    icon: Code,
    title: 'API Reference',
    description: 'Full API documentation for building custom integrations and automations.',
    link: '/docs/api',
  },
  {
    icon: CheckCircle,
    title: 'Best Practices',
    description: 'Tips and strategies from power users to get the most out of Entropy.',
    link: '/docs/best-practices',
  },
];

const DocCardComponent: React.FC<{ doc: DocCard; index: number }> = ({ doc, index }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });
  const Icon = doc.icon;

  return (
    <motion.div
      ref={cardRef}
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <a
        href={doc.link}
        className="relative group block h-full"
      >
        <div className="relative h-full p-8 rounded-2xl bg-white/[0.05] backdrop-blur-lg border border-white/10 overflow-hidden transition-all duration-300 hover:border-accent-energy/50 hover:-translate-y-1">
        {/* Icon */}
        <div className="w-10 h-10 rounded-lg bg-accent-energy/10 flex items-center justify-center mb-4 group-hover:bg-accent-energy/20 transition-colors">
          <Icon className="w-5 h-5 text-accent-energy" />
        </div>

        {/* Title */}
        <h3 className="text-2xl font-semibold text-white mb-3 group-hover:text-accent-energy transition-colors">
          {doc.title}
        </h3>

        {/* Description */}
        <p className="text-base text-white/70 leading-relaxed mb-4">
          {doc.description}
        </p>

        {/* Read more link */}
        <div className="flex items-center gap-2 text-sm font-medium text-accent-energy opacity-0 group-hover:opacity-100 transition-opacity">
          <span>Read more</span>
          <ArrowRight className="w-4 h-4" />
        </div>

        {/* Hover glow effect */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-accent-energy/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </a>
    </motion.div>
  );
};

export const DocsPreview: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section
      id="docs"
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Get started in minutes
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Comprehensive documentation and guides to help you make the most of Entropy
          </p>
        </motion.div>

        {/* Documentation cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {docCards.map((doc, index) => (
            <DocCardComponent key={doc.title} doc={doc} index={index} />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.a
            href="/docs"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-white/10 border border-white/20 text-white font-medium hover:bg-white/15 hover:border-accent-energy/50 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            View Full Documentation
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default DocsPreview;

