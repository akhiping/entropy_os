'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as d3 from 'd3';
import { useGraphStore, useFilteredNodes } from '@/lib/store';
import { Node as NodeType, Edge, NodeType as NodeTypeEnum } from '@/lib/types';
import GraphNode from './Node';

interface SimulationNode extends NodeType {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  source: SimulationNode | string;
  target: SimulationNode | string;
  type: string;
  strength: number;
}

const nodeTypeColors: Record<NodeTypeEnum, { stroke: string; fill: string }> = {
  repo: { stroke: '#667eea', fill: 'rgba(102, 126, 234, 0.2)' },
  doc: { stroke: '#f093fb', fill: 'rgba(240, 147, 251, 0.2)' },
  task: { stroke: '#4facfe', fill: 'rgba(79, 172, 254, 0.2)' },
  ai_agent: { stroke: '#43e97b', fill: 'rgba(67, 233, 123, 0.2)' },
  misc: { stroke: '#FFB800', fill: 'rgba(255, 184, 0, 0.2)' },
};

export const GraphCanvas: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simulationRef = useRef<d3.Simulation<SimulationNode, SimulationLink> | null>(null);
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);

  const {
    edges,
    selectedNodeId,
    hoveredNodeId,
    selectNode,
    hoverNode,
    zoomLevel,
    setZoom,
    panOffset,
    setPan,
  } = useGraphStore();

  const filteredNodes = useFilteredNodes();

  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [simulationNodes, setSimulationNodes] = useState<SimulationNode[]>([]);
  const [simulationLinks, setSimulationLinks] = useState<SimulationLink[]>([]);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize simulation
  useEffect(() => {
    if (!svgRef.current || filteredNodes.length === 0) return;

    // Convert nodes to simulation nodes
    const simNodes: SimulationNode[] = filteredNodes.map((node) => ({
      ...node,
      x: node.position?.x || dimensions.width / 2 + (Math.random() - 0.5) * 400,
      y: node.position?.y || dimensions.height / 2 + (Math.random() - 0.5) * 400,
    }));

    // Create links from edges
    const nodeIds = new Set(filteredNodes.map((n) => n.id));
    const simLinks: SimulationLink[] = edges
      .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target))
      .map((edge) => ({
        source: edge.source,
        target: edge.target,
        type: edge.type,
        strength: edge.strength,
      }));

    // Create force simulation
    const simulation = d3.forceSimulation<SimulationNode>(simNodes)
      .force('link', d3.forceLink<SimulationNode, SimulationLink>(simLinks)
        .id((d) => d.id)
        .distance(150)
        .strength((d) => d.strength * 0.3))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.05))
      .force('collision', d3.forceCollide().radius(60))
      .force('x', d3.forceX(dimensions.width / 2).strength(0.02))
      .force('y', d3.forceY(dimensions.height / 2).strength(0.02))
      .alphaDecay(0.02)
      .velocityDecay(0.4);

    simulation.on('tick', () => {
      setSimulationNodes([...simulation.nodes()]);
      setSimulationLinks([...simLinks]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [filteredNodes, edges, dimensions]);

  // Setup zoom behavior
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        transformRef.current = event.transform;
        setTransform({
          x: event.transform.x,
          y: event.transform.y,
          k: event.transform.k,
        });
        setZoom(event.transform.k);
        setPan({ x: event.transform.x, y: event.transform.y });
      });

    svg.call(zoom);

    // Reset to initial view
    svg.call(zoom.transform, d3.zoomIdentity);

    return () => {
      svg.on('.zoom', null);
    };
  }, [setZoom, setPan]);

  // Handle node drag
  const handleNodeDragStart = useCallback((nodeId: string, event: React.MouseEvent) => {
    if (!simulationRef.current) return;
    
    setIsDragging(true);
    setDraggedNode(nodeId);
    
    const node = simulationRef.current.nodes().find((n) => n.id === nodeId);
    if (node) {
      node.fx = node.x;
      node.fy = node.y;
    }
    
    simulationRef.current.alphaTarget(0.3).restart();
  }, []);

  const handleNodeDrag = useCallback((nodeId: string, event: React.MouseEvent) => {
    if (!simulationRef.current || !isDragging) return;
    
    const node = simulationRef.current.nodes().find((n) => n.id === nodeId);
    if (node && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = (event.clientX - rect.left - transform.x) / transform.k;
      const y = (event.clientY - rect.top - transform.y) / transform.k;
      node.fx = x;
      node.fy = y;
    }
  }, [isDragging, transform]);

  const handleNodeDragEnd = useCallback((nodeId: string) => {
    if (!simulationRef.current) return;
    
    setIsDragging(false);
    setDraggedNode(null);
    
    const node = simulationRef.current.nodes().find((n) => n.id === nodeId);
    if (node) {
      node.fx = null;
      node.fy = null;
    }
    
    simulationRef.current.alphaTarget(0);
  }, []);

  // Handle background click to deselect
  const handleBackgroundClick = useCallback((event: React.MouseEvent) => {
    if (event.target === svgRef.current || event.target === containerRef.current) {
      selectNode(null);
    }
  }, [selectNode]);

  // Get connected edges for a node
  const getConnectedEdges = useCallback((nodeId: string | null) => {
    if (!nodeId) return new Set<string>();
    return new Set(
      edges
        .filter((e) => e.source === nodeId || e.target === nodeId)
        .map((e) => e.id)
    );
  }, [edges]);

  const connectedEdges = useMemo(
    () => getConnectedEdges(selectedNodeId || hoveredNodeId),
    [getConnectedEdges, selectedNodeId, hoveredNodeId]
  );

  // Calculate link path with curves
  const getLinkPath = useCallback((link: SimulationLink) => {
    const source = link.source as SimulationNode;
    const target = link.target as SimulationNode;
    
    if (!source || !target || typeof source === 'string' || typeof target === 'string') {
      return '';
    }

    // Check for valid coordinates
    if (isNaN(source.x) || isNaN(source.y) || isNaN(target.x) || isNaN(target.y)) {
      return '';
    }
    if (source.x === undefined || source.y === undefined || target.x === undefined || target.y === undefined) {
      return '';
    }

    const dx = target.x - source.x;
    const dy = target.y - source.y;
    
    // Curved path
    return `M${source.x},${source.y}Q${(source.x + target.x) / 2 + dy * 0.1},${(source.y + target.y) / 2 - dx * 0.1} ${target.x},${target.y}`;
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing"
      onClick={handleBackgroundClick}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-bg-surface/50 via-bg-void to-bg-void pointer-events-none" />
      
      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: `${50 * transform.k}px ${50 * transform.k}px`,
          backgroundPosition: `${transform.x}px ${transform.y}px`,
        }}
      />

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      >
        <defs>
          {/* Gradient definitions for links */}
          {Object.entries(nodeTypeColors).map(([type, colors]) => (
            <linearGradient
              key={type}
              id={`link-gradient-${type}`}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.5} />
              <stop offset="100%" stopColor={colors.stroke} stopOpacity={0.2} />
            </linearGradient>
          ))}

          {/* Glow filter */}
          <filter id="glow-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Arrow marker */}
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="20"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.3)" />
          </marker>
        </defs>

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {/* Render edges */}
          <g className="edges">
            {simulationLinks.map((link, index) => {
              const source = link.source as SimulationNode;
              const target = link.target as SimulationNode;
              
              if (typeof source === 'string' || typeof target === 'string') return null;
              
              const isConnected = connectedEdges.has(`e${index + 1}`);
              const edgeColor = nodeTypeColors[source.type as NodeTypeEnum]?.stroke || '#666';
              
              const pathD = getLinkPath(link);
              if (!pathD) return null;
              
              return (
                <motion.path
                  key={`edge-${source.id}-${target.id}`}
                  d={pathD}
                  fill="none"
                  stroke={edgeColor}
                  strokeWidth={isConnected ? 2.5 : 1.5}
                  strokeDasharray={link.type === 'depends_on' ? '5,5' : undefined}
                  markerEnd={link.type === 'depends_on' ? 'url(#arrow)' : undefined}
                  initial={{ pathLength: 0, strokeOpacity: 0.1 }}
                  animate={{
                    pathLength: 1,
                    strokeOpacity: isConnected ? 0.6 : 0.15,
                    strokeWidth: isConnected ? 2.5 : 1.5,
                  }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              );
            })}
          </g>

          {/* Render nodes */}
          <g className="nodes">
            {simulationNodes
              .filter((node) => node.x !== undefined && node.y !== undefined && !isNaN(node.x) && !isNaN(node.y))
              .map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              const isConnectedToSelected = selectedNodeId && (
                edges.some(
                  (e) =>
                    (e.source === selectedNodeId && e.target === node.id) ||
                    (e.target === selectedNodeId && e.source === node.id)
                )
              );
              const isDimmed = selectedNodeId && !isSelected && !isConnectedToSelected;

              return (
                <GraphNode
                  key={node.id}
                  node={node}
                  x={node.x}
                  y={node.y}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  isDimmed={isDimmed || false}
                  isDragging={draggedNode === node.id}
                  onSelect={() => selectNode(node.id)}
                  onHover={(hovered) => hoverNode(hovered ? node.id : null)}
                  onDragStart={(e) => handleNodeDragStart(node.id, e)}
                  onDrag={(e) => handleNodeDrag(node.id, e)}
                  onDragEnd={() => handleNodeDragEnd(node.id)}
                />
              );
            })}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default GraphCanvas;

