'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  GitBranch,
  FileText,
  CheckCircle,
  Cpu,
  Folder,
  Check,
} from 'lucide-react';
import { useGraphStore } from '@/lib/store';
import { NodeType } from '@/lib/types';
import { slideInFromTop } from '@/lib/animations';

const nodeTypes: { type: NodeType | 'all'; label: string; icon: React.ElementType; color: string }[] = [
  { type: 'all', label: 'All Types', icon: Check, color: '#FFFFFF' },
  { type: 'repo', label: 'Repositories', icon: GitBranch, color: '#667eea' },
  { type: 'doc', label: 'Documents', icon: FileText, color: '#f093fb' },
  { type: 'task', label: 'Tasks', icon: CheckCircle, color: '#4facfe' },
  { type: 'ai_agent', label: 'AI Agents', icon: Cpu, color: '#43e97b' },
  { type: 'misc', label: 'Misc', icon: Folder, color: '#FFB800' },
];

const dateRanges: { value: string; label: string }[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

export const FilterPanel: React.FC = () => {
  const { showFilterPanel, toggleFilterPanel, filterOptions, setFilter } = useGraphStore();

  const handleTypeToggle = (type: NodeType | 'all') => {
    if (type === 'all') {
      setFilter({ types: ['all'] });
    } else {
      const currentTypes = filterOptions.types.filter((t): t is NodeType => t !== 'all');
      const isSelected = currentTypes.includes(type);
      
      if (isSelected) {
        const newTypes = currentTypes.filter((t) => t !== type);
        setFilter({ types: newTypes.length > 0 ? newTypes : ['all'] });
      } else {
        setFilter({ types: [...currentTypes, type] });
      }
    }
  };

  const isTypeSelected = (type: NodeType | 'all') => {
    if (type === 'all') return filterOptions.types.includes('all');
    return filterOptions.types.includes(type);
  };

  return (
    <AnimatePresence>
      {showFilterPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-bg-void/30 z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleFilterPanel}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-16 left-0 right-0 z-40"
            variants={slideInFromTop}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-bg-elevated/98 backdrop-blur-xl rounded-2xl border border-white/10 shadow-dramatic p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-white">Filter Nodes</h3>
                  <motion.button
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={toggleFilterPanel}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Node Types */}
                  <div>
                    <h4 className="text-sm font-medium text-white/60 mb-3">Node Type</h4>
                    <div className="flex flex-wrap gap-2">
                      {nodeTypes.map((nodeType) => {
                        const Icon = nodeType.icon;
                        const isSelected = isTypeSelected(nodeType.type);
                        
                        return (
                          <motion.button
                            key={nodeType.type}
                            className={`
                              flex items-center gap-2 px-3 py-2 rounded-xl
                              border transition-all duration-200
                              ${isSelected
                                ? 'bg-white/10 border-white/20'
                                : 'bg-white/5 border-white/10 hover:border-white/20'
                              }
                            `}
                            onClick={() => handleTypeToggle(nodeType.type)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: isSelected ? nodeType.color : 'rgba(255,255,255,0.4)' }}
                            />
                            <span className={`text-sm ${isSelected ? 'text-white' : 'text-white/60'}`}>
                              {nodeType.label}
                            </span>
                            {isSelected && nodeType.type !== 'all' && (
                              <motion.div
                                className="w-4 h-4 rounded-full bg-accent-energy/20 flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                              >
                                <Check className="w-3 h-3 text-accent-energy" />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div>
                    <h4 className="text-sm font-medium text-white/60 mb-3">Date Range</h4>
                    <div className="flex flex-wrap gap-2">
                      {dateRanges.map((range) => {
                        const isSelected = filterOptions.dateRange === range.value;
                        
                        return (
                          <motion.button
                            key={range.value}
                            className={`
                              px-4 py-2 rounded-xl border transition-all duration-200
                              ${isSelected
                                ? 'bg-accent-energy/10 border-accent-energy/30 text-accent-energy'
                                : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                              }
                            `}
                            onClick={() => setFilter({ dateRange: range.value as 'all' | 'today' | 'week' | 'month' })}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="text-sm font-medium">{range.label}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
                  <button
                    className="text-sm text-white/40 hover:text-white transition-colors"
                    onClick={() => setFilter({ types: ['all'], dateRange: 'all' })}
                  >
                    Reset all filters
                  </button>
                  <motion.button
                    className="px-4 py-2 bg-accent-energy text-bg-void font-medium rounded-xl"
                    onClick={toggleFilterPanel}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;

