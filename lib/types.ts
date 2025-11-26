export type NodeType = 'repo' | 'doc' | 'task' | 'ai_agent' | 'misc';

export type EdgeType = 'depends_on' | 'part_of' | 'relates_to' | 'blocks';

export interface NodeMetadata {
  language?: string;
  stars?: number;
  lastCommit?: string;
  lastEdited?: string;
  url?: string;
  status?: 'active' | 'archived' | 'draft';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  assignee?: string;
  app?: string;
  visibility?: 'public' | 'private';
  progress?: number;
}

export interface Node {
  id: string;
  type: NodeType;
  title: string;
  description: string;
  metadata: NodeMetadata;
  position: { x: number; y: number };
  connections: string[];
  createdAt?: string;
  tags?: string[];
}

export interface Edge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  strength: number;
}

export interface FilterOptions {
  types: NodeType[] | 'all'[];
  dateRange: 'all' | 'today' | 'week' | 'month';
  search?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  nodeRefs?: string[];
}

export interface AIInsight {
  id: string;
  type: 'suggestion' | 'warning' | 'info';
  content: string;
  nodeId?: string;
}

