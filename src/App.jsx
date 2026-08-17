import React, { useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
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
import TopBar from './TopBar.jsx';
import EnumModal from './EnumModal.jsx';

const nodeTypes = {
  table: TableNode,
};

const edgeTypes = {
  smart: SmartEdge,
};

export default function App() {
  const parserError = useDiagramStore((state) => state.parserError);
  const errorLocation = useDiagramStore((state) => state.errorLocation);
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const {
    dbmlString,
    nodes,
    edges,
    setDbmlString,
    onNodesChange,
    onEdgesChange,
    onConnectRelation,
    parseDbml
  } = useDiagramStore();

  // Parse DBML on initial load
  useEffect(() => {
    parseDbml();
  }, [parseDbml]);

  const decorationIds = useRef([]); 
  
  useEffect(() => {
    if (monaco && editorRef.current) {
      if (errorLocation) {
        decorationIds.current = editorRef.current.deltaDecorations(decorationIds.current, [
          {
            range: new monaco.Range(errorLocation.startLineNumber, 1, errorLocation.startLineNumber, 1),
            options: {
              isWholeLine: true,
              className: 'error-line-highlight',
              glyphMarginClassName: 'bg-red-500' 
            }
          }
        ]);
      } else {
        decorationIds.current = editorRef.current.deltaDecorations(decorationIds.current, []);
      }
    }
  }, [errorLocation, monaco]);

  const debounceTimer = useRef(null);
  const handleEditorChange = (val) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDbmlString(val || '');
    }, 300);
  };

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
    <div className="h-screen w-screen overflow-hidden bg-slate-900 text-slate-100 relative">
      <PanelGroup direction="horizontal">
        
        {/* Panel Kiri: Monaco Editor */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#1e1e1e] relative">
          {parserError && (
            <div className="absolute bottom-4 right-4 z-[100] bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-md shadow-lg text-sm max-w-md">
              ⚠️ Syntax Error: {parserError}
            </div>
          )}
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
                onMount={(editor) => { editorRef.current = editor; }}
                onChange={handleEditorChange}
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
            <TopBar />
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnectRelation}
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
      
      <EnumModal />
    </div>
  );
}
