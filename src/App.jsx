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
import FlowSidebar from './components/FlowSidebar.jsx';
import FlowCanvas from './components/FlowCanvas.jsx';
import { ReactFlowProvider } from '@xyflow/react';

const nodeTypes = {
  table: TableNode,
};

const edgeTypes = {
  smart: SmartEdge,
};

export default function App() {
  const parserError = useDiagramStore((state) => state.parserError);
  const errorLocation = useDiagramStore((state) => state.errorLocation);
  const appMode = useDiagramStore((state) => state.appMode);
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
    parseDbml,
    closeAllMenus
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
    <div className="h-screen w-screen overflow-hidden bg-[#141414] text-[#e5e7eb] flex flex-col relative">
      <TopBar />
      <div className="flex-1 overflow-hidden relative">
        
        {appMode === 'erd' && (
          <PanelGroup direction="horizontal">
          
          {/* Panel Kiri: Monaco Editor */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#141414] relative border-r border-[#2e2e2e]">
          {parserError && (
            <div className="absolute bottom-4 right-4 z-[100] bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded-md shadow-lg text-sm max-w-md flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
              Syntax Error: {parserError}
            </div>
          )}
          <div className="flex h-10 items-center justify-between border-b border-[#2e2e2e] bg-[#1a1a1a]/80 px-4 text-xs font-medium text-[#e5e7eb]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-500"></span>
              Monaco Editor
            </span>
            <span className="rounded bg-[#202020] border border-[#383838] px-2 py-0.5 text-[10px] text-[#9ca3af]">
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
        <PanelResizeHandle className="w-1.5 bg-[#2e2e2e] hover:bg-[#3b82f6] active:bg-[#3b82f6] transition-colors cursor-col-resize z-10" />

        {/* Panel Kanan: React Flow Canvas */}
        <Panel defaultSize={50} minSize={20} className="flex flex-col bg-[#141414] relative">
          <div className="flex h-10 items-center justify-between border-b border-[#2e2e2e] bg-[#1a1a1a]/80 px-4 text-xs font-medium text-[#e5e7eb]">
            <span className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              Diagram Canvas (React Flow)
            </span>
            <span className="text-[11px] text-[#9ca3af]">Canvas Ready</span>
          </div>
          <div className="flex-1 w-full relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnectRelation}
              onPaneClick={closeAllMenus}
              panActivationKeyCode={null}
              fitView
              colorMode="dark"
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
            >
              <Background color="#2e2e2e" gap={16} size={1} />
              <Controls className="!bg-[#202020] !border-[#383838] !fill-[#e5e7eb]" />
            </ReactFlow>
          </div>
        </Panel>

          </PanelGroup>
        )}

        {appMode === 'flowchart' && (
          <div className="flex-1 h-full w-full flex">
            <ReactFlowProvider>
              <FlowSidebar />
              <FlowCanvas />
            </ReactFlowProvider>
          </div>
        )}

        {appMode === 'userstory' && (
          <div className="flex-1 h-full w-full flex items-center justify-center bg-[#141414]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#e5e7eb] mb-2">User Story Workspace</h2>
              <p className="text-[#9ca3af]">(Coming Soon)</p>
            </div>
          </div>
        )}
      </div>
      
      {appMode === 'erd' && <EnumModal />}
    </div>
  );
}
