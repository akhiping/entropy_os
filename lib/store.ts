import { create } from 'zustand';
import { Node, Edge, FilterOptions, ChatMessage, NodeType, EdgeType } from './types';
import { mockNodes, mockEdges } from './mockData';

interface GraphState {
  // Data
  nodes: Node[];
  edges: Edge[];
  
  // Selection
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  
  // UI State
  showAIChat: boolean;
  showCommandPalette: boolean;
  showNodeDetail: boolean;
  showFilterPanel: boolean;
  
  // View
  filterOptions: FilterOptions;
  viewMode: 'graph' | 'list' | 'timeline';
  zoomLevel: number;
  panOffset: { x: number; y: number };
  
  // Chat
  chatMessages: ChatMessage[];
  isAITyping: boolean;
  
  // Sync
  lastSynced: Date | null;
  isSyncing: boolean;
  
  // Actions
  selectNode: (id: string | null) => void;
  hoverNode: (id: string | null) => void;
  toggleAIChat: () => void;
  toggleCommandPalette: () => void;
  toggleNodeDetail: () => void;
  toggleFilterPanel: () => void;
  updateNode: (id: string, updates: Partial<Node>) => void;
  addNode: (node: Node) => void;
  deleteNode: (id: string) => void;
  addEdge: (source: string, target: string, type: EdgeType) => void;
  deleteEdge: (id: string) => void;
  setFilter: (filter: Partial<FilterOptions>) => void;
  setViewMode: (mode: 'graph' | 'list' | 'timeline') => void;
  setZoom: (zoom: number) => void;
  setPan: (offset: { x: number; y: number }) => void;
  addChatMessage: (message: ChatMessage) => void;
  setAITyping: (typing: boolean) => void;
  sync: () => void;
  fitView: () => void;
  autoLayout: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
  // Initial Data
  nodes: mockNodes,
  edges: mockEdges,
  
  // Initial Selection
  selectedNodeId: null,
  hoveredNodeId: null,
  
  // Initial UI State
  showAIChat: false,
  showCommandPalette: false,
  showNodeDetail: false,
  showFilterPanel: false,
  
  // Initial View
  filterOptions: { types: ['all'], dateRange: 'all' },
  viewMode: 'graph',
  zoomLevel: 1,
  panOffset: { x: 0, y: 0 },
  
  // Initial Chat
  chatMessages: [],
  isAITyping: false,
  
  // Initial Sync
  lastSynced: new Date(),
  isSyncing: false,
  
  // Actions
  selectNode: (id) => set({ 
    selectedNodeId: id, 
    showNodeDetail: id !== null 
  }),
  
  hoverNode: (id) => set({ hoveredNodeId: id }),
  
  toggleAIChat: () => set((state) => ({ 
    showAIChat: !state.showAIChat,
    showCommandPalette: false // Close command palette when opening AI chat
  })),
  
  toggleCommandPalette: () => set((state) => ({ 
    showCommandPalette: !state.showCommandPalette,
    showAIChat: false // Close AI chat when opening command palette
  })),
  
  toggleNodeDetail: () => set((state) => ({ 
    showNodeDetail: !state.showNodeDetail 
  })),
  
  toggleFilterPanel: () => set((state) => ({ 
    showFilterPanel: !state.showFilterPanel 
  })),
  
  updateNode: (id, updates) => set((state) => ({
    nodes: state.nodes.map((n) => 
      n.id === id ? { ...n, ...updates } : n
    ),
  })),
  
  addNode: (node) => set((state) => ({
    nodes: [...state.nodes, node],
  })),
  
  deleteNode: (id) => set((state) => ({
    nodes: state.nodes.filter((n) => n.id !== id),
    edges: state.edges.filter((e) => e.source !== id && e.target !== id),
    selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
  })),
  
  addEdge: (source, target, type) => set((state) => ({
    edges: [
      ...state.edges,
      {
        id: `e${Date.now()}`,
        source,
        target,
        type,
        strength: 1,
      },
    ],
  })),
  
  deleteEdge: (id) => set((state) => ({
    edges: state.edges.filter((e) => e.id !== id),
  })),
  
  setFilter: (filter) => set((state) => ({
    filterOptions: { ...state.filterOptions, ...filter },
  })),
  
  setViewMode: (mode) => set({ viewMode: mode }),
  
  setZoom: (zoom) => set({ zoomLevel: Math.max(0.1, Math.min(3, zoom)) }),
  
  setPan: (offset) => set({ panOffset: offset }),
  
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, message],
  })),
  
  setAITyping: (typing) => set({ isAITyping: typing }),
  
  sync: () => {
    set({ isSyncing: true });
    // Simulate sync
    setTimeout(() => {
      set({ isSyncing: false, lastSynced: new Date() });
    }, 1500);
  },
  
  fitView: () => {
    set({ zoomLevel: 1, panOffset: { x: 0, y: 0 } });
  },
  
  autoLayout: () => {
    // Trigger a re-layout of the graph
    // This will be handled by the D3 force simulation
    const nodes = get().nodes;
    set({ 
      nodes: nodes.map((n) => ({
        ...n,
        position: { x: Math.random() * 800, y: Math.random() * 600 },
      })),
    });
  },
}));

// Selectors
export const useSelectedNode = () => {
  const { nodes, selectedNodeId } = useGraphStore();
  return nodes.find((n) => n.id === selectedNodeId) || null;
};

export const useFilteredNodes = () => {
  const { nodes, filterOptions } = useGraphStore();
  
  return nodes.filter((node) => {
    // Type filter
    if (filterOptions.types[0] !== 'all') {
      if (!filterOptions.types.includes(node.type as NodeType)) {
        return false;
      }
    }
    
    // Search filter
    if (filterOptions.search) {
      const search = filterOptions.search.toLowerCase();
      return (
        node.title.toLowerCase().includes(search) ||
        node.description.toLowerCase().includes(search) ||
        node.tags?.some((tag) => tag.toLowerCase().includes(search))
      );
    }
    
    return true;
  });
};

export const useConnectedNodes = (nodeId: string | null) => {
  const { nodes, edges } = useGraphStore();
  
  if (!nodeId) return [];
  
  const connectedIds = new Set<string>();
  edges.forEach((edge) => {
    if (edge.source === nodeId) connectedIds.add(edge.target);
    if (edge.target === nodeId) connectedIds.add(edge.source);
  });
  
  return nodes.filter((n) => connectedIds.has(n.id));
};

