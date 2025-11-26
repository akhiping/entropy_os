'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  FileText,
  CheckCircle,
  Cpu,
  Folder,
  Calendar,
  Clock,
} from 'lucide-react';
import { useGraphStore, useFilteredNodes } from '@/lib/store';
import { Node, NodeType } from '@/lib/types';
import { staggerContainer, staggerItem } from '@/lib/animations';

const nodeIcons: Record<NodeType, React.ElementType> = {
  repo: GitBranch,
  doc: FileText,
  task: CheckCircle,
  ai_agent: Cpu,
  misc: Folder,
};

const nodeColors: Record<NodeType, string> = {
  repo: '#8B9FFF',
  doc: '#FF9FE5',
  task: '#6FDDFF',
  ai_agent: '#5FFFB1',
  misc: '#FFD54F',
};

interface TimelineGroup {
  label: string;
  items: Node[];
}

// Helper to parse relative time strings
const parseRelativeTime = (timeStr: string | undefined): Date => {
  if (!timeStr) return new Date(0);
  
  const now = new Date();
  const lower = timeStr.toLowerCase();
  
  if (lower.includes('hour')) {
    const hours = parseInt(lower) || 1;
    return new Date(now.getTime() - hours * 60 * 60 * 1000);
  }
  if (lower.includes('day')) {
    const days = parseInt(lower) || 1;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  }
  if (lower.includes('week')) {
    const weeks = parseInt(lower) || 1;
    return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);
  }
  if (lower.includes('month')) {
    const months = parseInt(lower) || 1;
    return new Date(now.getTime() - months * 30 * 24 * 60 * 60 * 1000);
  }
  
  return new Date(0);
};

const getTimeCategory = (node: Node): string => {
  const timeStr = node.metadata.lastEdited || node.metadata.lastCommit;
  if (!timeStr) return 'Older';
  
  const lower = timeStr.toLowerCase();
  
  if (lower.includes('hour') || lower.includes('just')) return 'Today';
  if (lower.includes('1 day') || lower.includes('yesterday')) return 'Yesterday';
  if (lower.includes('2 day') || lower.includes('3 day') || lower.includes('4 day') || 
      lower.includes('5 day') || lower.includes('6 day')) return 'This Week';
  if (lower.includes('week') && parseInt(lower) <= 1) return 'This Week';
  if (lower.includes('week') && parseInt(lower) <= 4) return 'This Month';
  if (lower.includes('month') && parseInt(lower) <= 1) return 'This Month';
  
  return 'Older';
};

const categoryOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];

export const TimelineView: React.FC = () => {
  const { selectNode, selectedNodeId } = useGraphStore();
  const filteredNodes = useFilteredNodes();

  const groupedNodes = useMemo(() => {
    const groups: Record<string, Node[]> = {};
    
    // Sort nodes by time
    const sortedNodes = [...filteredNodes].sort((a, b) => {
      const timeA = parseRelativeTime(a.metadata.lastEdited || a.metadata.lastCommit);
      const timeB = parseRelativeTime(b.metadata.lastEdited || b.metadata.lastCommit);
      return timeB.getTime() - timeA.getTime();
    });

    // Group by time category
    sortedNodes.forEach((node) => {
      const category = getTimeCategory(node);
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(node);
    });

    // Convert to array and sort by category order
    return categoryOrder
      .filter((cat) => groups[cat]?.length > 0)
      .map((cat) => ({
        label: cat,
        items: groups[cat],
      }));
  }, [filteredNodes]);

  return (
    <div className="absolute inset-0 pt-16 pb-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1a1a2e]/80 via-bg-void to-bg-void pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent-energy/10 border border-accent-energy/20 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-accent-energy" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Activity Timeline</h2>
            <p className="text-white/50 text-sm">
              Track changes and updates across your workspace
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
          <motion.div
            className="relative"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent-energy via-accent-frost to-white/10" />

            <AnimatePresence mode="popLayout">
              {groupedNodes.map((group, groupIndex) => (
                <TimelineGroup
                  key={group.label}
                  group={group}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={selectNode}
                  isFirst={groupIndex === 0}
                />
              ))}
            </AnimatePresence>

            {groupedNodes.length === 0 && (
              <motion.div
                className="flex flex-col items-center justify-center py-20 text-white/40"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Clock className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">No activity yet</p>
                <p className="text-sm">Your timeline will appear here</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

interface TimelineGroupProps {
  group: TimelineGroup;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  isFirst: boolean;
}

const TimelineGroup: React.FC<TimelineGroupProps> = ({
  group,
  selectedNodeId,
  onSelectNode,
  isFirst,
}) => {
  return (
    <motion.div variants={staggerItem} className="mb-8">
      {/* Group header */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-full border-4 border-bg-void flex items-center justify-center ${
            isFirst ? 'bg-accent-energy' : 'bg-white/10'
          }`}
        >
          <Calendar className={`w-5 h-5 ${isFirst ? 'text-bg-void' : 'text-white/60'}`} />
        </div>
        <h3 className="text-lg font-semibold text-white">{group.label}</h3>
        <span className="text-white/40 text-sm">
          {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Group items */}
      <div className="ml-6 pl-10 border-l-0 space-y-3">
        {group.items.map((node) => (
          <TimelineItem
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onSelect={() => onSelectNode(node.id)}
          />
        ))}
      </div>
    </motion.div>
  );
};

interface TimelineItemProps {
  node: Node;
  isSelected: boolean;
  onSelect: () => void;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ node, isSelected, onSelect }) => {
  const Icon = nodeIcons[node.type];
  const color = nodeColors[node.type];

  return (
    <motion.div
      onClick={onSelect}
      className={`
        relative flex items-start gap-4 p-4 rounded-xl border cursor-pointer
        transition-all duration-200
        ${isSelected
          ? 'bg-white/10 border-accent-energy/50 shadow-lg shadow-accent-energy/10'
          : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
        }
      `}
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Timeline dot */}
      <div
        className="absolute -left-[26px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-bg-void"
        style={{ backgroundColor: color }}
      />

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h4 className="text-white font-medium truncate">{node.title}</h4>
            <p className="text-white/50 text-sm line-clamp-2 mt-0.5">
              {node.description}
            </p>
          </div>
          <span className="text-white/40 text-xs whitespace-nowrap flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {node.metadata.lastEdited || node.metadata.lastCommit || 'Unknown'}
          </span>
        </div>

        {/* Tags/metadata */}
        <div className="flex items-center gap-2 mt-2">
          {node.metadata.language && (
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60">
              {node.metadata.language}
            </span>
          )}
          {node.metadata.progress !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent-frost rounded-full"
                  style={{ width: `${node.metadata.progress}%` }}
                />
              </div>
              <span className="text-xs text-white/40">{node.metadata.progress}%</span>
            </div>
          )}
          {node.connections && node.connections.length > 0 && (
            <span className="text-xs text-white/40">
              {node.connections.length} connections
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default TimelineView;

