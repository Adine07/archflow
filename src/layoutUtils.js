import dagre from 'dagre';

export const getLayoutedElements = (nodes, edges, direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Setup spacing and layout direction
  const nodeWidth = 250;
  const nodeHeight = 250; // Approximating an average table height

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 100, // horizontal spacing between nodes
    ranksep: 200, // vertical spacing between ranks
  });

  nodes.forEach((node) => {
    // We pass arbitrary width and height. If the node has dynamic sizes, 
    // we would ideally read node.measured.width but this requires React Flow to have rendered it first.
    // For DBML tables, a fixed estimation works well enough.
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const newNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    // We are shifting the dagre node position (anchor=center center) 
    // to match React Flow's top left anchor
    const targetX = nodeWithPosition.x - nodeWidth / 2;
    const targetY = nodeWithPosition.y - nodeHeight / 2;

    return {
      ...node,
      position: { x: targetX, y: targetY },
    };
  });

  return { nodes: newNodes, edges };
};
