import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useDiagramStore } from './useDiagramStore.jsx';

export default function TableNode({ data }) {
  const updateColumnName = useDiagramStore(state => state.updateColumnName);
  const [editingColumn, setEditingColumn] = useState(null);
  const [editValue, setEditValue] = useState("");

  const handleDoubleClick = (colName) => {
    setEditingColumn(colName);
    setEditValue(colName);
  };

  const handleSave = (oldName) => {
    if (editValue.trim() && editValue !== oldName) {
      updateColumnName(data.name, oldName, editValue.trim());
    }
    setEditingColumn(null);
  };
  return (
    <div className="min-w-[200px] w-max rounded-md border border-slate-700 bg-slate-800 text-slate-100 shadow-lg">
      
      <div className="bg-slate-900 px-4 py-2 text-center text-sm font-bold rounded-t-md border-b border-slate-700">
        {data.name}
      </div>
      
      <div className="flex flex-col py-3 font-mono text-xs gap-1">
        {data.fields.map((f, i) => (
          <div key={i} className="relative flex justify-between items-center gap-6 px-4 py-1">
            <Handle 
              type="target" 
              position={Position.Left} 
              id={`${f.name}-left`}
              className="w-2 h-2 !bg-slate-400 border-none" 
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
                className="bg-slate-700 text-slate-100 border border-blue-500 rounded px-1 outline-none w-24"
              />
            ) : (
              <span 
                onDoubleClick={() => handleDoubleClick(f.name)}
                className="cursor-pointer hover:text-blue-300"
                title="Double-click to edit"
              >
                {f.name}
              </span>
            )}
            <span className="text-slate-400">{f.type.type_name}</span>
            
            <Handle 
              type="source" 
              position={Position.Right} 
              id={`${f.name}-right`}
              className="w-2 h-2 !bg-slate-400 border-none" 
              style={{ right: -4 }}
            />
          </div>
        ))}
      </div>

    </div>
  );
}
