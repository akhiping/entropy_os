'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch,
  FileText,
  CheckCircle,
  Cpu,
  Folder,
  Star,
  Clock,
  ChevronRight,
  ArrowUpDown,
  Search,
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

const nodeLabels: Record<NodeType, string> = {
  repo: 'Repository',
  doc: 'Document',
  task: 'Task',
  ai_agent: 'AI Agent',
  misc: 'Misc',
};

type SortField = 'title' | 'type' | 'updatedAt' | 'connections';
type SortDirection = 'asc' | 'desc';

export const ListView: React.FC = () => {
  const { selectNode, selectedNodeId } = useGraphStore();
  const filteredNodes = useFilteredNodes();
  
  const [sortField, setSortField] = useState<SortField>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchQuery, setSearchQuery] = useState('');

  const sortedNodes = useMemo(() => {
    let nodes = [...filteredNodes];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      nodes = nodes.filter(
        (n) =>
          n.title.toLowerCase().includes(query) ||
          n.description.toLowerCase().includes(query)
      );
    }

    // Sort
    nodes.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'connections':
          comparison = (a.connections?.length || 0) - (b.connections?.length || 0);
          break;
        case 'updatedAt':
          comparison = (a.metadata.lastEdited || a.metadata.lastCommit || '').localeCompare(
            b.metadata.lastEdited || b.metadata.lastCommit || ''
          );
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return nodes;
  }, [filteredNodes, sortField, sortDirection, searchQuery]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortButton: React.FC<{ field: SortField; label: string }> = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center gap-1 text-xs font-medium transition-colors ${
        sortField === field ? 'text-accent-energy' : 'text-white/50 hover:text-white/70'
      }`}
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="absolute inset-0 pt-16 pb-24 px-6 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-radial from-[#1a1a2e]/80 via-bg-void to-bg-void pointer-events-none" />
      
      <div className="relative z-10 h-full flex flex-col max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">All Items</h2>
            <p className="text-white/50 text-sm mt-1">
              {sortedNodes.length} items in your workspace
            </p>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-energy/50 focus:ring-1 focus:ring-accent-energy/30 transition-all"
            />
          </div>
        </div>

        {/* Table Header */}
        <div className="flex items-center gap-4 px-4 py-3 bg-white/5 rounded-xl border border-white/10 mb-2">
          <div className="w-12" />
          <div className="flex-1">
            <SortButton field="title" label="Name" />
          </div>
          <div className="w-32">
            <SortButton field="type" label="Type" />
          </div>
          <div className="w-32 text-center">
            <SortButton field="connections" label="Connections" />
          </div>
          <div className="w-32">
            <SortButton field="updatedAt" label="Updated" />
          </div>
          <div className="w-8" />
        </div>

        {/* List */}
        <motion.div
          className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="popLayout">
            {sortedNodes.map((node) => (
              <ListItem
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id}
                onSelect={() => selectNode(node.id)}
              />
            ))}
          </AnimatePresence>
          
          {sortedNodes.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center py-20 text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Search className="w-12 h-12 mb-4" />
              <p className="text-lg font-medium">No items found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

interface ListItemProps {
  node: Node;
  isSelected: boolean;
  onSelect: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ node, isSelected, onSelect }) => {
  const Icon = nodeIcons[node.type];
  const color = nodeColors[node.type];
  const label = nodeLabels[node.type];

  return (
    <motion.div
      variants={staggerItem}
      layout
      onClick={onSelect}
      className={`
        flex items-center gap-4 px-4 py-3 rounded-xl border cursor-pointer
        transition-all duration-200
        ${isSelected
          ? 'bg-white/10 border-accent-energy/50 shadow-lg shadow-accent-energy/10'
          : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
        }
      `}
      whileHover={{ x: 4 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>

      {/* Title & Description */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-medium truncate">{node.title}</h3>
        <p className="text-white/50 text-sm truncate">{node.description}</p>
      </div>

      {/* Type Badge */}
      <div className="w-32">
        <span
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
          style={{ backgroundColor: `${color}15`, color }}
        >
          <Icon className="w-3 h-3" />
          {label}
        </span>
      </div>

      {/* Connections */}
      <div className="w-32 text-center">
        <span className="text-white/60 text-sm">
          {node.connections?.length || 0} connections
        </span>
      </div>

      {/* Updated */}
      <div className="w-32 flex items-center gap-1.5 text-white/50 text-sm">
        <Clock className="w-3.5 h-3.5" />
        {node.metadata.lastEdited || node.metadata.lastCommit || 'Unknown'}
      </div>

      {/* Chevron */}
      <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'text-accent-energy rotate-90' : 'text-white/30'}`} />
    </motion.div>
  );
};

export default ListView;

