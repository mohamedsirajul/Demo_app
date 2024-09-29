import React, { useEffect, useState, useRef, useCallback } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';

const NODE_R = 5; // Node radius

const Graph = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);
  const fgRef = useRef(); // Reference for the ForceGraph3D component

  useEffect(() => {
    // Fetching data from the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch('/graphData.json'); // Adjust the path as needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();

        // Cross-link nodes with neighbors and links
        jsonData.links.forEach(link => {
          const a = jsonData.nodes.find(node => node.id === link.source);
          const b = jsonData.nodes.find(node => node.id === link.target);
          if (a && b) {
            a.neighbors = a.neighbors || [];
            b.neighbors = b.neighbors || [];
            a.links = a.links || [];
            b.links = b.links || [];
            a.neighbors.push(b);
            b.neighbors.push(a);
            a.links.push(link);
            b.links.push(link);
          }
        });

        setGraphData(jsonData);
      } catch (error) {
        console.error('Error fetching the graph data:', error);
      }
    };

    fetchData();
  }, []);

  const handleNodeClick = (node) => {
    // Aim at node from outside it
    const distance = 40;
    const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
    fgRef.current.cameraPosition(
      { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // New position
      node, // LookAt
      3000  // Transition duration in ms
    );
  };

  const handleNodeHover = (node) => {
    const newHighlightNodes = new Set();
    const newHighlightLinks = new Set();

    if (node) {
      newHighlightNodes.add(node);
      node.neighbors.forEach(neighbor => newHighlightNodes.add(neighbor));
      node.links.forEach(link => newHighlightLinks.add(link));
    }

    setHoverNode(node || null);
    setHighlightNodes(newHighlightNodes);
    setHighlightLinks(newHighlightLinks);
  };

  const isNodeHighlighted = (node) => {
    return highlightNodes.has(node);
  };

  const nodeThreeObject = useCallback((node) => {
    // Create a sphere to represent the node
    const sphere = new THREE.SphereGeometry(NODE_R, 16, 16);
    const color = isNodeHighlighted(node) ? 'yellow' : node.color; // Use helper function to determine color
    const material = new THREE.MeshBasicMaterial({ color });
    const mesh = new THREE.Mesh(sphere, material);

    const group = new THREE.Group();
    group.add(mesh);

    return group;
  }, [highlightNodes.size]); // Only listen to size changes, not the entire Set

  return (
    <div style={{ width: '100%', border:"2px solid black" }}> {/* Container with 100% width and 100vh height */}
      <ForceGraph3D
        ref={fgRef}
        graphData={graphData}
        onNodeClick={handleNodeClick}
        nodeLabel="title"
        width={1520}
        height={650}
        nodeAutoColorBy="type"
        onNodeHover={handleNodeHover} 
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        // linkCurvature={0.80}
        // nodeThreeObject={nodeThreeObject}
        // linkWidth={link => (highlightLinks.has(link) ? 5 : 1)} // Change link width if highlighted
        linkWidth={link => (highlightLinks.has(link) ? 5 : 0.5)} // Thinner links for better visibility
        // linkCurvature={0.1} // Slight curvature for link clarity
      />
    </div>
  );
};

export default Graph;
