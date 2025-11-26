'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Bell,
  Grid3X3,
  Network,
  Calendar,
  RefreshCw,
  Settings,
  User,
} from 'lucide-react';
import { useGraphStore } from '@/lib/store';
import Input from '@/components/ui/Input';

const ViewModeButton: React.FC<{
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
  tooltip: string;
}> = ({ icon: Icon, isActive, onClick, tooltip }) => {
  return (
    <motion.button
      className={`
        relative p-2 rounded-lg transition-all duration-200
        ${isActive 
          ? 'bg-white/10 text-accent-energy' 
          : 'text-white/40 hover:text-white/70 hover:bg-white/5'
        }
      `}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={tooltip}
    >
      <Icon className="w-5 h-5" />
      {isActive && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-energy rounded-full"
          layoutId="viewIndicator"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

const SyncStatus: React.FC = () => {
  const { lastSynced, isSyncing, sync } = useGraphStore();
  
  const formatTime = (date: Date | null) => {
    if (!date) return 'Never';
    const diff = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    return `${Math.floor(diff / 60)}h ago`;
  };

  return (
    <motion.button
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
      onClick={sync}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-accent-solar' : 'bg-accent-energy'}`}
        animate={isSyncing ? { scale: [1, 1.2, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <motion.span
        className="text-sm text-white/50"
        animate={isSyncing ? { opacity: [1, 0.5, 1] } : {}}
        transition={{ repeat: Infinity, duration: 1 }}
      >
        {isSyncing ? 'Syncing...' : `Synced ${formatTime(lastSynced)}`}
      </motion.span>
      <RefreshCw
        className={`w-3.5 h-3.5 text-white/40 ${isSyncing ? 'animate-spin' : ''}`}
      />
    </motion.button>
  );
};

export const DashboardNavbar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    toggleAIChat,
    toggleCommandPalette,
  } = useGraphStore();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 h-16 z-40 bg-bg-deep/95 backdrop-blur-xl border-b border-white/5"
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="h-full px-6 flex items-center justify-between gap-6">
        {/* Left side - Logo & Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* Logo */}
          <motion.a
            href="/"
            className="flex items-center gap-2 shrink-0"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-energy to-accent-frost flex items-center justify-center">
              <Network className="w-4 h-4 text-bg-void" />
            </div>
            <span className="font-bold text-white hidden sm:block">Entropy</span>
          </motion.a>

          {/* Search */}
          <div className="w-full max-w-md">
            <div
              className="relative"
              onClick={() => toggleCommandPalette()}
            >
              <Input
                placeholder="Search or type a command..."
                shortcut="⌘K"
                variant="search"
                className="cursor-pointer"
                readOnly
                onFocus={() => {
                  setSearchFocused(true);
                  toggleCommandPalette();
                }}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
          </div>
        </div>

        {/* Center - Sync Status */}
        <div className="hidden md:flex items-center">
          <SyncStatus />
        </div>

        {/* Right side - View Mode & Actions */}
        <div className="flex items-center gap-4">
          {/* View Mode Toggle */}
          <div className="hidden sm:flex items-center gap-1 p-1 bg-white/5 rounded-xl">
            <ViewModeButton
              icon={Network}
              isActive={viewMode === 'graph'}
              onClick={() => setViewMode('graph')}
              tooltip="Graph View"
            />
            <ViewModeButton
              icon={Grid3X3}
              isActive={viewMode === 'list'}
              onClick={() => setViewMode('list')}
              tooltip="List View"
            />
            <ViewModeButton
              icon={Calendar}
              isActive={viewMode === 'timeline'}
              onClick={() => setViewMode('timeline')}
              tooltip="Timeline View"
            />
          </div>

          {/* AI Assistant */}
          <motion.button
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-accent-energy/10 border border-accent-energy/20 text-accent-energy hover:bg-accent-energy/20 transition-colors"
            onClick={toggleAIChat}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium hidden md:block">Ask AI</span>
            <motion.div
              className="absolute -top-1 -right-1 w-2 h-2 bg-accent-energy rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.button>

          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-plasma rounded-full" />
          </motion.button>

          {/* Settings */}
          <motion.button
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors hidden sm:flex"
            whileHover={{ scale: 1.05, rotate: 90 }}
            whileTap={{ scale: 0.95 }}
            transition={{ rotate: { duration: 0.3 } }}
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* Avatar */}
          <motion.button
            className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-void to-accent-plasma flex items-center justify-center overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <User className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
};

export default DashboardNavbar;

