import React, { useRef, useState, useEffect } from 'react';
import { useDiagramStore } from './useDiagramStore.jsx';
import { toPng, toSvg } from 'html-to-image';

const IconDatabase = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>;
const IconWorkflow = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>;
const IconLayers = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 12 12 17 22 12"/><polyline points="2 17 12 22 22 17"/></svg>;
const IconListPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M11 12H3"/><path d="M16 6H3"/><path d="M16 18H3"/><path d="M18 9v6"/><path d="M21 12h-6"/></svg>;
const IconTable = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></svg>;
const IconWand2 = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M21 16h-4"/><path d="M11 3H9"/></svg>;
const IconSave = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const IconFolderOpen = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-1.2-1.8A2 2 0 0 0 7.55 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>;
const IconUpload = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>;
const IconDownload = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconImage = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>;
const IconCode = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;

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
  const appMode = useDiagramStore(state => state.appMode);
  const setAppMode = useDiagramStore(state => state.setAppMode);

  const fileInputRef = useRef(null);
  const dbmlInputRef = useRef(null);
  const sqlInputRef = useRef(null);
  const fileMenuRef = useRef(null);
  const exportMenuRef = useRef(null);
  
  // Dropdown states
  const fileMenuOpen = useDiagramStore(state => state.fileMenuOpen);
  const setFileMenuOpen = useDiagramStore(state => state.setFileMenuOpen);
  const exportMenuOpen = useDiagramStore(state => state.exportMenuOpen);
  const setExportMenuOpen = useDiagramStore(state => state.setExportMenuOpen);
  const closeAllMenus = useDiagramStore(state => state.closeAllMenus);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fileMenuRef.current && !fileMenuRef.current.contains(event.target)) {
        setFileMenuOpen(false);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setExportMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    <div className="flex items-center w-full px-4 py-2 bg-[#1a1a1a] border-b border-[#2e2e2e] text-sm shadow-sm z-50">
      
      {/* GRUP KIRI: Brand & Global Actions */}
      <div className="flex-1 flex items-center justify-start gap-4">
        <div className="flex items-center gap-2 text-[#e5e7eb] font-bold text-xl tracking-tight cursor-default">
          <svg className="w-6 h-6 text-[#3b82f6]" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM6 20V4h5v7h7v9H6z"></path></svg>
          ArchFlow
        </div>
        
        <div className="flex gap-2">
          {/* FILE GROUP */}
          <div className="relative" ref={fileMenuRef}>
            <button 
              onClick={() => { setFileMenuOpen(!fileMenuOpen); setExportMenuOpen(false); }}
              className="px-3 py-1.5 hover:bg-[#202020] text-[#e5e7eb] text-xs font-medium rounded transition-colors flex items-center gap-1"
            >
              File
            </button>
            {fileMenuOpen && (
              <div className="absolute top-full mt-1 left-0 w-44 bg-[#202020] border border-[#383838] rounded shadow-xl overflow-hidden flex flex-col z-[100]">
                <button onClick={() => { exportProject(); setFileMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-[#e5e7eb] hover:bg-[#2e2e2e] flex items-center gap-2"><IconSave /> Save Project</button>
                <button onClick={() => { fileInputRef.current.click(); }} className="px-4 py-2 text-left text-xs text-[#e5e7eb] hover:bg-[#2e2e2e] flex items-center gap-2"><IconFolderOpen /> Open Project</button>
                {appMode === 'erd' && (
                  <>
                    <button onClick={() => { dbmlInputRef.current.click(); }} className="px-4 py-2 text-left text-xs text-[#e5e7eb] hover:bg-[#2e2e2e] border-t border-[#383838] flex items-center gap-2"><IconUpload /> Import DBML</button>
                    <button onClick={() => { sqlInputRef.current.click(); }} className="px-4 py-2 text-left text-xs text-[#e5e7eb] hover:bg-[#2e2e2e] flex items-center gap-2"><IconCode /> Import SQL</button>
                  </>
                )}
              </div>
            )}
            <input type="file" accept=".dbmlproj" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            {appMode === 'erd' && (
              <>
                <input type="file" accept=".dbml" className="hidden" ref={dbmlInputRef} onChange={handleDbmlImport} />
                <input type="file" accept=".sql" className="hidden" ref={sqlInputRef} onChange={handleSqlImport} />
              </>
            )}
          </div>

          {/* EXPORT GROUP */}
          <div className="relative" ref={exportMenuRef}>
            <button 
              onClick={() => { setExportMenuOpen(!exportMenuOpen); setFileMenuOpen(false); }}
              className="px-3 py-1.5 hover:bg-[#202020] text-[#e5e7eb] text-xs font-medium rounded transition-colors flex items-center gap-1"
            >
              Export
            </button>
            {exportMenuOpen && (
              <div className="absolute top-full mt-1 left-0 w-48 bg-[#202020] border border-[#383838] rounded shadow-xl overflow-hidden flex flex-col z-[100]">
                <button onClick={() => { handleDownloadImage('png'); setExportMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-[#e5e7eb] hover:bg-[#2e2e2e] flex items-center gap-2"><IconImage /> Export PNG</button>
                <button onClick={() => { handleDownloadImage('svg'); setExportMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-[#e5e7eb] hover:bg-[#2e2e2e] flex items-center gap-2"><IconImage /> Export SVG</button>
                {appMode === 'erd' && (
                  <>
                    <button onClick={() => { exportSQL(); setExportMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-[#e5e7eb] hover:bg-[#2e2e2e] border-t border-[#383838] flex items-center gap-2"><IconCode /> Export SQL (MySQL)</button>
                    <button onClick={() => { exportDBML(); setExportMenuOpen(false); }} className="px-4 py-2 text-left text-xs text-[#e5e7eb] hover:bg-[#2e2e2e] flex items-center gap-2"><IconDownload /> Export DBML</button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GRUP TENGAH: Mode Switcher */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2 bg-[#202020] p-1 rounded-md shadow-inner border border-[#383838]">
        <button
          onClick={() => setAppMode('erd')}
          className={`px-4 py-1.5 flex items-center gap-2 text-xs font-medium rounded-md transition-all ${appMode === 'erd' ? 'bg-[#3b82f6] text-[#ffffff] shadow' : 'text-[#9ca3af] hover:text-[#e5e7eb] hover:bg-[#2e2e2e]'}`}
        >
          <IconDatabase /> Database
        </button>
        <button
          onClick={() => setAppMode('flowchart')}
          className={`px-4 py-1.5 flex items-center gap-2 text-xs font-medium rounded-md transition-all ${appMode === 'flowchart' ? 'bg-[#3b82f6] text-[#ffffff] shadow' : 'text-[#9ca3af] hover:text-[#e5e7eb] hover:bg-[#2e2e2e]'}`}
        >
          <IconWorkflow /> Flowchart
        </button>
        <button
          onClick={() => setAppMode('userstory')}
          className={`px-4 py-1.5 flex items-center gap-2 text-xs font-medium rounded-md transition-all ${appMode === 'userstory' ? 'bg-[#3b82f6] text-[#ffffff] shadow' : 'text-[#9ca3af] hover:text-[#e5e7eb] hover:bg-[#2e2e2e]'}`}
        >
          <IconLayers /> User Story
        </button>
        </div>
      </div>

      {/* GRUP KANAN: Diagram Tools (Conditional Rendering) */}
      <div className="flex-1 flex items-center justify-end gap-2">
        {appMode === 'erd' && (
          <div className="flex bg-[#202020] rounded shadow-sm border border-[#383838] overflow-hidden">
             <button 
              onClick={addNewEnum}
              className="px-3 py-1.5 hover:bg-[#2e2e2e] text-teal-400 border-r border-[#383838] text-xs font-medium transition-colors flex items-center gap-2"
              title="Add Enum"
            >
              <IconListPlus /> Enum
            </button>
            <button 
              onClick={addNewTable}
              className="px-3 py-1.5 hover:bg-[#2e2e2e] text-indigo-400 border-r border-[#383838] text-xs font-medium transition-colors flex items-center gap-2"
              title="Add Table"
            >
              <IconTable /> Table
            </button>
            <button 
              onClick={applyAutoLayout}
              className="px-3 py-1.5 hover:bg-[#2e2e2e] text-[#3b82f6] text-xs font-medium transition-colors flex items-center gap-2"
              title="Auto Layout"
            >
              <IconWand2 /> Layout
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
