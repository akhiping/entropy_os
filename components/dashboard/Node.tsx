'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  GitBranch,
  FileText,
  CheckCircle,
  Cpu,
  Folder,
  Star,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Node as NodeType, NodeType as NodeTypeEnum } from '@/lib/types';

interface GraphNodeProps {
  node: NodeType;
  x: number;
  y: number;
  isSelected: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  isDragging: boolean;
  onSelect: () => void;
  onHover: (hovered: boolean) => void;
  onDragStart: (e: React.MouseEvent) => void;
  onDrag: (e: React.MouseEvent) => void;
  onDragEnd: () => void;
}

const nodeConfig: Record<NodeTypeEnum, {
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  label: string;
}> = {
  repo: {
    icon: GitBranch,
    gradient: 'from-[#667eea] to-[#764ba2]',
    glowColor: 'rgba(102, 126, 234, 0.5)',
    label: 'Repository',
  },
  doc: {
    icon: FileText,
    gradient: 'from-[#f093fb] to-[#f5576c]',
    glowColor: 'rgba(240, 147, 251, 0.5)',
    label: 'Document',
  },
  task: {
    icon: CheckCircle,
    gradient: 'from-[#4facfe] to-[#00f2fe]',
    glowColor: 'rgba(79, 172, 254, 0.5)',
    label: 'Task',
  },
  ai_agent: {
    icon: Cpu,
    gradient: 'from-[#43e97b] to-[#38f9d7]',
    glowColor: 'rgba(67, 233, 123, 0.5)',
    label: 'AI Agent',
  },
  misc: {
    icon: Folder,
    gradient: 'from-[#FFB800] to-[#FF8C00]',
    glowColor: 'rgba(255, 184, 0, 0.5)',
    label: 'Misc',
  },
};

