import React from 'react';

export default function FlowSidebar() {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex flex-col gap-6 p-4 overflow-y-auto w-64 min-w-[16rem] shrink-0 h-full border-r border-[#2e2e2e] bg-[#1a1a1a] z-10 shadow-lg">
      <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider shrink-0">Shapes</h3>
      
      <div 
        className="w-full h-16 border-2 border-[#383838] bg-[#202020] rounded-md flex items-center justify-center cursor-grab hover:border-[#3b82f6] transition-colors shrink-0 text-[#e5e7eb]"
        draggable
        onDragStart={(e) => onDragStart(e, 'process')}
      >
        <span className="text-sm font-medium">Process</span>
      </div>

      <div 
        className="w-full h-24 flex items-center justify-center cursor-grab hover:text-[#3b82f6] transition-colors relative shrink-0 text-[#e5e7eb]"
        draggable
        onDragStart={(e) => onDragStart(e, 'decision')}
      >
        <div className="absolute w-14 h-14 border-2 border-[#383838] bg-[#202020] rotate-45 group-hover:border-[#3b82f6] transition-colors"></div>
        <span className="relative z-10 text-sm font-medium pointer-events-none">Decision</span>
      </div>

      <div 
        className="w-full h-12 border-2 border-[#383838] bg-[#202020] rounded-full flex items-center justify-center cursor-grab hover:border-[#3b82f6] transition-colors shrink-0 text-[#e5e7eb]"
        draggable
        onDragStart={(e) => onDragStart(e, 'terminator')}
      >
        <span className="text-sm font-medium">Start / End</span>
      </div>

      <div 
        className="w-full h-10 border-2 border-[#383838] bg-[#202020] -skew-x-12 flex items-center justify-center cursor-grab hover:border-[#3b82f6] transition-colors shrink-0 text-[#e5e7eb]"
        draggable
        onDragStart={(e) => onDragStart(e, 'data')}
      >
        <span className="text-sm font-medium skew-x-12 pointer-events-none">Data I/O</span>
      </div>

      <div 
        className="w-full h-12 border-2 border-[#383838] bg-[#202020] rounded-t-[50%] rounded-b-[50%] flex items-center justify-center cursor-grab hover:border-[#3b82f6] transition-colors relative overflow-hidden shrink-0 text-[#e5e7eb]"
        draggable
        onDragStart={(e) => onDragStart(e, 'database')}
      >
        <div className="absolute top-0 w-full h-[50%] border-b border-[#383838] pointer-events-none"></div>
        <span className="relative z-10 text-sm font-medium pointer-events-none mt-1">Database</span>
      </div>

      <div 
        className="w-full h-16 bg-[#202020] border-2 border-[#383838] rounded-md relative flex items-center justify-center cursor-grab hover:border-[#3b82f6] transition-colors shrink-0 text-[#e5e7eb]"
        draggable
        onDragStart={(e) => onDragStart(e, 'subprocess')}
      >
        <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-[#383838] pointer-events-none" />
        <div className="absolute right-2 top-0 bottom-0 w-[2px] bg-[#383838] pointer-events-none" />
        <span className="relative z-10 text-sm font-medium pointer-events-none">Subprocess</span>
      </div>

      <div 
        className="w-full h-16 bg-[#202020] border-2 border-[#383838] flex items-center justify-center rounded-t-md rounded-bl-md rounded-br-3xl cursor-grab hover:border-[#3b82f6] transition-colors relative shrink-0 text-[#e5e7eb]"
        draggable
        onDragStart={(e) => onDragStart(e, 'document')}
      >
        <span className="text-sm font-medium pointer-events-none">Document</span>
      </div>

      <div 
        className="w-full h-16 bg-yellow-900/20 border-2 border-dashed border-yellow-700/50 text-yellow-200/80 rounded-md flex items-center justify-center cursor-grab hover:border-yellow-500/80 transition-colors relative shrink-0"
        draggable
        onDragStart={(e) => onDragStart(e, 'note')}
      >
        <span className="text-sm font-medium pointer-events-none">Note</span>
      </div>
      
    </div>
  );
}
