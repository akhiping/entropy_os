'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import * as d3 from 'd3';

interface PreviewNode {
  id: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
  type: 'repo' | 'doc' | 'task' | 'ai';
  label: string;
}

interface PreviewLink {
  source: PreviewNode | string;
  target: PreviewNode | string;
}

const nodeColors: Record<string, { gradient: string; glow: string }> = {
  repo: { gradient: '#667eea', glow: 'rgba(102, 126, 234, 0.5)' },
  doc: { gradient: '#f093fb', glow: 'rgba(240, 147, 251, 0.5)' },
  task: { gradient: '#4facfe', glow: 'rgba(79, 172, 254, 0.5)' },
  ai: { gradient: '#43e97b', glow: 'rgba(67, 233, 123, 0.5)' },
};

export const GraphPreview: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 900, height: 500 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const simulationRef = useRef<d3.Simulation<PreviewNode, PreviewLink> | null>(null);

  // Generate preview nodes
  const generateNodes = useCallback((): PreviewNode[] => {
    const types = ['repo', 'doc', 'task', 'ai'] as const;
    const labels = [
      'entropy-core', 'api-gateway', 'web-app', 'mobile',
      'Roadmap', 'API Docs', 'Design System', 'Research',
      'Auth Flow', 'Performance', 'Testing', 'Deploy',
      'Research AI', 'Code Agent', 'Docs Agent', 'Scheduler'
    ];
    
    return labels.map((label, i) => ({
      id: `node-${i}`,
      x: dimensions.width / 2 + (Math.random() - 0.5) * 400,
      y: dimensions.height / 2 + (Math.random() - 0.5) * 300,
      type: types[i % 4],
      label,
    }));
  }, [dimensions]);

  // Generate links
  const generateLinks = useCallback((nodes: PreviewNode[]): PreviewLink[] => {
    const links: PreviewLink[] = [];
    nodes.forEach((node, i) => {
      const numLinks = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < numLinks; j++) {
        const targetIndex = (i + j + 1 + Math.floor(Math.random() * 4)) % nodes.length;
        if (targetIndex !== i) {
          links.push({
            source: node.id,
            target: nodes[targetIndex].id,
          });
        }
      }
    });
    return links;
  }, []);

  // Handle mouse movement for node attraction
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.min(rect.width, 900),
          height: Math.min(500, window.innerHeight * 0.5),
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const nodes = generateNodes();
    const links = generateLinks(nodes);

    // Create gradient definitions
    const defs = svg.append('defs');

    Object.entries(nodeColors).forEach(([type, colors]) => {
      const gradient = defs.append('radialGradient')
        .attr('id', `gradient-${type}`)
        .attr('cx', '50%')
        .attr('cy', '50%')
        .attr('r', '50%');

      gradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', colors.gradient)
        .attr('stop-opacity', 1);

      gradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', colors.gradient)
        .attr('stop-opacity', 0.5);
    });

    // Glow filter
    const filter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');

    filter.append('feGaussianBlur')
      .attr('stdDeviation', '4')
      .attr('result', 'coloredBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Create container group
    const g = svg.append('g');

    // Create simulation
    const simulation = d3.forceSimulation<PreviewNode>(nodes)
      .force('link', d3.forceLink<PreviewNode, PreviewLink>(links)
        .id(d => d.id)
        .distance(100)
        .strength(0.3))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force('collision', d3.forceCollide().radius(40))
      .alphaDecay(0.01);

    simulationRef.current = simulation;

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'url(#link-gradient)')
      .attr('stroke-opacity', 0.2)
      .attr('stroke-width', 1.5);

    // Link gradient
    const linkGradient = defs.append('linearGradient')
      .attr('id', 'link-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');

    linkGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#667eea');

    linkGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#43e97b');

    // Create node groups
    const dragBehavior = d3.drag<SVGGElement, PreviewNode>()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    const nodeGroup = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('cursor', 'pointer')
      // @ts-expect-error - D3 drag type incompatibility with selection data
      .call(dragBehavior);

    // Node glow
    nodeGroup.append('circle')
      .attr('r', 30)
      .attr('fill', d => nodeColors[d.type].glow)
      .attr('opacity', 0.3)
      .attr('filter', 'url(#glow)')
      .attr('class', 'node-glow');

    // Node circle
    nodeGroup.append('circle')
      .attr('r', 20)
      .attr('fill', d => `url(#gradient-${d.type})`)
      .attr('stroke', 'rgba(255, 255, 255, 0.2)')
      .attr('stroke-width', 1.5)
      .on('mouseenter', function(event, d) {
        setHoveredNode(d.id);
        if (this.parentNode) {
          d3.select(this.parentNode as Element)
            .select('.node-glow')
            .transition()
            .duration(200)
            .attr('opacity', 0.6)
            .attr('r', 40);
        }
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 25);
      })
      .on('mouseleave', function() {
        setHoveredNode(null);
        if (this.parentNode) {
          d3.select(this.parentNode as Element)
            .select('.node-glow')
            .transition()
            .duration(200)
            .attr('opacity', 0.3)
            .attr('r', 30);
        }
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 20);
      });

    // Node label
    nodeGroup.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', 35)
      .attr('fill', 'rgba(255, 255, 255, 0.6)')
      .attr('font-size', '10px')
      .attr('font-family', 'Inter, sans-serif')
      .attr('pointer-events', 'none');

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as PreviewNode).x)
        .attr('y1', d => (d.source as PreviewNode).y)
        .attr('x2', d => (d.target as PreviewNode).x)
        .attr('y2', d => (d.target as PreviewNode).y);

      nodeGroup.attr('transform', d => `translate(${d.x}, ${d.y})`);
    });

    // Animate link opacity
    const animateLinks = () => {
      link
        .transition()
        .duration(2000)
        .attr('stroke-opacity', 0.3)
        .transition()
        .duration(2000)
        .attr('stroke-opacity', 0.15)
        .on('end', animateLinks);
    };
    animateLinks();

    return () => {
      simulation.stop();
    };
  }, [dimensions, generateNodes, generateLinks]);

  // Cursor attraction effect
  useEffect(() => {
    if (!simulationRef.current) return;

    const mouseForce = d3.forceManyBody<PreviewNode>()
      .strength((d) => {
        const dx = d.x - mousePos.x;
        const dy = d.y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        return dist < 150 ? -30 : 0;
      });

    simulationRef.current.force('mouse', mouseForce);
    simulationRef.current.alpha(0.1).restart();
  }, [mousePos]);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full max-w-[900px] mx-auto mt-12 rounded-3xl overflow-hidden"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.2 }}
      onMouseMove={handleMouseMove}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-surface/50 to-bg-surface/80 pointer-events-none" />
      
      {/* Border glow */}
      <div className="absolute inset-0 rounded-3xl border border-white/10" />
      
      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full"
        style={{ background: 'transparent' }}
      />

      {/* Hover tooltip */}
      {hoveredNode && (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-bg-elevated/90 backdrop-blur-xl rounded-full text-sm text-white/80 border border-white/10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          Click and drag to interact
        </motion.div>
      )}
    </motion.div>
  );
};

export default GraphPreview;

