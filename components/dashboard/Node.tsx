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

// Intense neon colors matching the edges
const nodeConfig: Record<NodeTypeEnum, {
  icon: React.ElementType;
  gradient: string;
  glowColor: string;
  borderColor: string;
  neonColor: string;
  label: string;
}> = {
  repo: {
    icon: GitBranch,
    gradient: 'from-[#A855F7] to-[#7C3AED]',
    glowColor: 'rgba(168, 85, 247, 1)',
    borderColor: '#A855F7',
    neonColor: '#A855F7',
    label: 'Repository',
  },
  doc: {
    icon: FileText,
    gradient: 'from-[#FF00FF] to-[#FF1493]',
    glowColor: 'rgba(255, 0, 255, 1)',
    borderColor: '#FF00FF',
    neonColor: '#FF00FF',
    label: 'Document',
  },
  task: {
    icon: CheckCircle,
    gradient: 'from-[#00FFFF] to-[#00CED1]',
    glowColor: 'rgba(0, 255, 255, 1)',
    borderColor: '#00FFFF',
    neonColor: '#00FFFF',
    label: 'Task',
  },
  ai_agent: {
    icon: Cpu,
    gradient: 'from-[#00FF88] to-[#00CC6A]',
    glowColor: 'rgba(0, 255, 136, 1)',
    borderColor: '#00FF88',
    neonColor: '#00FF88',
    label: 'AI Agent',
  },
  misc: {
    icon: Folder,
    gradient: 'from-[#FFD700] to-[#FFA500]',
    glowColor: 'rgba(255, 215, 0, 1)',
    borderColor: '#FFD700',
    neonColor: '#FFD700',
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

  const scale = isSelected ? 1.15 : isHovered ? 1.1 : 1;
  const glowOpacity = isSelected ? 1 : isHovered ? 0.9 : 0.7;

  return (
    <motion.g
      ref={nodeRef}
      transform={`translate(${x}, ${y})`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{
        scale: isDragging ? 1.1 : scale,
        opacity: isDimmed ? 0.4 : 1,
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
      {/* Intense neon glow filter definition */}
      <defs>
        <filter id={`neon-node-${node.id}`} x="-150%" y="-150%" width="400%" height="400%">
          <feFlood floodColor={config.neonColor} floodOpacity="1" result="flood" />
          <feComposite in="flood" in2="SourceGraphic" operator="in" result="mask" />
          <feGaussianBlur in="mask" stdDeviation="8" result="blur1" />
          <feGaussianBlur in="mask" stdDeviation="16" result="blur2" />
          <feGaussianBlur in="mask" stdDeviation="24" result="blur3" />
          <feMerge>
            <feMergeNode in="blur3" />
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`node-bg-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(20, 20, 30, 0.95)" />
          <stop offset="100%" stopColor="rgba(10, 10, 15, 0.98)" />
        </linearGradient>
        <linearGradient id={`node-stroke-${node.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={config.borderColor} stopOpacity={1} />
          <stop offset="50%" stopColor={config.borderColor} stopOpacity={0.8} />
          <stop offset="100%" stopColor={config.borderColor} stopOpacity={1} />
        </linearGradient>
      </defs>

      {/* Outer intense glow */}
      <motion.ellipse
        cx={0}
        cy={0}
        rx={100}
        ry={70}
        fill={config.neonColor}
        initial={{ opacity: 0.4, scale: 1 }}
        animate={{
          opacity: glowOpacity * 0.7,
          scale: isSelected || isHovered ? 1.4 : 1.2,
        }}
        transition={{ duration: 0.3 }}
        style={{ filter: 'blur(40px)' }}
      />

      {/* Middle glow */}
      <motion.ellipse
        cx={0}
        cy={0}
        rx={75}
        ry={52}
        fill={config.neonColor}
        initial={{ opacity: 0.6, scale: 1 }}
        animate={{
          opacity: glowOpacity * 0.85,
          scale: isSelected || isHovered ? 1.2 : 1.1,
        }}
        transition={{ duration: 0.3 }}
        style={{ filter: 'blur(20px)' }}
      />

      {/* Inner glow */}
      <motion.ellipse
        cx={0}
        cy={0}
        rx={60}
        ry={42}
        fill={config.neonColor}
        initial={{ opacity: 0.7, scale: 1 }}
        animate={{
          opacity: glowOpacity,
          scale: isSelected || isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.3 }}
        style={{ filter: 'blur(10px)' }}
      />

      {/* Node body - hexagonal/organic shape with intense neon border */}
      <motion.path
        d="M-60,-25 Q-65,0 -60,25 L-40,40 Q0,50 40,40 L60,25 Q65,0 60,-25 L40,-40 Q0,-50 -40,-40 Z"
        fill={`url(#node-bg-${node.id})`}
        stroke={config.borderColor}
        strokeWidth={isSelected ? 5 : 4}
        filter={`url(#neon-node-${node.id})`}
        animate={{
          strokeWidth: isSelected ? 5 : isHovered ? 4.5 : 4,
        }}
        transition={{ duration: 0.2 }}
        style={{ filter: `drop-shadow(0 0 15px ${config.neonColor}) drop-shadow(0 0 30px ${config.neonColor})` }}
      />
      
      {/* Additional bright core stroke */}
      <path
        d="M-60,-25 Q-65,0 -60,25 L-40,40 Q0,50 40,40 L60,25 Q65,0 60,-25 L40,-40 Q0,-50 -40,-40 Z"
        fill="none"
        stroke="white"
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />

      {/* Type badge with neon glow */}
      <g transform="translate(-50, -35)">
        <rect
          x={0}
          y={0}
          width={35}
          height={16}
          rx={8}
          fill="rgba(0,0,0,0.6)"
          stroke={config.borderColor}
          strokeWidth={1}
          style={{ filter: `drop-shadow(0 0 4px ${config.neonColor})` }}
        />
        <foreignObject x={4} y={2} width={28} height={14}>
          <div className="flex items-center justify-center h-full">
            <Icon className="w-3 h-3" style={{ color: config.neonColor, filter: `drop-shadow(0 0 4px ${config.neonColor})` }} />
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
            <div className="flex items-center gap-0.5 text-white/70">
              <Star className="w-2.5 h-2.5 fill-accent-solar text-accent-solar" />
              <span className="text-[9px] font-medium">{node.metadata.stars}</span>
            </div>
          )}
          {node.metadata.language && (
            <span className="text-[9px] text-white/70 font-medium">{node.metadata.language}</span>
          )}
          {node.metadata.lastCommit && (
            <div className="flex items-center gap-0.5 text-white/70">
              <Clock className="w-2.5 h-2.5" />
              <span className="text-[9px] font-medium">{node.metadata.lastCommit.split(' ')[0]}</span>
            </div>
          )}
          {node.metadata.progress !== undefined && (
            <div className="flex items-center gap-1">
              <div className="w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent-frost rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${node.metadata.progress}%` }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>
              <span className="text-[9px] text-white/70 font-medium">{node.metadata.progress}%</span>
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

      {/* AI Agent special effects - more intense */}
      {node.type === 'ai_agent' && (
        <>
          <motion.circle
            r={75}
            fill="none"
            stroke={config.neonColor}
            strokeWidth={2}
            strokeDasharray="8 4"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: 'center', filter: `drop-shadow(0 0 8px ${config.neonColor})` }}
          />
          <motion.circle
            r={5}
            fill={config.neonColor}
            animate={{
              cx: [0, 40, 0, -40, 0],
              cy: [-50, 0, 50, 0, -50],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ filter: `drop-shadow(0 0 10px ${config.neonColor})` }}
          />
        </>
      )}

      {/* Selected indicator ring - intense neon */}
      {isSelected && (
        <motion.ellipse
          cx={0}
          cy={0}
          rx={80}
          ry={62}
          fill="none"
          stroke={config.neonColor}
          strokeWidth={3}
          strokeDasharray="12 6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotate: [0, 360],
          }}
          transition={{
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 },
            rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          }}
          style={{ transformOrigin: 'center', filter: `drop-shadow(0 0 12px ${config.neonColor})` }}
        />
      )}
    </motion.g>
  );
};

export default GraphNode;

