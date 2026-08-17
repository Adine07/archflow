import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useDiagramStore } from './useDiagramStore.jsx';

export default function TableNode({ data }) {
  const updateColumnName = useDiagramStore(state => state.updateColumnName);
  const updateTableName = useDiagramStore(state => state.updateTableName);
  const updateColumnType = useDiagramStore(state => state.updateColumnType);
  const addNewColumn = useDiagramStore(state => state.addNewColumn);
  const moveColumn = useDiagramStore(state => state.moveColumn);
  const parserError = useDiagramStore(state => state.parserError);
  const parsedEnums = useDiagramStore(state => state.parsedEnums);
  const openEnumModal = useDiagramStore(state => state.openEnumModal);
  
  const [editingColumn, setEditingColumn] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  const [editingType, setEditingType] = useState(null);
  const [editTypeValue, setEditTypeValue] = useState("");
  
  const [isEditingTable, setIsEditingTable] = useState(false);
  const [editTableValue, setEditTableValue] = useState("");

  const handleTableDoubleClick = () => {
    if (parserError) {
      alert('Perbaiki syntax error di editor terlebih dahulu!');
      return;
    }
    setIsEditingTable(true);
    setEditTableValue(data.name);
  };

  const handleTableSave = () => {
    if (editTableValue.trim() && editTableValue !== data.name) {
      updateTableName(data.name, editTableValue.trim());
    }
    setIsEditingTable(false);
  };

  const handleDoubleClick = (colName) => {
    if (parserError) {
      alert('Perbaiki syntax error di editor terlebih dahulu!');
      return;
    }
    setEditingColumn(colName);
    setEditValue(colName);
  };

  const handleSave = (oldName) => {
    if (editValue.trim() && editValue !== oldName) {
      updateColumnName(data.name, oldName, editValue.trim());
    }
    setEditingColumn(null);
  };

  const handleTypeDoubleClick = (colName, oldType) => {
    if (parserError) {
      alert('Perbaiki syntax error di editor terlebih dahulu!');
      return;
    }
    setEditingType(colName);
    setEditTypeValue(oldType);
  };

  const handleTypeSave = (colName, oldType) => {
    if (editTypeValue.trim() && editTypeValue !== oldType) {
      updateColumnType(data.name, colName, editTypeValue.trim());
    }
    setEditingType(null);
  };
  return (
    <div className="min-w-[200px] w-max rounded-md border border-[#383838] bg-[#202020] text-[#e5e7eb] shadow-lg">
      
      <div className="bg-[#1a1a1a] px-4 py-2 text-center text-sm font-bold rounded-t-md border-b border-[#383838]">
        {isEditingTable ? (
          <input
            autoFocus
            type="text"
            value={editTableValue}
            onChange={(e) => setEditTableValue(e.target.value)}
            onBlur={handleTableSave}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleTableSave();
              if (e.key === 'Escape') setIsEditingTable(false);
            }}
            className="bg-[#202020] text-[#e5e7eb] border border-[#3b82f6] rounded px-1 outline-none w-full text-center"
          />
        ) : (
          <span 
            onDoubleClick={handleTableDoubleClick}
            className={`block ${parserError ? 'cursor-not-allowed text-red-300' : 'cursor-pointer hover:text-blue-300'}`}
            title={parserError ? "Fix syntax error to edit" : "Double-click to edit table name"}
          >
            {data.name}
          </span>
        )}
      </div>
      
      <div className="flex flex-col py-3 font-mono text-xs gap-1">
        {data.fields.map((f, i) => (
          <div key={i} className="group relative flex justify-between items-center gap-6 px-4 py-1">
            
            <div className="absolute left-0 flex flex-col opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-[#202020]">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (!parserError) moveColumn(data.name, f.name, 'up');
                }}
                className={`text-[10px] leading-none text-[#9ca3af] hover:text-[#3b82f6] p-0.5 ${parserError ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                title="Move Up"
                disabled={!!parserError}
              >
                ↑
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (!parserError) moveColumn(data.name, f.name, 'down');
                }}
                className={`text-[10px] leading-none text-[#9ca3af] hover:text-[#3b82f6] p-0.5 ${parserError ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                title="Move Down"
                disabled={!!parserError}
              >
                ↓
              </button>
            </div>

            <Handle 
              type="target" 
              position={Position.Left} 
              id={`${f.name}-left`}
              className="w-2 h-2 !bg-[#9ca3af] border-none" 
              style={{ left: -4 }}
            />
            
            {editingColumn === f.name ? (
              <input
                autoFocus
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={() => handleSave(f.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave(f.name);
                  if (e.key === 'Escape') setEditingColumn(null);
                }}
                className="bg-[#202020] text-[#e5e7eb] border border-[#3b82f6] rounded px-1 outline-none w-24"
              />
            ) : (
              <span 
                onDoubleClick={() => handleDoubleClick(f.name)}
                className={parserError ? 'cursor-not-allowed text-red-300' : 'cursor-pointer hover:text-blue-300'}
                title={parserError ? "Fix syntax error to edit" : "Double-click to edit"}
              >
                {f.name}
              </span>
            )}
            {editingType === f.name ? (
              <input
                autoFocus
                type="text"
                value={editTypeValue}
                onChange={(e) => setEditTypeValue(e.target.value)}
                onBlur={() => handleTypeSave(f.name, f.type.type_name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleTypeSave(f.name, f.type.type_name);
                  if (e.key === 'Escape') setEditingType(null);
                }}
                className="bg-[#202020] text-[#e5e7eb] border border-emerald-500 rounded px-1 outline-none w-24 text-right"
              />
            ) : (
              <div className="flex items-center">
                <span 
                  onDoubleClick={() => handleTypeDoubleClick(f.name, f.type.type_name)}
                  className={`text-[#9ca3af] ${parserError ? 'cursor-not-allowed text-red-300' : 'cursor-pointer hover:text-emerald-300'}`}
                  title={parserError ? "Fix syntax error to edit" : "Double-click to edit type"}
                >
                  {f.type.type_name}
                </span>
                {parsedEnums.some(e => e.name === f.type.type_name) && (
                  <span 
                    onClick={() => {
                      if (!parserError) openEnumModal(f.type.type_name);
                      else alert('Perbaiki syntax error di editor terlebih dahulu!');
                    }}
                    className={`text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded ml-2 ${parserError ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-emerald-500/40 transition-colors'}`}
                    title="Edit Enum options"
                  >
                    E
                  </span>
                )}
              </div>
            )}
            
            <Handle 
              type="source" 
              position={Position.Right} 
              id={`${f.name}-right`}
              className="w-2 h-2 !bg-[#9ca3af] border-none" 
              style={{ right: -4 }}
            />
          </div>
        ))}
      </div>

      <div 
        onClick={() => {
          if (!parserError) addNewColumn(data.name);
          else alert('Perbaiki syntax error di editor terlebih dahulu!');
        }}
        className={`text-xs text-center py-1.5 border-t border-[#383838] bg-[#202020] rounded-b-md transition-colors ${parserError ? 'cursor-not-allowed text-red-400' : 'cursor-pointer text-[#9ca3af] hover:text-[#e5e7eb] hover:bg-[#2e2e2e]'}`}
      >
        + Add Field
      </div>
    </div>
  );
}
