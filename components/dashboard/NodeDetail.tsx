'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ExternalLink,
  Sparkles,
  Link2,
  GitBranch,
  FileText,
  CheckCircle,
  Cpu,
  Folder,
  Star,
  Clock,
  Eye,
  User,
  ArrowUpRight,
  Lightbulb,
} from 'lucide-react';
import { useGraphStore, useSelectedNode, useConnectedNodes } from '@/lib/store';
import { NodeType as NodeTypeEnum } from '@/lib/types';
import Button from '@/components/ui/Button';
import { slideInFromRight, staggerContainer, staggerItem } from '@/lib/animations';

const nodeConfig: Record<NodeTypeEnum, {
  icon: React.ElementType;
  gradient: string;
  color: string;
  label: string;
}> = {
  repo: {
    icon: GitBranch,
    gradient: 'from-[#667eea] to-[#764ba2]',
    color: '#667eea',
    label: 'Repository',
  },
  doc: {
    icon: FileText,
    gradient: 'from-[#f093fb] to-[#f5576c]',
    color: '#f093fb',
    label: 'Document',
  },
  task: {
    icon: CheckCircle,
    gradient: 'from-[#4facfe] to-[#00f2fe]',
    color: '#4facfe',
    label: 'Task',
  },
  ai_agent: {
    icon: Cpu,
    gradient: 'from-[#43e97b] to-[#38f9d7]',
    color: '#43e97b',
    label: 'AI Agent',
  },
  misc: {
    icon: Folder,
    gradient: 'from-[#FFB800] to-[#FF8C00]',
    color: '#FFB800',
    label: 'Misc',
  },
};

const aiInsights = [
  {
    icon: Lightbulb,
    text: 'This item is central to your workspace with 8 connections',
    type: 'info',
  },
  {
    icon: Clock,
    text: 'Active 2 hours ago, normally active daily',
    type: 'info',
  },
  {
    icon: ArrowUpRight,
    text: 'Suggested: Review recent changes',
    type: 'suggestion',
  },
];

const MetaItem: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
}> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/8 transition-colors">
    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
      <Icon className="w-4 h-4 text-white/50" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-white/40">{label}</p>
      <p className="text-sm text-white font-medium truncate">{value}</p>
    </div>
  </div>
);

const ActivityItem: React.FC<{
  action: string;
  time: string;
  user?: string;
}> = ({ action, time, user }) => (
  <div className="relative flex gap-3 pb-4">
    {/* Timeline line */}
    <div className="absolute left-[9px] top-5 bottom-0 w-px bg-white/10" />
    
    {/* Dot */}
    <div className="w-5 h-5 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
      <div className="w-1.5 h-1.5 rounded-full bg-accent-energy" />
    </div>
    
    {/* Content */}
    <div className="flex-1">
      <p className="text-sm text-white/70">{action}</p>
      <p className="text-xs text-white/40 mt-0.5">
        {time} {user && `• ${user}`}
      </p>
    </div>
  </div>
);

