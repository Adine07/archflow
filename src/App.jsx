import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';
import {
  ReactFlow,
  Background,
  Controls,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useDiagramStore } from './useDiagramStore.jsx';
import TableNode from './TableNode.jsx';
import SmartEdge from './SmartEdge.jsx';

const nodeTypes = {
  table: TableNode,
};

const edgeTypes = {
  smart: SmartEdge,
};

export default function App() {
  const {
    dbmlString,
    nodes,
    edges,
    setDbmlString,
    onNodesChange,
    onEdgesChange,
    parseDbml
  } = useDiagramStore();

  // Parse DBML on initial load
  useEffect(() => {
    parseDbml();
  }, [parseDbml]);

  const handleEditorWillMount = (monaco) => {
    monaco.languages.register({ id: 'dbml' });
    monaco.languages.setMonarchTokensProvider('dbml', {
      tokenizer: {
        root: [
          [/\b(Table|Ref|Enum|Project|TableGroup)\b/, 'keyword'],
          [/\b(primary key|null|not null|unique|increment|pk)\b/, 'keyword'],
          [/\b(integer|varchar|timestamp|text|boolean|int|datetime|float|number)\b/, 'type'],
          [/[<>-]/, 'operator'],
          [/\/\/.*$/, 'comment'],
          [/".*?"/, 'string'],
          [/\'.*?\'/, 'string'],
          [/\[.*?\]/, 'annotation'],
        ],
      },
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100">
      <PanelGroup direction="horizontal">
        
        {/* Panel Kiri: Monaco Editor */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e]">
          <div className="flex h-10 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Monaco Editor
            </span>
            <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
              DBML
            </span>
          </div>
          <div className="relative flex-1">
            <div className="h-full w-full" onKeyDown={(e) => e.stopPropagation()}>
              <Editor
                height="100%"
                defaultLanguage="dbml"
                theme="vs-dark"
                value={dbmlString}
                beforeMount={handleEditorWillMount}
                onChange={(val) => setDbmlString(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </div>
        </Panel>

        {/* Resizable Divider */}
        <PanelResizeHandle className="w-1.5 bg-slate-800 hover:bg-blue-500 active:bg-blue-600 transition-colors cursor-col-resize z-10" />

        {/* Panel Kanan: React Flow Canvas */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col bg-slate-950 relative">
          <div className="flex h-10 items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 text-xs font-medium text-slate-300">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Diagram Canvas (React Flow)
            </span>
            <span className="text-[11px] text-slate-500">Canvas Ready</span>
          </div>
          <div className="flex-1 w-full relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              panActivationKeyCode={null}
              fitView
              colorMode="dark"
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
            >
              <Background color="#334155" gap={16} size={1} />
              <Controls className="!bg-slate-800 !border-slate-700 !fill-slate-200" />
            </ReactFlow>
          </div>
        </Panel>

      </PanelGroup>
    </div>
  );
}