export const GraphNode: React.FC<GraphNodeProps> = ({
  node,
  x,
  y,
  isSelected,
  isHovered,
  isDimmed,
  isDragging,
  onSelect,
  onHover,
  onDragStart,
  onDrag,
  onDragEnd,
}) => {
  const config = nodeConfig[node.type];
  const Icon = config.icon;
  const nodeRef = useRef<SVGGElement>(null);
  const [localDragging, setLocalDragging] = useState(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalDragging(true);
    onDragStart(e);
  }, [onDragStart]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (localDragging) {
      onDrag(e);
    }
  }, [localDragging, onDrag]);

  const handleMouseUp = useCallback(() => {
    if (localDragging) {
      setLocalDragging(false);
      onDragEnd();
    }
  }, [localDragging, onDragEnd]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!localDragging) {
      onSelect();
    }
  }, [localDragging, onSelect]);

  // Get status icon for tasks
  const getStatusIndicator = () => {
    if (node.type !== 'task') return null;
    
    const priority = node.metadata.priority;
    if (priority === 'critical') {
      return <AlertCircle className="w-3 h-3 text-accent-plasma" />;
    }
    return null;
  };

  const scale = isSelected ? 1.12 : isHovered ? 1.08 : 1;
  const glowOpacity = isSelected ? 0.6 : isHovered ? 0.4 : 0.1;

  return (
    <motion.g
      ref={nodeRef}
      transform={`translate(${x}, ${y})`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDragging ? 1.1 : scale,
        opacity: isDimmed ? 0.3 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      style={{ cursor: isDragging ? 'grabbing' : 'pointer' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        handleMouseUp();
        onHover(false);
      }}
      onMouseEnter={() => onHover(true)}
      onClick={handleClick}
    >
      {/* Glow effect */}
      <motion.ellipse
        cx={0}
        cy={0}
        rx={70}
        ry={50}
        fill={config.glowColor}
        initial={{ opacity: 0.1, scale: 1 }}
        animate={{
          opacity: glowOpacity,
          scale: isSelected || isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ filter: 'blur(20px)' }}
      />

      {/* Node body - hexagonal/organic shape */}
      <motion.path
        d="M-60,-25 Q-65,0 -60,25 L-40,40 Q0,50 40,40 L60,25 Q65,0 60,-25 L40,-40 Q0,-50 -40,-40 Z"
        fill="url(#node-bg)"
        stroke={`url(#node-stroke-${node.type})`}
        strokeWidth={isSelected ? 3 : 2}
        animate={{
          strokeWidth: isSelected ? 3 : isHovered ? 2.5 : 2,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Inner gradient definitions */}
      <defs>
        <linearGradient id="node-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(28, 28, 36, 0.95)" />
          <stop offset="100%" stopColor="rgba(20, 20, 25, 0.98)" />
        </linearGradient>
        <linearGradient id={`node-stroke-${node.type}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.glowColor.replace('0.5', '0.8')} />
          <stop offset="50%" stopColor={config.glowColor.replace('0.5', '0.4')} />
          <stop offset="100%" stopColor={config.glowColor.replace('0.5', '0.8')} />
        </linearGradient>
      </defs>

      {/* Type badge */}
      <g transform="translate(-50, -35)">
        <rect
          x={0}
          y={0}
          width={35}
          height={16}
          rx={8}
          fill="rgba(0,0,0,0.4)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={0.5}
        />
        <foreignObject x={4} y={2} width={28} height={14}>
          <div className="flex items-center justify-center h-full">
            <Icon className="w-3 h-3" style={{ color: config.glowColor.replace('0.5', '1') }} />
          </div>
        </foreignObject>
      </g>

      {/* Title */}
      <foreignObject x={-55} y={-15} width={110} height={30}>
        <div className="flex items-center justify-center h-full px-1">
          <span
            className="text-[12px] font-semibold text-white text-center leading-tight truncate w-full"
            title={node.title}
          >
            {node.title.length > 14 ? `${node.title.slice(0, 14)}...` : node.title}
          </span>
        </div>
      </foreignObject>

      {/* Metadata row */}
      <foreignObject x={-50} y={12} width={100} height={20}>
        <div className="flex items-center justify-center gap-2 h-full">
          {node.metadata.stars !== undefined && (
            <div className="flex items-center gap-0.5 text-white/40">
              <Star className="w-2.5 h-2.5 fill-accent-solar text-accent-solar" />
              <span className="text-[9px]">{node.metadata.stars}</span>
            </div>
          )}
          {node.metadata.language && (
            <span className="text-[9px] text-white/40">{node.metadata.language}</span>
          )}
          {node.metadata.lastCommit && (
            <div className="flex items-center gap-0.5 text-white/40">
              <Clock className="w-2.5 h-2.5" />
              <span className="text-[9px]">{node.metadata.lastCommit.split(' ')[0]}</span>
            </div>
          )}
          {node.metadata.progress !== undefined && (
            <div className="flex items-center gap-1">
              <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-frost rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${node.metadata.progress}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
              <span className="text-[9px] text-white/40">{node.metadata.progress}%</span>
            </div>
          )}
          {getStatusIndicator()}
        </div>
      </foreignObject>

      {/* Connection count indicator */}
      <g transform="translate(45, -35)">
        <circle r={10} fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.1)" strokeWidth={0.5} />
        <text
          x={0}
          y={0}
          textAnchor="middle"
          dominantBaseline="central"
          className="text-[9px] fill-white/60 font-medium"
        >
          {node.connections?.length || 0}
        </text>
      </g>

      {/* AI Agent special effects */}
      {node.type === 'ai_agent' && (
        <>
          <motion.circle
            r={65}
            fill="none"
            stroke={config.glowColor}
            strokeWidth={1}
            strokeDasharray="4 4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center' }}
          />
          <motion.circle
            r={3}
            fill={config.glowColor.replace('0.5', '1')}
            animate={{
              cx: [0, 30, 0, -30, 0],
              cy: [-40, 0, 40, 0, -40],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        </>
      )}

      {/* Selected indicator ring */}
      {isSelected && (
        <motion.ellipse
          cx={0}
          cy={0}
          rx={70}
          ry={55}
          fill="none"
          stroke={config.glowColor.replace('0.5', '0.6')}
          strokeWidth={2}
          strokeDasharray="8 4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [0, 360],
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
            rotate: { duration: 30, repeat: Infinity, ease: 'linear' },
          }}
          style={{ transformOrigin: 'center' }}
        />
      )}
    </motion.g>
  );
};

export default GraphNode;

