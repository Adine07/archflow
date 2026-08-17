import React from 'react';
import { useDiagramStore } from './useDiagramStore.jsx';
import { toPng } from 'html-to-image';

export default function TopBar() {
  const applyAutoLayout = useDiagramStore(state => state.applyAutoLayout);
  const addNewTable = useDiagramStore(state => state.addNewTable);
  const addNewEnum = useDiagramStore(state => state.addNewEnum);

  const handleDownloadImage = () => {
    // Select the React Flow viewport element
    const viewportNode = document.querySelector('.react-flow__viewport');
    
    if (!viewportNode) return;

    // Use html-to-image to convert the viewport to PNG
    toPng(viewportNode, {
      backgroundColor: '#020617', // slate-950 to match our canvas background
      width: viewportNode.scrollWidth,
      height: viewportNode.scrollHeight,
      style: {
        width: viewportNode.scrollWidth + 'px',
        height: viewportNode.scrollHeight + 'px',
        transform: 'translate(0, 0) scale(1)', // Reset any pan/zoom transform for the export
      },
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'diagram.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Failed to export image:', err);
      });
  };

  return (
    <>
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={addNewEnum}
          className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold rounded shadow-md transition-colors"
        >
          Add Enum
        </button>
        <button 
          onClick={addNewTable}
        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded shadow-md transition-colors"
      >
        Add Table
      </button>
      <button 
        onClick={applyAutoLayout}
        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded shadow-md transition-colors"
      >
        Auto Layout
      </button>
      <button 
        onClick={handleDownloadImage}
        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded shadow-md transition-colors"
      >
          Download PNG
        </button>
      </div>
    </>
  );
}
