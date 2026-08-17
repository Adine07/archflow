import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useReactFlow,
  MarkerType,
  ConnectionMode,
} from '@xyflow/react';
import { useDiagramStore } from '../useDiagramStore.jsx';
import { 
  ProcessNode, DecisionNode, TerminatorNode, DataNode, DatabaseNode,
  SubprocessNode, DocumentNode, NoteNode
} from './FlowNodes.jsx';

const nodeTypes = {
  process: ProcessNode,
  decision: DecisionNode,
  terminator: TerminatorNode,
  data: DataNode,
  database: DatabaseNode,
  subprocess: SubprocessNode,
  document: DocumentNode,
  note: NoteNode,
};

export default function FlowCanvas() {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  
  const {
    flowNodes,
    flowEdges,
    onFlowNodesChange,
    onFlowEdgesChange,
    onFlowConnect,
    addFlowNode,
    closeAllMenus,
  } = useDiagramStore();

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      addFlowNode(type, position);
    },
    [screenToFlowPosition, addFlowNode]
  );

  return (
    <div className="flex-1 w-full h-full relative bg-slate-950" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={onFlowNodesChange}
        onEdgesChange={onFlowEdgesChange}
        onConnect={onFlowConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        colorMode="dark"
        connectionMode={ConnectionMode.Loose}
        onPaneClick={closeAllMenus}
        defaultEdgeOptions={{ 
          type: 'smoothstep', 
          markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' }, 
          style: { strokeWidth: 2, stroke: '#94a3b8' } 
        }}
      >
        <Background color="#334155" gap={16} size={1} />
        <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-200" />
      </ReactFlow>
    </div>
  );
}
