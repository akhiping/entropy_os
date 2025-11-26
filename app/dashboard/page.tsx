'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import DashboardNavbar from '@/components/dashboard/Navbar';
import GraphCanvas from '@/components/dashboard/GraphCanvas';
import NodeDetail from '@/components/dashboard/NodeDetail';
import AIChat from '@/components/dashboard/AIChat';
import CommandPalette from '@/components/dashboard/CommandPalette';
import Toolbar from '@/components/dashboard/Toolbar';
import FilterPanel from '@/components/dashboard/FilterPanel';
import { useGraphStore } from '@/lib/store';

export default function DashboardPage() {
  const { toggleCommandPalette, toggleAIChat } = useGraphStore();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette: Cmd+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      
      // AI Chat: Cmd+I
      if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
        e.preventDefault();
        toggleAIChat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleCommandPalette, toggleAIChat]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-bg-void">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 bg-mesh pointer-events-none" />

      {/* Main navigation */}
      <DashboardNavbar />

      {/* Main content area - graph canvas */}
      <main className="absolute inset-0 pt-16">
        <GraphCanvas />
      </main>

      {/* Toolbar */}
      <Toolbar />

      {/* Side panels */}
      <NodeDetail />

      {/* Overlays */}
      <AIChat />
      <CommandPalette />
      <FilterPanel />

      {/* Welcome toast - shows once */}
      <WelcomeToast />
    </div>
  );
}

// Welcome toast component
const WelcomeToast: React.FC = () => {
  const [show, setShow] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      className="fixed top-20 right-6 z-30"
      initial={{ opacity: 0, y: -20, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-start gap-4 p-4 bg-bg-elevated/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-dramatic max-w-sm">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-energy/20 to-accent-frost/20 border border-accent-energy/20 flex items-center justify-center shrink-0">
          <span className="text-xl">✨</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">Welcome to Entropy</h4>
          <p className="text-sm text-white/60 leading-relaxed">
            Your knowledge graph is ready. Press{' '}
            <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-xs font-mono">⌘K</kbd>
            {' '}to search, or click any node to explore.
          </p>
        </div>
        <button
          className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          onClick={() => setShow(false)}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

