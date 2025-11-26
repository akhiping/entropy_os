'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Palette,
  Zap,
  Eye,
  Grid3X3,
  MousePointer,
  Volume2,
  Moon,
  Sun,
} from 'lucide-react';
import { modalVariants, backdropVariants } from '@/lib/animations';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  icon: React.ElementType;
}

const SettingToggle: React.FC<SettingToggleProps> = ({
  label,
  description,
  enabled,
  onChange,
  icon: Icon,
}) => (
  <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-white/60" />
    </div>
    <div className="flex-1">
      <h4 className="text-white font-medium">{label}</h4>
      <p className="text-white/50 text-sm mt-0.5">{description}</p>
    </div>
    <button
      onClick={() => onChange(!enabled)}
      className={`
        relative w-12 h-7 rounded-full transition-colors duration-200
        ${enabled ? 'bg-accent-energy' : 'bg-white/20'}
      `}
    >
      <motion.div
        className="absolute top-1 w-5 h-5 rounded-full bg-white shadow-md"
        animate={{ left: enabled ? '24px' : '4px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  </div>
);

interface SettingSliderProps {
  label: string;
  description: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  icon: React.ElementType;
}

const SettingSlider: React.FC<SettingSliderProps> = ({
  label,
  description,
  value,
  min,
  max,
  onChange,
  icon: Icon,
}) => (
  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-colors">
    <div className="flex items-start gap-4 mb-4">
      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-white/60" />
      </div>
      <div className="flex-1">
        <h4 className="text-white font-medium">{label}</h4>
        <p className="text-white/50 text-sm mt-0.5">{description}</p>
      </div>
      <span className="text-accent-energy font-mono text-sm">{value}%</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
        [&::-webkit-slider-thumb]:appearance-none
        [&::-webkit-slider-thumb]:w-4
        [&::-webkit-slider-thumb]:h-4
        [&::-webkit-slider-thumb]:rounded-full
        [&::-webkit-slider-thumb]:bg-accent-energy
        [&::-webkit-slider-thumb]:shadow-lg
        [&::-webkit-slider-thumb]:cursor-pointer
        [&::-webkit-slider-thumb]:transition-transform
        [&::-webkit-slider-thumb]:hover:scale-110"
    />
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  // Settings state
  const [showAnimations, setShowAnimations] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [magneticCursor, setMagneticCursor] = useState(true);
  const [soundEffects, setSoundEffects] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [nodeOpacity, setNodeOpacity] = useState(100);
  const [edgeOpacity, setEdgeOpacity] = useState(50);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-bg-void/60 backdrop-blur-sm z-50"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            variants={backdropVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="w-full max-w-lg bg-bg-elevated/98 backdrop-blur-xl rounded-2xl border border-white/10 shadow-dramatic overflow-hidden"
              variants={modalVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-void/20 border border-accent-void/30 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-accent-void" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Graph Settings</h2>
                    <p className="text-white/50 text-sm">Customize your workspace</p>
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
                {/* Appearance */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Appearance
                  </h3>
                  <div className="space-y-3">
                    <SettingToggle
                      icon={darkMode ? Moon : Sun}
                      label="Dark Mode"
                      description="Use dark theme for the interface"
                      enabled={darkMode}
                      onChange={setDarkMode}
                    />
                    <SettingSlider
                      icon={Eye}
                      label="Node Opacity"
                      description="Adjust the visibility of graph nodes"
                      value={nodeOpacity}
                      min={20}
                      max={100}
                      onChange={setNodeOpacity}
                    />
                    <SettingSlider
                      icon={Eye}
                      label="Edge Opacity"
                      description="Adjust the visibility of connections"
                      value={edgeOpacity}
                      min={10}
                      max={100}
                      onChange={setEdgeOpacity}
                    />
                  </div>
                </div>

                {/* Interactions */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Interactions
                  </h3>
                  <div className="space-y-3">
                    <SettingToggle
                      icon={Zap}
                      label="Animations"
                      description="Enable smooth animations and transitions"
                      enabled={showAnimations}
                      onChange={setShowAnimations}
                    />
                    <SettingToggle
                      icon={MousePointer}
                      label="Magnetic Cursor"
                      description="Nodes attract towards cursor on hover"
                      enabled={magneticCursor}
                      onChange={setMagneticCursor}
                    />
                    <SettingToggle
                      icon={Volume2}
                      label="Sound Effects"
                      description="Play subtle sounds for interactions"
                      enabled={soundEffects}
                      onChange={setSoundEffects}
                    />
                  </div>
                </div>

                {/* Display */}
                <div>
                  <h3 className="text-sm font-medium text-white/60 mb-3 flex items-center gap-2">
                    <Grid3X3 className="w-4 h-4" />
                    Display
                  </h3>
                  <div className="space-y-3">
                    <SettingToggle
                      icon={Grid3X3}
                      label="Show Grid"
                      description="Display background grid pattern"
                      enabled={showGrid}
                      onChange={setShowGrid}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
                <button
                  onClick={() => {
                    setShowAnimations(true);
                    setShowGrid(true);
                    setMagneticCursor(true);
                    setSoundEffects(false);
                    setDarkMode(true);
                    setNodeOpacity(100);
                    setEdgeOpacity(50);
                  }}
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  Reset to defaults
                </button>
                <motion.button
                  onClick={onClose}
                  className="px-6 py-2 bg-accent-energy text-bg-void font-medium rounded-xl"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Done
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;

