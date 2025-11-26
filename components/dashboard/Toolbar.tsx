'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  LayoutGrid,
  SlidersHorizontal,
  Settings,
} from 'lucide-react';
import { useGraphStore } from '@/lib/store';

interface ToolbarButtonProps {
  icon: React.ElementType;
  onClick: () => void;
  tooltip: string;
  disabled?: boolean;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  icon: Icon,
  onClick,
  tooltip,
  disabled = false,
}) => {
  return (
    <motion.button
      className={`
        relative w-10 h-10 flex items-center justify-center rounded-xl
        transition-all duration-200
        ${disabled 
          ? 'text-white/20 cursor-not-allowed' 
          : 'text-white/50 hover:text-white hover:bg-white/10'
        }
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.95 }}
      title={tooltip}
    >
      <Icon className="w-5 h-5" />
    </motion.button>
  );
};

const Divider: React.FC = () => (
  <div className="w-px h-6 bg-white/10" />
);

interface ToolbarProps {
  onOpenSettings?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenSettings }) => {
  const {
    zoomLevel,
    setZoom,
    fitView,
    autoLayout,
    toggleFilterPanel,
  } = useGraphStore();

  return (
    <motion.div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-bg-elevated/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-dramatic">
        {/* Fit View */}
        <ToolbarButton
          icon={Maximize2}
          onClick={fitView}
          tooltip="Fit to View (F)"
        />

        <Divider />

        {/* Zoom Controls */}
        <ToolbarButton
          icon={ZoomOut}
          onClick={() => setZoom(zoomLevel - 0.2)}
          tooltip="Zoom Out (-)"
          disabled={zoomLevel <= 0.2}
        />
        
        <motion.div
          className="w-16 text-center text-sm text-white/60 font-mono"
          key={Math.round(zoomLevel * 100)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(zoomLevel * 100)}%
        </motion.div>
        
        <ToolbarButton
          icon={ZoomIn}
          onClick={() => setZoom(zoomLevel + 0.2)}
          tooltip="Zoom In (+)"
          disabled={zoomLevel >= 3}
        />

        <Divider />

        {/* Layout & Filter */}
        <ToolbarButton
          icon={LayoutGrid}
          onClick={autoLayout}
          tooltip="Auto Layout (L)"
        />
        
        <ToolbarButton
          icon={SlidersHorizontal}
          onClick={toggleFilterPanel}
          tooltip="Filter (Ctrl+F)"
        />

        <Divider />

        {/* Settings */}
        <ToolbarButton
          icon={Settings}
          onClick={() => onOpenSettings?.()}
          tooltip="Graph Settings"
        />
      </div>

      {/* Keyboard shortcuts hint */}
      <motion.div
        className="mt-3 text-center text-xs text-white/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Scroll to zoom • Drag to pan • Click node for details
      </motion.div>
    </motion.div>
  );
};

export default Toolbar;

