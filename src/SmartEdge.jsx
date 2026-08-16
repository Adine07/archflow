import React from 'react';
import { BaseEdge, getSmoothStepPath, useInternalNode, Position } from '@xyflow/react';

export default function SmartEdge({
  id,
  source,
  target,
  sourceHandleId,
  targetHandleId,
  style,
  markerEnd,
}) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  // Cek apakah source ada di sebelah kiri target
  const isSourceLeft = sourceNode.internals.positionAbsolute.x < targetNode.internals.positionAbsolute.x;

  const sourcePos = isSourceLeft ? Position.Right : Position.Left;
  const targetPos = isSourceLeft ? Position.Left : Position.Right;

  // Bersihkan ID handle dari fallback awal
  const sField = sourceHandleId?.replace(/-right$|-left$/, '');
  const tField = targetHandleId?.replace(/-right$|-left$/, '');

  // Nama handle dinamis berdasarkan sisi mana yang terdekat
  const sourceHandleName = `${sField}-${isSourceLeft ? 'right' : 'left'}`;
  const targetHandleName = `${tField}-${isSourceLeft ? 'left' : 'right'}`;

  // Cari handle di array source maupun target (karena connectionMode loose secara logis)
  const sHandle = sourceNode.internals.handleBounds?.source?.find((h) => h.id === sourceHandleName)
               || sourceNode.internals.handleBounds?.target?.find((h) => h.id === sourceHandleName);
               
  const tHandle = targetNode.internals.handleBounds?.target?.find((h) => h.id === targetHandleName)
               || targetNode.internals.handleBounds?.source?.find((h) => h.id === targetHandleName);

  // Fallback jika handle belum siap
  let finalSourceX = arguments[0].sourceX || 0;
  let finalSourceY = arguments[0].sourceY || 0;
  let finalTargetX = arguments[0].targetX || 0;
  let finalTargetY = arguments[0].targetY || 0;

  if (sHandle && tHandle) {
    finalSourceX = sourceNode.internals.positionAbsolute.x + sHandle.x + sHandle.width / 2;
    finalSourceY = sourceNode.internals.positionAbsolute.y + sHandle.y + sHandle.height / 2;
    finalTargetX = targetNode.internals.positionAbsolute.x + tHandle.x + tHandle.width / 2;
    finalTargetY = targetNode.internals.positionAbsolute.y + tHandle.y + tHandle.height / 2;
  }

  const [edgePath] = getSmoothStepPath({
    sourceX: finalSourceX,
    sourceY: finalSourceY,
    sourcePosition: sourcePos,
    targetX: finalTargetX,
    targetY: finalTargetY,
    targetPosition: targetPos,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{ ...style, stroke: '#94a3b8', strokeWidth: 2, strokeDasharray: '5 5' }}
      markerEnd={markerEnd}
    />
  );
}
