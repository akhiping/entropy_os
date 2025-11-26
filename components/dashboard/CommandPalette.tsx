'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Sparkles,
  Download,
  RefreshCw,
  Plus,
  Settings,
  Eye,
  GitBranch,
  FileText,
  CheckCircle,
  Cpu,
  Folder,
  Clock,
  Command,
  ArrowRight,
} from 'lucide-react';
import { useGraphStore, useFilteredNodes } from '@/lib/store';
import { NodeType as NodeTypeEnum } from '@/lib/types';
import { commandPaletteVariants, modalBackdrop } from '@/lib/animations';

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
  category: 'command' | 'node' | 'recent' | 'navigation';
}

const nodeIcons: Record<NodeTypeEnum, React.ElementType> = {
  repo: GitBranch,
  doc: FileText,
  task: CheckCircle,
  ai_agent: Cpu,
  misc: Folder,
};

const nodeColors: Record<NodeTypeEnum, string> = {
  repo: '#667eea',
  doc: '#f093fb',
  task: '#4facfe',
  ai_agent: '#43e97b',
  misc: '#FFB800',
};

export const CommandPalette: React.FC = () => {
  const {
    showCommandPalette,
    toggleCommandPalette,
    toggleAIChat,
    selectNode,
    sync,
    fitView,
    autoLayout,
  } = useGraphStore();
  
  const allNodes = useFilteredNodes();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Commands
  const commands: CommandItem[] = useMemo(() => [
    {
      id: 'ai-chat',
      title: 'Open AI Chat',
      description: 'Ask questions about your workspace',
      icon: Sparkles,
      shortcut: '⌘I',
      action: () => { toggleCommandPalette(); toggleAIChat(); },
      category: 'command',
    },
    {
      id: 'sync',
      title: 'Sync All Sources',
      description: 'Refresh data from connected services',
      icon: RefreshCw,
      shortcut: '⌘S',
      action: () => { sync(); toggleCommandPalette(); },
      category: 'command',
    },
    {
      id: 'export',
      title: 'Export Graph',
      description: 'Download graph as image',
      icon: Download,
      shortcut: '⌘E',
      action: () => { toggleCommandPalette(); },
      category: 'command',
    },
    {
      id: 'fit-view',
      title: 'Fit to View',
      description: 'Center and fit all nodes',
      icon: Eye,
      shortcut: 'F',
      action: () => { fitView(); toggleCommandPalette(); },
      category: 'command',
    },
    {
      id: 'auto-layout',
      title: 'Auto Layout',
      description: 'Reorganize node positions',
      icon: Command,
      shortcut: 'L',
      action: () => { autoLayout(); toggleCommandPalette(); },
      category: 'command',
    },
    {
      id: 'create-node',
      title: 'Create New Node',
      description: 'Add a new item to your workspace',
      icon: Plus,
      shortcut: '⌘N',
      action: () => { toggleCommandPalette(); },
      category: 'command',
    },
    {
      id: 'settings',
      title: 'Open Settings',
      description: 'Configure your workspace',
      icon: Settings,
      shortcut: '⌘,',
      action: () => { toggleCommandPalette(); },
      category: 'command',
    },
  ], [toggleCommandPalette, toggleAIChat, sync, fitView, autoLayout]);

  // Convert nodes to command items
  const nodeItems: CommandItem[] = useMemo(() => 
    allNodes.map((node) => ({
      id: node.id,
      title: node.title,
      description: node.description.slice(0, 60) + '...',
      icon: nodeIcons[node.type],
      action: () => { selectNode(node.id); toggleCommandPalette(); },
      category: 'node' as const,
    })),
    [allNodes, selectNode, toggleCommandPalette]
  );

  // Filter items based on query
  const filteredItems = useMemo(() => {
    const lowerQuery = query.toLowerCase();
    
    // Special prefix filters
    if (lowerQuery.startsWith('/')) {
      // Commands only
      return commands.filter((c) =>
        c.title.toLowerCase().includes(lowerQuery.slice(1))
      );
    }
    
    if (lowerQuery.startsWith('#')) {
      // Filter by tags
      return nodeItems.filter((n) => {
        const node = allNodes.find((node) => node.id === n.id);
        return node?.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery.slice(1)));
      });
    }

    // Regular search
    const commandResults = commands.filter((c) =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description?.toLowerCase().includes(lowerQuery)
    );

    const nodeResults = nodeItems.filter((n) =>
      n.title.toLowerCase().includes(lowerQuery) ||
      n.description?.toLowerCase().includes(lowerQuery)
    );

    // Limit results
    return [...commandResults.slice(0, 5), ...nodeResults.slice(0, 10)];
  }, [query, commands, nodeItems, allNodes]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showCommandPalette) {
        // Open with Cmd+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          toggleCommandPalette();
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev < filteredItems.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => 
            prev > 0 ? prev - 1 : filteredItems.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          toggleCommandPalette();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCommandPalette, toggleCommandPalette, filteredItems, selectedIndex]);

  // Reset state when opening
  useEffect(() => {
    if (showCommandPalette) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [showCommandPalette]);

  // Scroll selected item into view
  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const items = listRef.current.querySelectorAll('[data-command-item]');
      items[selectedIndex]?.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  // Recent items (shown when no query)
  const recentItems = useMemo(() => [
    ...nodeItems.slice(0, 5).map((n) => ({ ...n, category: 'recent' as const })),
  ], [nodeItems]);

  const displayItems = query ? filteredItems : [
    ...commands.slice(0, 4),
    ...recentItems,
  ];

  const getItemColor = (item: CommandItem) => {
    if (item.category === 'node' || item.category === 'recent') {
      const node = allNodes.find((n) => n.id === item.id);
      return node ? nodeColors[node.type] : '#666';
    }
    return '#00FFA3';
  };

  return (
    <AnimatePresence>
      {showCommandPalette && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-gradient-to-b from-bg-void/80 to-bg-void/95 backdrop-blur-md z-50"
            variants={modalBackdrop}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={toggleCommandPalette}
          />

          {/* Palette */}
          <motion.div
            className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-xl bg-bg-elevated/98 backdrop-blur-xl rounded-2xl border border-white/20 shadow-dramatic z-50 overflow-hidden"
            variants={commandPaletteVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 border-b border-white/10">
              <Search className="w-5 h-5 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                className="flex-1 py-4 bg-transparent text-lg text-white placeholder-white/40 outline-none"
              />
              <kbd className="px-2 py-1 text-xs font-mono bg-white/10 rounded text-white/40">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              className="max-h-[400px] overflow-y-auto py-2"
            >
              {displayItems.length === 0 ? (
                <div className="px-4 py-8 text-center">
                  <p className="text-white/40">No results found</p>
                  <p className="text-xs text-white/30 mt-1">
                    Try searching for nodes, documents, or commands
                  </p>
                </div>
              ) : (
                <>
                  {/* Group labels */}
                  {!query && (
                    <div className="px-4 py-2">
                      <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                        Commands
                      </p>
                    </div>
                  )}
                  
                  {displayItems.map((item, index) => {
                    const Icon = item.icon;
                    const isSelected = index === selectedIndex;
                    const itemColor = getItemColor(item);
                    
                    // Show section header for recent items
                    const showRecentHeader = !query && 
                      item.category === 'recent' && 
                      (index === 0 || displayItems[index - 1].category !== 'recent');

                    return (
                      <React.Fragment key={item.id}>
                        {showRecentHeader && (
                          <div className="px-4 py-2 mt-2 border-t border-white/5">
                            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Recent
                            </p>
                          </div>
                        )}
                        
                        <motion.div
                          data-command-item
                          className={`
                            flex items-center gap-3 px-4 py-3 mx-2 rounded-xl cursor-pointer
                            transition-all duration-150
                            ${isSelected ? 'bg-white/10' : 'hover:bg-white/5'}
                          `}
                          onClick={() => item.action()}
                          onMouseEnter={() => setSelectedIndex(index)}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.02 }}
                        >
                          {/* Icon */}
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: `${itemColor}15`,
                            }}
                          >
                            <Icon className="w-5 h-5" style={{ color: itemColor }} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-sm text-white/40 truncate">
                                {item.description}
                              </p>
                            )}
                          </div>

                          {/* Shortcut or arrow */}
                          {item.shortcut ? (
                            <kbd className="px-2 py-1 text-xs font-mono bg-white/10 rounded text-white/40">
                              {item.shortcut}
                            </kbd>
                          ) : isSelected ? (
                            <ArrowRight className="w-4 h-4 text-white/40" />
                          ) : null}
                        </motion.div>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/10 text-xs text-white/30">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↑</kbd>
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↓</kbd>
                  to navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 bg-white/10 rounded">↵</kbd>
                  to select
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/20">/</span>
                <span>commands</span>
                <span className="text-white/20">#</span>
                <span>tags</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;

