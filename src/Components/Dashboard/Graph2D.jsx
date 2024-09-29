import React, { useMemo, useState, useCallback, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const NODE_R = 8; // Node radius

const Graph = () => {
  const [data, setData] = useState({ nodes: [], links: [] });
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  // Fetch data from the JSON file
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/graphData.json'); // Adjust the path if necessary
      const graphData = await response.json();

      // Cross-link nodes with neighbors and links
      graphData.links.forEach(link => {
        const a = graphData.nodes.find(node => node.id === link.source);
        const b = graphData.nodes.find(node => node.id === link.target);
        if (a && b) {
          a.neighbors.push(b);
          b.neighbors.push(a);
          a.links.push(link);
          b.links.push(link);
        }
      });

      setData(graphData);
    };

    fetchData();
  }, []);

  // Update highlights based on state changes
  const updateHighlight = useCallback(() => {
    setHighlightNodes(new Set(highlightNodes));
    setHighlightLinks(new Set(highlightLinks));
  }, [highlightNodes, highlightLinks]);

  // Handle node hover event
    const handleNodeHover = (node) => {
      highlightNodes.clear();
      highlightLinks.clear();

      if (node) {
        highlightNodes.add(node);
        node.neighbors.forEach(neighbor => highlightNodes.add(neighbor));
        node.links.forEach(link => highlightLinks.add(link));
      }

      setHoverNode(node || null);
      updateHighlight();
    };

  // Handle link hover event
  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    setHoverNode(null); // Clear node hover when hovering a link
    updateHighlight();
  };

  const paintRing = useCallback(
    (node, ctx, globalScale) => {
      const fontSize = 12 / globalScale;
  
      // Determine the color of the node based on hover and links
      let fillColor;
      if (node === hoverNode) {
        fillColor = 'red'; // Hovered node
      } else if (node.links.some(link => highlightLinks.has(link))) {
        fillColor = 'yellow'; // Linked node
      } else {
        fillColor = node.color; // Use original node color, or default to blue
      }
  
      // Draw the node ring
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
      ctx.fillStyle = fillColor;
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 1.5;
      ctx.stroke();
  
      // Draw the label below the node (2px offset)
      ctx.font = `${fontSize}px Sans-Serif`;
      ctx.fillStyle = 'black'; // Always show the label in black
      ctx.textAlign = 'center';
      ctx.fillText(node.title, node.x, node.y + NODE_R + fontSize + 3); // 2px offset
    },
    [hoverNode, highlightLinks]
  );
  


  return (
    <div style={{ width: '100%', border:"2px solid black" }}> {/* Container with 100% width and 100vh height */}
      <ForceGraph2D
        graphData={data}
        nodeRelSize={NODE_R}
        width={1500}
        height={650}
        autoPauseRedraw={false}
        nodeAutoColorBy="type"
        linkWidth={link => (highlightLinks.has(link) ? 5 : 1)}
        linkDirectionalParticles={4}
        linkDirectionalParticleWidth={link => (highlightLinks.has(link) ? 4 : 0)}
        nodeCanvasObjectMode={node => 'before'} // Always draw before the node
        // nodeCanvasObjectMode={node => (highlightNodes.has(node) ? 'before' : "red")}

        nodeCanvasObject={paintRing}
        onNodeHover={handleNodeHover}
        onLinkHover={handleLinkHover}
      />
    </div>
  );
};

export default Graph;
