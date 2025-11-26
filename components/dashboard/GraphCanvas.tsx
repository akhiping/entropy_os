'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';
import { useGraphStore, useFilteredNodes } from '@/lib/store';
import { Node as NodeType, NodeType as NodeTypeEnum } from '@/lib/types';
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

// Intense neon colors for maximum visibility
const nodeTypeColors: Record<NodeTypeEnum, { stroke: string; fill: string; glow: string }> = {
  repo: { stroke: '#A855F7', fill: 'rgba(168, 85, 247, 0.6)', glow: '#A855F7' },      // Vivid purple
  doc: { stroke: '#FF00FF', fill: 'rgba(255, 0, 255, 0.6)', glow: '#FF00FF' },        // Hot magenta
  task: { stroke: '#00FFFF', fill: 'rgba(0, 255, 255, 0.6)', glow: '#00FFFF' },       // Cyan
  ai_agent: { stroke: '#00FF88', fill: 'rgba(0, 255, 136, 0.7)', glow: '#00FF88' },   // Neon green
  misc: { stroke: '#FFD700', fill: 'rgba(255, 215, 0, 0.6)', glow: '#FFD700' },       // Gold
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
  } = useGraphStore();

  const filteredNodes = useFilteredNodes();

  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const [simulationNodes, setSimulationNodes] = useState<SimulationNode[]>([]);
  const [simulationLinks, setSimulationLinks] = useState<SimulationLink[]>([]);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [hasInitialFit, setHasInitialFit] = useState(false);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

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

    // If we already have simulation nodes with positions, use them
    const existingPositions = new Map(
      simulationNodes.map((n) => [n.id, { x: n.x, y: n.y }])
    );

    // Convert nodes to simulation nodes
    const simNodes: SimulationNode[] = filteredNodes.map((node) => {
      const existing = existingPositions.get(node.id);
      return {
        ...node,
        x: existing?.x ?? node.position?.x ?? dimensions.width / 2 + (Math.random() - 0.5) * 400,
        y: existing?.y ?? node.position?.y ?? dimensions.height / 2 + (Math.random() - 0.5) * 400,
      };
    });

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

    // Stop any existing simulation
    if (simulationRef.current) {
      simulationRef.current.stop();
    }

    // Create force simulation with more stable settings
    const simulation = d3.forceSimulation<SimulationNode>(simNodes)
      .force('link', d3.forceLink<SimulationNode, SimulationLink>(simLinks)
        .id((d) => d.id)
        .distance(180)
        .strength((d) => d.strength * 0.2))
      .force('charge', d3.forceManyBody().strength(-400).distanceMax(500))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2).strength(0.03))
      .force('collision', d3.forceCollide().radius(80).strength(0.8))
      .force('x', d3.forceX(dimensions.width / 2).strength(0.01))
      .force('y', d3.forceY(dimensions.height / 2).strength(0.01))
      .alphaDecay(0.05) // Faster decay to stabilize quicker
      .velocityDecay(0.6) // Higher friction to reduce jitter
      .alphaMin(0.01); // Stop earlier

    let tickCount = 0;
    simulation.on('tick', () => {
      tickCount++;
      // Only update every 2nd tick to reduce flickering
      if (tickCount % 2 === 0 || simulation.alpha() < 0.1) {
        setSimulationNodes([...simulation.nodes()]);
        setSimulationLinks([...simLinks]);
      }
    });

    // Stop simulation when stabilized
    simulation.on('end', () => {
      setSimulationNodes([...simulation.nodes()]);
      setSimulationLinks([...simLinks]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredNodes.length, edges.length, dimensions]);

  // Fit all nodes to view
  const fitToView = useCallback(() => {
    if (!svgRef.current || !zoomRef.current || simulationNodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const padding = 100;

    // Calculate bounds of all nodes
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    simulationNodes.forEach((node) => {
      if (node.x !== undefined && node.y !== undefined && !isNaN(node.x) && !isNaN(node.y)) {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y);
      }
    });

    if (minX === Infinity) return;

    // Add padding for node size
    minX -= 80;
    maxX += 80;
    minY -= 60;
    maxY += 60;

    const graphWidth = maxX - minX;
    const graphHeight = maxY - minY;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // Calculate scale to fit
    const scaleX = (dimensions.width - padding * 2) / graphWidth;
    const scaleY = (dimensions.height - padding * 2) / graphHeight;
    const scale = Math.min(scaleX, scaleY, 1.5); // Cap at 1.5x zoom

    // Calculate translation to center
    const translateX = dimensions.width / 2 - centerX * scale;
    const translateY = dimensions.height / 2 - centerY * scale;

    // Apply transform with animation
    const newTransform = d3.zoomIdentity.translate(translateX, translateY).scale(scale);
    svg.transition().duration(750).call(zoomRef.current.transform, newTransform);
  }, [simulationNodes, dimensions]);

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
      });

    svg.call(zoom);
    zoomRef.current = zoom;

    return () => {
      svg.on('.zoom', null);
    };
  }, []);

  // Auto fit to view when simulation stabilizes
  useEffect(() => {
    if (simulationNodes.length > 0 && !hasInitialFit) {
      const timer = setTimeout(() => {
        fitToView();
        setHasInitialFit(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [simulationNodes.length, hasInitialFit, fitToView]);

  // Handle node drag
  const handleNodeDragStart = useCallback((nodeId: string) => {
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
      className="absolute inset-0 overflow-hidden cursor-grab active:cursor-grabbing bg-black"
      onClick={handleBackgroundClick}
    >
      {/* Pure black background for maximum neon contrast */}

      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      >
        <defs>
          {/* Intense neon glow filters for each color */}
          {Object.entries(nodeTypeColors).map(([type, colors]) => (
            <React.Fragment key={type}>
              <linearGradient
                id={`link-gradient-${type}`}
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor={colors.stroke} stopOpacity={1} />
                <stop offset="100%" stopColor={colors.stroke} stopOpacity={0.8} />
              </linearGradient>
              
              {/* Intense glow filter for this color */}
              <filter id={`neon-glow-${type}`} x="-100%" y="-100%" width="300%" height="300%">
                <feFlood floodColor={colors.glow} floodOpacity="1" result="flood" />
                <feComposite in="flood" in2="SourceGraphic" operator="in" result="mask" />
                <feGaussianBlur in="mask" stdDeviation="4" result="blur1" />
                <feGaussianBlur in="mask" stdDeviation="8" result="blur2" />
                <feGaussianBlur in="mask" stdDeviation="12" result="blur3" />
                <feMerge>
                  <feMergeNode in="blur3" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </React.Fragment>
          ))}

          {/* Default intense glow filter */}
          <filter id="neon-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur1" />
            <feGaussianBlur stdDeviation="8" result="blur2" />
            <feGaussianBlur stdDeviation="12" result="blur3" />
            <feMerge>
              <feMergeNode in="blur3" />
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
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
            <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.8)" />
          </marker>
        </defs>

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.k})`}>
          {/* Render edges with intense neon glow */}
          <g className="edges">
            {simulationLinks.map((link, index) => {
              const source = link.source as SimulationNode;
              const target = link.target as SimulationNode;
              
              if (typeof source === 'string' || typeof target === 'string') return null;
              
              const isConnected = connectedEdges.has(`e${index + 1}`);
              const sourceType = source.type as NodeTypeEnum;
              const edgeColor = nodeTypeColors[sourceType]?.stroke || '#00FFFF';
              const glowFilter = `url(#neon-glow-${sourceType})`;
              
              const pathD = getLinkPath(link);
              if (!pathD) return null;
              
              return (
                <g key={`edge-${source.id}-${target.id}`}>
                  {/* Outer glow layer */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke={edgeColor}
                    strokeWidth={isConnected ? 8 : 5}
                    strokeLinecap="round"
                    filter={glowFilter}
                    initial={{ pathLength: 0, strokeOpacity: 0 }}
                    animate={{
                      pathLength: 1,
                      strokeOpacity: isConnected ? 0.8 : 0.6,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  {/* Core bright line */}
                  <motion.path
                    d={pathD}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth={isConnected ? 2.5 : 1.5}
                    strokeLinecap="round"
                    strokeDasharray={link.type === 'depends_on' ? '12,6' : undefined}
                    markerEnd={link.type === 'depends_on' ? 'url(#arrow)' : undefined}
                    initial={{ pathLength: 0, strokeOpacity: 0 }}
                    animate={{
                      pathLength: 1,
                      strokeOpacity: isConnected ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                  />
                </g>
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
                  onHover={(hovered: boolean) => hoverNode(hovered ? node.id : null)}
                  onDragStart={() => handleNodeDragStart(node.id)}
                  onDrag={(e: React.MouseEvent) => handleNodeDrag(node.id, e)}
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

