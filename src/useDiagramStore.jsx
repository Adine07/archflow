import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { Parser } from '@dbml/core';
import React from 'react';

const defaultDbmlString = `// Contoh DBML dengan relasi 1:N
Table users {
  id integer [primary key]
  username varchar
  created_at timestamp
}

Table posts {
  id integer [primary key]
  user_id integer
  title varchar
  body text
}

Ref: posts.user_id > users.id
`;

export const useDiagramStore = create((set, get) => ({
  dbmlString: defaultDbmlString,
  nodes: [],
  edges: [],
  
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  setDbmlString: (code) => {
    set({ dbmlString: code });
    get().parseDbml();
  },
  
  updateColumnName: (tableName, oldColName, newColName) => {
    const code = get().dbmlString;
    const lines = code.split('\n');
    let inTargetTable = false;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Update References globally: tableName.oldColName
      const refRegex = new RegExp(`(\\b${tableName}\\.)${oldColName}\\b`, 'g');
      if (refRegex.test(line)) {
        line = line.replace(refRegex, `$1${newColName}`);
        lines[i] = line;
        modified = true;
      }

      // Check if entering the target table block
      if (line.match(new RegExp(`^\\s*Table\\s+${tableName}\\s*{`, 'i'))) {
        inTargetTable = true;
        continue;
      }
      
      if (inTargetTable) {
        // Exiting the table block
        if (line.match(/^\s*}/)) {
          inTargetTable = false;
          continue;
        }
        
        // Find line starting with the old column name
        const colRegex = new RegExp(`^(\\s*)${oldColName}(\\s+)`);
        if (colRegex.test(line)) {
          lines[i] = line.replace(colRegex, `$1${newColName}$2`);
          modified = true;
        }
      }
    }
    
    if (modified) {
      const newCode = lines.join('\n');
      get().setDbmlString(newCode);
    }
  },
  
  parseDbml: () => {
    const code = get().dbmlString;
    if (!code) return;

    try {
      // Parse dbml string
      const database = Parser.parse(code, 'dbml');
      
      const currentNodes = get().nodes;
      const newNodes = [];
      const newEdges = [];
      let xOffset = 50;
      let yOffset = 50;

      // Extract tables to React Flow nodes
      database.schemas.forEach(schema => {
        schema.tables.forEach(table => {
          
          const existingNode = currentNodes.find(n => n.id === table.name);
          // Buat salinan immutable untuk position
          const position = existingNode ? { ...existingNode.position } : { x: xOffset, y: yOffset };
          
          newNodes.push({
            id: table.name,
            type: 'table',
            position,
            data: { 
              name: table.name,
              fields: [...table.fields] // Salin array agar terdeteksi perubahan
            },
          });
          
          xOffset += 250;
          if (xOffset > 800) {
            xOffset = 50;
            yOffset += 200;
          }
        });
      });

      // Extract refs to React Flow edges
      database.schemas.forEach(schema => {
        schema.refs.forEach((ref, index) => {
          // Identify source and target tables
          // endpoints[1] usually holds the "one" side (source), endpoints[0] holds the "many" side (target)
          const source = ref.endpoints[1].tableName;
          const sourceField = ref.endpoints[1].fieldNames[0];
          const target = ref.endpoints[0].tableName;
          const targetField = ref.endpoints[0].fieldNames[0];
          
          newEdges.push({
            id: `e-${source}-${sourceField}-${target}-${targetField}-${index}`,
            source: source,
            sourceHandle: `${sourceField}-right`,
            target: target,
            targetHandle: `${targetField}-left`,
            type: 'smart',
            animated: true,
            style: { stroke: '#cbd5e1', strokeWidth: 2 }
          });
        });
      });

      set({ nodes: newNodes, edges: newEdges });
    } catch (err) {
      console.error("Failed to parse DBML:", err.message);
      // If parsing fails, we just don't update the nodes/edges,
      // but keep the state.dbmlString updated.
    }
  }
}));