export const NodeDetail: React.FC = () => {
  const { showNodeDetail, selectNode, toggleAIChat } = useGraphStore();
  const selectedNode = useSelectedNode();
  const connectedNodes = useConnectedNodes(selectedNode?.id || null);

  if (!selectedNode) return null;

  const config = nodeConfig[selectedNode.type];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {showNodeDetail && selectedNode && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            className="fixed inset-0 bg-bg-void/50 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => selectNode(null)}
          />

          {/* Panel */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-bg-deep/98 backdrop-blur-xl border-l border-white/10 z-50 overflow-hidden"
            variants={slideInFromRight}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {/* Shadow overlay */}
            <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-bg-void/50 to-transparent pointer-events-none" />

            <div className="h-full overflow-y-auto no-scrollbar">
              <motion.div
                className="p-6 space-y-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {/* Header */}
                <motion.div variants={staggerItem} className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon with glow */}
                    <div className="relative">
                      <motion.div
                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${config.gradient} opacity-40 blur-xl`}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-xl font-bold text-white">{selectedNode.title}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="text-xs font-medium px-2 py-0.5 rounded-md"
                          style={{ 
                            backgroundColor: `${config.color}20`,
                            color: config.color,
                          }}
                        >
                          {config.label}
                        </span>
                        {selectedNode.metadata.status && (
                          <span className="text-xs text-white/40">
                            • {selectedNode.metadata.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Close button */}
                  <motion.button
                    className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    onClick={() => selectNode(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </motion.div>

                {/* Metadata grid */}
                <motion.div variants={staggerItem} className="grid grid-cols-2 gap-3">
                  {selectedNode.metadata.stars !== undefined && (
                    <MetaItem icon={Star} label="Stars" value={selectedNode.metadata.stars} />
                  )}
                  {selectedNode.metadata.language && (
                    <MetaItem icon={GitBranch} label="Language" value={selectedNode.metadata.language} />
                  )}
                  {selectedNode.metadata.lastCommit && (
                    <MetaItem icon={Clock} label="Last Commit" value={selectedNode.metadata.lastCommit} />
                  )}
                  {selectedNode.metadata.lastEdited && (
                    <MetaItem icon={Clock} label="Last Edited" value={selectedNode.metadata.lastEdited} />
                  )}
                  {selectedNode.metadata.visibility && (
                    <MetaItem icon={Eye} label="Visibility" value={selectedNode.metadata.visibility} />
                  )}
                  {selectedNode.metadata.assignee && (
                    <MetaItem icon={User} label="Assignee" value={selectedNode.metadata.assignee} />
                  )}
                  {selectedNode.metadata.app && (
                    <MetaItem icon={FileText} label="Source" value={selectedNode.metadata.app} />
                  )}
                </motion.div>

                {/* Description */}
                <motion.div variants={staggerItem}>
                  <h3 className="text-sm font-semibold text-white/60 mb-3">Description</h3>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {selectedNode.description}
                  </p>
                </motion.div>

                {/* Progress bar for tasks */}
                {selectedNode.metadata.progress !== undefined && (
                  <motion.div variants={staggerItem}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-semibold text-white/60">Progress</h3>
                      <span className="text-sm text-accent-frost font-medium">
                        {selectedNode.metadata.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-accent-frost to-accent-energy rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedNode.metadata.progress}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}

                {/* AI Insights */}
                <motion.div variants={staggerItem}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-accent-energy" />
                    <h3 className="text-sm font-semibold text-white/60">AI Insights</h3>
                  </div>
                  <div className="space-y-2">
                    {aiInsights.map((insight, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-xl bg-accent-energy/5 border border-accent-energy/10"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                      >
                        <insight.icon className="w-4 h-4 text-accent-energy shrink-0 mt-0.5" />
                        <p className="text-sm text-white/70">{insight.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Connected Nodes Mini Graph */}
                <motion.div variants={staggerItem}>
                  <h3 className="text-sm font-semibold text-white/60 mb-3">
                    Connections ({connectedNodes.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {connectedNodes.slice(0, 6).map((node) => {
                      const nodeConf = nodeConfig[node.type];
                      const NodeIcon = nodeConf.icon;
                      return (
                        <motion.button
                          key={node.id}
                          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                          onClick={() => selectNode(node.id)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <NodeIcon className="w-4 h-4" style={{ color: nodeConf.color }} />
                          <span className="text-sm text-white/70 truncate max-w-[100px]">
                            {node.title}
                          </span>
                        </motion.button>
                      );
                    })}
                    {connectedNodes.length > 6 && (
                      <span className="px-3 py-2 text-sm text-white/40">
                        +{connectedNodes.length - 6} more
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Activity Timeline */}
                <motion.div variants={staggerItem}>
                  <h3 className="text-sm font-semibold text-white/60 mb-3">Recent Activity</h3>
                  <div className="space-y-0">
                    <ActivityItem
                      action="Updated documentation"
                      time="2 hours ago"
                      user="Sarah"
                    />
                    <ActivityItem
                      action="Merged pull request #47"
                      time="5 hours ago"
                      user="Alex"
                    />
                    <ActivityItem
                      action="Added connection to API Docs"
                      time="1 day ago"
                    />
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  variants={staggerItem}
                  className="flex items-center gap-3 pt-4 border-t border-white/10"
                >
                  {selectedNode.metadata.url && (
                    <Button
                      variant="secondary"
                      size="md"
                      icon={ExternalLink}
                      className="flex-1"
                      onClick={() => window.open(selectedNode.metadata.url, '_blank')}
                    >
                      Open Source
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="md"
                    icon={Sparkles}
                    className="flex-1"
                    onClick={toggleAIChat}
                  >
                    Ask AI
                  </Button>
                  <Button
                    variant="tertiary"
                    size="md"
                    icon={Link2}
                  >
                    Connect
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NodeDetail;

