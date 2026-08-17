import React, { useState, useEffect } from 'react';
import { useDiagramStore } from './useDiagramStore.jsx';

export default function EnumModal() {
  const activeEnumModal = useDiagramStore(state => state.activeEnumModal);
  const closeEnumModal = useDiagramStore(state => state.closeEnumModal);
  const parsedEnums = useDiagramStore(state => state.parsedEnums);
  const updateEnumName = useDiagramStore(state => state.updateEnumName);
  const updateEnumValue = useDiagramStore(state => state.updateEnumValue);
  const addEnumValue = useDiagramStore(state => state.addEnumValue);
  const deleteEnumValue = useDiagramStore(state => state.deleteEnumValue);
  const parserError = useDiagramStore(state => state.parserError);

  const [editingValue, setEditingValue] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  const [isEditingEnumName, setIsEditingEnumName] = useState(false);
  const [editEnumName, setEditEnumName] = useState("");

  if (!activeEnumModal) return null;

  const currentEnum = parsedEnums.find(e => e.name === activeEnumModal);
  if (!currentEnum) {
    // If the enum was deleted or renamed from the text editor, close the modal
    closeEnumModal();
    return null;
  }

  const handleEnumSave = () => {
    if (editEnumName.trim() && editEnumName !== currentEnum.name && !parserError) {
      updateEnumName(currentEnum.name, editEnumName.trim());
    }
    setIsEditingEnumName(false);
  };

  const handleValueSave = (oldName) => {
    if (editValue.trim() && editValue !== oldName && !parserError) {
      updateEnumValue(currentEnum.name, oldName, editValue.trim());
    }
    setEditingValue(null);
  };

  const handleDeleteValue = (valName) => {
    if (!parserError) {
      deleteEnumValue(currentEnum.name, valName);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg shadow-2xl border border-slate-700 w-full max-w-sm flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">E</span>
            {isEditingEnumName ? (
              <input
                autoFocus
                type="text"
                value={editEnumName}
                onChange={(e) => setEditEnumName(e.target.value)}
                onBlur={handleEnumSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEnumSave();
                  if (e.key === 'Escape') setIsEditingEnumName(false);
                }}
                className="bg-slate-700 text-slate-100 border border-emerald-500 rounded px-1.5 py-0.5 outline-none text-sm w-32"
              />
            ) : (
              <h3 
                className={`text-slate-100 font-bold cursor-pointer hover:text-emerald-300 ${parserError ? 'opacity-50 pointer-events-none' : ''}`}
                onDoubleClick={() => {
                  setEditEnumName(currentEnum.name);
                  setIsEditingEnumName(true);
                }}
                title="Double click to edit Enum name"
              >
                {currentEnum.name}
              </h3>
            )}
          </div>
          <button 
            onClick={closeEnumModal}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Values List */}
        <div className="p-4 flex flex-col gap-2 max-h-64 overflow-y-auto font-mono text-sm">
          {currentEnum.values.length === 0 && (
            <div className="text-slate-500 text-xs text-center italic py-4">No options available</div>
          )}
          {currentEnum.values.map((v, i) => (
            <div key={i} className="flex justify-between items-center group">
              {editingValue === v.name ? (
                <input
                  autoFocus
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={() => handleValueSave(v.name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleValueSave(v.name);
                    if (e.key === 'Escape') setEditingValue(null);
                  }}
                  className="bg-slate-700 text-slate-100 border border-emerald-500 rounded px-2 py-1 outline-none w-full"
                />
              ) : (
                <div className="flex justify-between items-center w-full px-2 py-1 rounded hover:bg-slate-700/50">
                  <span 
                    onDoubleClick={() => {
                      if (!parserError) {
                        setEditingValue(v.name);
                        setEditValue(v.name);
                      }
                    }}
                    className={`text-slate-300 ${parserError ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-emerald-300'}`}
                    title="Double click to edit option"
                  >
                    {v.name}
                  </span>
                  <button 
                    onClick={() => handleDeleteValue(v.name)}
                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete option"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer / Add Button */}
        <div className="p-3 border-t border-slate-700 bg-slate-900/50">
          <button
            onClick={() => {
              if (!parserError) addEnumValue(currentEnum.name);
              else alert('Perbaiki syntax error di editor terlebih dahulu!');
            }}
            disabled={!!parserError}
            className="w-full flex items-center justify-center gap-1 text-sm font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 rounded py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Option
          </button>
        </div>

      </div>
    </div>
  );
}
