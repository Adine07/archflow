import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { useDiagramStore } from '../useDiagramStore.jsx';

// HOC / Helper for Editable Text
const EditableLabel = ({ id, label }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const updateFlowNodeLabel = useDiagramStore(state => state.updateFlowNodeLabel);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    updateFlowNodeLabel(id, editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  };

  if (isEditing) {
    return (
      <textarea
        autoFocus
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-full h-full bg-transparent text-inherit text-center focus:outline-none resize-none overflow-hidden p-1"
      />
    );
  }

  return (
    <div onDoubleClick={handleDoubleClick} className="text-center w-full cursor-text pointer-events-auto select-none">
      {label}
    </div>
  );
};

const handleStyle = "w-2 h-2 bg-[#9ca3af] border-none";
const handleZ50Style = "w-2 h-2 bg-[#9ca3af] border-none z-50";

// Process Node
export const ProcessNode = ({ id, data }) => {
  return (
    <div className="w-40 h-16 flex-shrink-0 whitespace-normal break-words px-2 leading-tight border-2 border-[#383838] bg-[#202020] rounded-md flex items-center justify-center text-sm text-[#e5e7eb] shadow-lg">
      <Handle type="source" position={Position.Top} id="top" className={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" className={handleStyle} />
      <EditableLabel id={id} label={data.label} />
    </div>
  );
};

// Decision Node
export const DecisionNode = ({ id, data }) => {
  return (
    <div className="relative w-32 h-32 flex-shrink-0 whitespace-normal break-words px-2 leading-tight flex items-center justify-center">
      <div className="absolute inset-0 border-2 border-[#383838] bg-[#202020] rotate-45 shadow-lg"></div>
      <div className="relative z-10 text-sm text-[#e5e7eb] text-center w-full">
        <EditableLabel id={id} label={data.label} />
      </div>
      <Handle type="source" position={Position.Top} id="top" className={handleZ50Style} />
      <Handle type="source" position={Position.Left} id="left" className={handleZ50Style} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleZ50Style} />
      <Handle type="source" position={Position.Right} id="right" className={handleZ50Style} />
    </div>
  );
};

// Terminator Node
export const TerminatorNode = ({ id, data }) => {
  return (
    <div className="w-32 h-12 flex-shrink-0 whitespace-normal break-words px-2 leading-tight border-2 border-[#383838] bg-[#202020] rounded-full flex items-center justify-center text-sm text-[#e5e7eb] shadow-lg">
      <Handle type="source" position={Position.Top} id="top" className={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" className={handleStyle} />
      <EditableLabel id={id} label={data.label} />
    </div>
  );
};

// Data Node (Input/Output)
export const DataNode = ({ id, data }) => {
  return (
    <div className="w-36 h-14 flex-shrink-0 whitespace-normal break-words px-2 leading-tight border-2 border-[#383838] bg-[#202020] -skew-x-12 flex items-center justify-center shadow-lg relative">
      <div className="skew-x-12 w-full text-sm text-[#e5e7eb] flex items-center justify-center absolute inset-0 px-2">
         <EditableLabel id={id} label={data.label} />
      </div>
      <Handle type="source" position={Position.Top} id="top" className={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" className={handleStyle} />
    </div>
  );
};

// Database Node (Cylinder approx)
export const DatabaseNode = ({ id, data }) => {
  return (
    <div className="w-32 h-16 flex-shrink-0 whitespace-normal break-words px-2 leading-tight border-2 border-[#383838] bg-[#202020] rounded-t-[50%] rounded-b-[50%] flex items-center justify-center text-sm text-[#e5e7eb] shadow-lg relative">
      <div className="w-full h-full rounded-t-[50%] border-b border-[#383838] absolute top-0 pointer-events-none"></div>
      <div className="relative z-10 w-full mt-2">
        <EditableLabel id={id} label={data.label} />
      </div>
      <Handle type="source" position={Position.Top} id="top" className={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" className={handleStyle} />
    </div>
  );
};

// Subprocess Node
export const SubprocessNode = ({ id, data }) => {
  return (
    <div className="w-40 h-16 flex-shrink-0 whitespace-normal break-words px-2 leading-tight bg-[#202020] border-2 border-[#383838] rounded-md relative flex items-center justify-center text-sm text-[#e5e7eb] shadow-lg">
      <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-[#383838]" />
      <div className="absolute right-2 top-0 bottom-0 w-[2px] bg-[#383838]" />
      <div className="relative z-10 w-full px-2">
        <EditableLabel id={id} label={data.label} />
      </div>
      <Handle type="source" position={Position.Top} id="top" className={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" className={handleStyle} />
    </div>
  );
};

// Document Node
export const DocumentNode = ({ id, data }) => {
  return (
    <div className="w-40 h-16 flex-shrink-0 whitespace-normal break-words px-2 leading-tight bg-[#202020] border-2 border-[#383838] flex items-center justify-center rounded-t-md rounded-bl-md rounded-br-3xl text-sm text-[#e5e7eb] shadow-lg relative">
      <EditableLabel id={id} label={data.label} />
      <Handle type="source" position={Position.Top} id="top" className={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" className={handleStyle} />
    </div>
  );
};

// Note Node
export const NoteNode = ({ id, data }) => {
  return (
    <div className="w-40 h-16 flex-shrink-0 whitespace-normal break-words px-2 leading-tight bg-yellow-900/20 border-2 border-dashed border-yellow-700/50 text-yellow-200/80 rounded-md flex items-center justify-center text-sm shadow-lg relative">
      <EditableLabel id={id} label={data.label} />
      <Handle type="source" position={Position.Top} id="top" className={handleStyle} />
      <Handle type="source" position={Position.Left} id="left" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="bottom" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="right" className={handleStyle} />
    </div>
  );
};
