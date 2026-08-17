import React, { useRef, useState } from 'react';
import { useDiagramStore } from './useDiagramStore.jsx';
import { toPng, toSvg } from 'html-to-image';

export default function TopBar() {
  const applyAutoLayout = useDiagramStore(state => state.applyAutoLayout);
  const addNewTable = useDiagramStore(state => state.addNewTable);
  const addNewEnum = useDiagramStore(state => state.addNewEnum);
  const exportProject = useDiagramStore(state => state.exportProject);
  const importProject = useDiagramStore(state => state.importProject);
  const importDBMLFile = useDiagramStore(state => state.importDBMLFile);
  const importSQLFile = useDiagramStore(state => state.importSQLFile);
  const exportSQL = useDiagramStore(state => state.exportSQL);
  const exportDBML = useDiagramStore(state => state.exportDBML);

  const fileInputRef = useRef(null);
  const dbmlInputRef = useRef(null);
  const sqlInputRef = useRef(null);
  
  // Dropdown states
  const [fileMenuOpen, setFileMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const handleDownloadImage = (format = 'png') => {
    const viewportNode = document.querySelector('.react-flow__viewport');
    if (!viewportNode) return;

    const options = {
      backgroundColor: '#020617', // slate-950
      width: viewportNode.scrollWidth,
      height: viewportNode.scrollHeight,
      fontEmbedCSS: '', 
      filter: (node) => {
        if (node.tagName === 'LINK') return false;
        return true;
      },
      style: {
        width: viewportNode.scrollWidth + 'px',
        height: viewportNode.scrollHeight + 'px',
        transform: 'translate(0, 0) scale(1)',
      },
    };

    const convert = format === 'svg' ? toSvg : toPng;
    
    convert(viewportNode, options)
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `diagram.${format}`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error(`Failed to export ${format}:`, err);
      });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importProject(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
    setFileMenuOpen(false);
  };

  const handleDbmlImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importDBMLFile(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
    setFileMenuOpen(false);
  };

  const handleSqlImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      importSQLFile(event.target.result);
    };
    reader.readAsText(file);
    e.target.value = '';
    setFileMenuOpen(false);
  };

  // Close menus when clicking outside could be added, but for simplicity toggling is fine.

  return (
    <div className="w-full bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 py-2 shadow-sm z-50">
      
      {/* LEFT: Brand & Global Actions */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-slate-100 font-bold text-sm tracking-tight cursor-default">
          <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"></path></svg>
          DBML Diagrammer
        </div>
        
        <div className="flex gap-2">
          {/* FILE GROUP */}
          <div className="relative">
            <button 
              onClick={() => { setFileMenuOpen(!fileMenuOpen); setExportMenuOpen(false); }}
              className="px-3 py-1.5 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded transition-colors flex items-center gap-1"
            >
              File
            </button>
            {fileMenuOpen && (
              <div className="absolute top-full mt-1 left-0 w-36 bg-slate-800 border border-slate-700 rounded shadow-xl overflow-hidden flex flex-col z-[100]">
                <button onClick={() => { exportProject(); setFileMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700">Save Project</button>
                <button onClick={() => { fileInputRef.current.click(); }} className="px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700">Open Project</button>
                <button onClick={() => { dbmlInputRef.current.click(); }} className="px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700 border-t border-slate-700">Import DBML</button>
                <button onClick={() => { sqlInputRef.current.click(); }} className="px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700">Import SQL</button>
              </div>
            )}
            <input type="file" accept=".dbmlproj" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <input type="file" accept=".dbml" className="hidden" ref={dbmlInputRef} onChange={handleDbmlImport} />
            <input type="file" accept=".sql" className="hidden" ref={sqlInputRef} onChange={handleSqlImport} />
          </div>

          {/* EXPORT GROUP */}
          <div className="relative">
            <button 
              onClick={() => { setExportMenuOpen(!exportMenuOpen); setFileMenuOpen(false); }}
              className="px-3 py-1.5 hover:bg-slate-800 text-slate-300 text-xs font-medium rounded transition-colors flex items-center gap-1"
            >
              Export
            </button>
            {exportMenuOpen && (
              <div className="absolute top-full mt-1 left-0 w-40 bg-slate-800 border border-slate-700 rounded shadow-xl overflow-hidden flex flex-col z-[100]">
                <button onClick={() => { handleDownloadImage('png'); setExportMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700">Export PNG</button>
                <button onClick={() => { handleDownloadImage('svg'); setExportMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700">Export SVG</button>
                <button onClick={() => { exportSQL(); setExportMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700">Export SQL (MySQL)</button>
                <button onClick={() => { exportDBML(); setExportMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-slate-200 hover:bg-slate-700 border-t border-slate-700">Export DBML (.dbml)</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Diagram Tools */}
      <div className="flex bg-slate-800 rounded shadow-sm border border-slate-700 overflow-hidden">
         <button 
          onClick={addNewEnum}
          className="px-3 py-1.5 hover:bg-slate-700 text-teal-400 border-r border-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
          title="Add Enum"
        >
          + Enum
        </button>
        <button 
          onClick={addNewTable}
          className="px-3 py-1.5 hover:bg-slate-700 text-indigo-400 border-r border-slate-700 text-xs font-medium transition-colors flex items-center gap-1"
          title="Add Table"
        >
          + Table
        </button>
        <button 
          onClick={applyAutoLayout}
          className="px-3 py-1.5 hover:bg-slate-700 text-blue-400 text-xs font-medium transition-colors flex items-center gap-1"
          title="Auto Layout"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Layout
        </button>
      </div>

    </div>
  );
}
