import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';
import { Parser, exporter, importer } from '@dbml/core';
import React from 'react';
import { getLayoutedElements } from './layoutUtils.js';

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
  fileMenuOpen: false,
  exportMenuOpen: false,
  setFileMenuOpen: (isOpen) => set({ fileMenuOpen: isOpen }),
  setExportMenuOpen: (isOpen) => set({ exportMenuOpen: isOpen }),
  closeAllMenus: () => set({ fileMenuOpen: false, exportMenuOpen: false }),
  dbmlString: defaultDbmlString,
  nodes: [],
  edges: [],
  parserError: null,
  errorLocation: null,
  parsedEnums: [],
  activeEnumModal: null,

  appMode: 'erd',
  setAppMode: (mode) => set({ appMode: mode }),

  flowNodes: [],
  flowEdges: [],

  onFlowNodesChange: (changes) => {
    set({ flowNodes: applyNodeChanges(changes, get().flowNodes) });
  },

  onFlowEdgesChange: (changes) => {
    set({ flowEdges: applyEdgeChanges(changes, get().flowEdges) });
  },

  onFlowConnect: (connection) => {
    import('@xyflow/react').then(({ addEdge }) => {
      set({ flowEdges: addEdge(connection, get().flowEdges) });
    });
  },

  addFlowNode: (type, position) => {
    const newNode = {
      id: `flow-node-${Date.now()}`,
      type,
      position,
      data: { label: 'New Node' },
    };
    set({ flowNodes: [...get().flowNodes, newNode] });
  },

  updateFlowNodeLabel: (id, newLabel) => {
    set({
      flowNodes: get().flowNodes.map(node => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label: newLabel } };
        }
        return node;
      })
    });
  },

  openEnumModal: (enumName) => set({ activeEnumModal: enumName }),
  closeEnumModal: () => set({ activeEnumModal: null }),
  
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
  
  applyAutoLayout: () => {
    const { nodes, edges } = get();
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, 'TB');
    set({ nodes: [...layoutedNodes], edges: [...layoutedEdges] });
  },
  
  setDbmlString: (code, options) => {
    set({ dbmlString: code });
    get().parseDbml(options);
  },

  addNewTable: () => {
    const code = get().dbmlString;
    const newTableName = `new_table_${Date.now()}`;
    const newTableString = `\nTable ${newTableName} {\n  id integer [primary key]\n}\n`;
    
    get().setDbmlString(code + newTableString);
  },

  exportProject: () => {
    const { dbmlString, nodes } = get();
    const nodePositions = nodes.map(n => ({ id: n.id, position: n.position }));
    
    const projectData = {
      dbmlString,
      nodePositions,
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'project.dbmlproj';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  },

  importProject: (fileContent) => {
    try {
      const projectData = JSON.parse(fileContent);
      if (projectData && projectData.dbmlString !== undefined) {
        const posMap = {};
        if (projectData.nodePositions) {
          projectData.nodePositions.forEach(n => {
            posMap[n.id] = n.position;
          });
        }
        
        get().setDbmlString(projectData.dbmlString, { importedPositions: posMap });
      } else {
        alert("Invalid project file format");
      }
    } catch (err) {
      alert("Error parsing project file: " + err.message);
    }
  },

  importDBMLFile: (fileContent) => {
    try {
      get().setDbmlString(fileContent);
      // Wait for React Flow state to settle then auto layout
      setTimeout(() => {
        get().applyAutoLayout();
      }, 50);
    } catch (err) {
      alert("Failed to import DBML: " + err.message);
    }
  },

  importSQLFile: (fileContent) => {
    try {
      const dbmlString = importer.import(fileContent, 'mysql');
      get().setDbmlString(dbmlString);
      setTimeout(() => {
        get().applyAutoLayout();
      }, 50);
    } catch (err) {
      alert("Failed to import SQL: " + err.message);
    }
  },

  exportSQL: () => {
    try {
      const { dbmlString } = get();
      const sql = exporter.export(dbmlString, 'mysql');
      const blob = new Blob([sql], { type: 'application/sql' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'schema.sql';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export SQL: " + err.message);
    }
  },

  exportDBML: () => {
    try {
      const { dbmlString } = get();
      const blob = new Blob([dbmlString], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'schema.dbml';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export DBML: " + err.message);
    }
  },

  addNewEnum: () => {
    const code = get().dbmlString;
    const newEnumName = `new_enum_${Date.now()}`;
    const newEnumString = `\n\nenum ${newEnumName} {\n  opsi1\n  opsi2\n}\n`;
    
    get().setDbmlString(code + newEnumString);
    set({ activeEnumModal: newEnumName });
  },
  
  onConnectRelation: (connection) => {
    const { dbmlString: code, parserError } = get();
    
    if (parserError) {
      alert('Perbaiki syntax error di editor terlebih dahulu!');
      return;
    }
    
    // connection.sourceHandle / targetHandle can have '-left' or '-right' suffix.
    const sourceCol = connection.sourceHandle?.replace(/-right$|-left$/, '');
    const targetCol = connection.targetHandle?.replace(/-right$|-left$/, '');
    
    if (!sourceCol || !targetCol) return;
    
    const newRefString = `\nRef: ${connection.source}.${sourceCol} > ${connection.target}.${targetCol}\n`;
    get().setDbmlString(code + newRefString);
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

  updateColumnType: (tableName, columnName, newType) => {
    const code = get().dbmlString;
    const lines = code.split('\n');
    let inTargetTable = false;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.match(new RegExp(`^\\s*Table\\s+${tableName}\\s*{`, 'i'))) {
        inTargetTable = true;
        continue;
      }
      
      if (inTargetTable) {
        if (line.match(/^\s*}/)) {
          inTargetTable = false;
          continue;
        }
        
        // Find line starting with the column name
        const colRegex = new RegExp(`^(\\s*${columnName}\\s+)\\S+(.*)`);
        if (colRegex.test(line)) {
          lines[i] = line.replace(colRegex, `$1${newType}$2`);
          modified = true;
        }
      }
    }
    
    if (modified) {
      const newCode = lines.join('\n');
      get().setDbmlString(newCode);
    }
  },

  addNewColumn: (tableName) => {
    const code = get().dbmlString;
    const lines = code.split('\n');
    let inTargetTable = false;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.match(new RegExp(`^\\s*Table\\s+${tableName}\\s*{`, 'i'))) {
        inTargetTable = true;
        continue;
      }
      
      if (inTargetTable) {
        if (line.match(/^\s*}/)) {
          // Found the end of the table. Insert new field right before it.
          lines.splice(i, 0, `  new_field varchar`);
          modified = true;
          break; // Done
        }
      }
    }

    if (modified) {
      const newCode = lines.join('\n');
      get().setDbmlString(newCode);
    }
  },

  moveColumn: (tableName, columnName, direction) => {
    const code = get().dbmlString;
    
    const tableRegex = new RegExp(`(^\\s*Table\\s+${tableName}\\s*{)([\\s\\S]*?)(^\\s*})`, 'im');
    const match = code.match(tableRegex);
    if (!match) return;

    const blockStart = match[1];
    const blockContent = match[2];
    const blockEnd = match[3];

    const lines = blockContent.split('\n');
    
    let colIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(new RegExp(`^\\s*${columnName}\\b`))) {
        colIndex = i;
        break;
      }
    }

    if (colIndex === -1) return;

    let targetIndex = -1;
    if (direction === 'up') {
      for (let i = colIndex - 1; i >= 0; i--) {
        if (lines[i].trim().length > 0) {
          targetIndex = i;
          break;
        }
      }
    } else if (direction === 'down') {
      for (let i = colIndex + 1; i < lines.length; i++) {
        if (lines[i].trim().length > 0) {
          targetIndex = i;
          break;
        }
      }
    }

    if (targetIndex !== -1) {
      const temp = lines[colIndex];
      lines[colIndex] = lines[targetIndex];
      lines[targetIndex] = temp;

      const newBlockContent = lines.join('\n');
      const newCode = code.replace(tableRegex, `${blockStart}${newBlockContent}${blockEnd}`);
      get().setDbmlString(newCode);
    }
  },
  
  updateTableName: (oldName, newName) => {
    const code = get().dbmlString;
    let newCode = code;

    const oldNode = get().nodes.find(n => n.id === oldName);
    const savedPosition = oldNode ? { ...oldNode.position } : null;

    // 1. Replace Table Declaration
    const tableRegex = new RegExp(`(^\\s*Table\\s+)${oldName}(\\s*{)`, 'gm');
    newCode = newCode.replace(tableRegex, `$1${newName}$2`);

    // 2. Replace References (e.g. tableName.columnName)
    const refRegex = new RegExp(`\\b${oldName}\\.`, 'g');
    newCode = newCode.replace(refRegex, `${newName}.`);

    if (newCode !== code) {
      get().setDbmlString(newCode, { renamedTable: { newName, position: savedPosition } });
    }
  },

  updateEnumName: (oldName, newName) => {
    const code = get().dbmlString;
    let newCode = code;

    const enumRegex = new RegExp(`(^\\s*Enum\\s+)${oldName}(\\s*{)`, 'gmi');
    newCode = newCode.replace(enumRegex, `$1${newName}$2`);

    const lines = newCode.split('\n');
    let inTable = false;
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (line.match(/^\s*Table\s+/i)) {
        inTable = true;
        continue;
      }
      if (inTable) {
        if (line.match(/^\s*}/)) {
          inTable = false;
          continue;
        }
        if (line.match(new RegExp(`\\b${oldName}\\b`))) {
           const typeRegex = new RegExp(`(\\s)${oldName}(\\s*(?:\\[.*?\\])?\\s*)$`);
           if (typeRegex.test(line)) {
             lines[i] = line.replace(typeRegex, `$1${newName}$2`);
           }
        }
      }
    }
    
    newCode = lines.join('\n');

    if (newCode !== code) {
      get().setDbmlString(newCode);
      set({ activeEnumModal: newName });
    }
  },

  updateEnumValue: (enumName, oldVal, newVal) => {
    const code = get().dbmlString;
    const lines = code.split('\n');
    let inTargetEnum = false;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.match(new RegExp(`^\\s*Enum\\s+${enumName}\\s*{`, 'i'))) {
        inTargetEnum = true;
        continue;
      }
      
      if (inTargetEnum) {
        if (line.match(/^\s*}/)) {
          inTargetEnum = false;
          continue;
        }
        
        const valRegex = new RegExp(`^(\\s*)${oldVal}(\\s*(?:\\[.*?\\])?\\s*)$`);
        if (valRegex.test(line)) {
          lines[i] = line.replace(valRegex, `$1${newVal}$2`);
          modified = true;
        }
      }
    }
    
    if (modified) {
      get().setDbmlString(lines.join('\n'));
    }
  },

  addEnumValue: (enumName) => {
    const code = get().dbmlString;
    const lines = code.split('\n');
    let inTargetEnum = false;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.match(new RegExp(`^\\s*Enum\\s+${enumName}\\s*{`, 'i'))) {
        inTargetEnum = true;
        continue;
      }
      
      if (inTargetEnum) {
        if (line.match(/^\s*}/)) {
          lines.splice(i, 0, `  new_value`);
          modified = true;
          break;
        }
      }
    }

    if (modified) {
      get().setDbmlString(lines.join('\n'));
    }
  },

  deleteEnumValue: (enumName, valName) => {
    const code = get().dbmlString;
    const lines = code.split('\n');
    let inTargetEnum = false;
    let modified = false;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (line.match(new RegExp(`^\\s*Enum\\s+${enumName}\\s*{`, 'i'))) {
        inTargetEnum = true;
        continue;
      }
      
      if (inTargetEnum) {
        if (line.match(/^\s*}/)) {
          inTargetEnum = false;
          continue;
        }
        
        const valRegex = new RegExp(`^(\\s*)${valName}(\\s*(?:\\[.*?\\])?\\s*)$`);
        if (valRegex.test(line)) {
          lines.splice(i, 1);
          modified = true;
          break;
        }
      }
    }

    if (modified) {
      get().setDbmlString(lines.join('\n'));
    }
  },

  parseDbml: (options = {}) => {
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
          let position = existingNode ? { ...existingNode.position } : null;
          
          if (!position && options.renamedTable && options.renamedTable.newName === table.name) {
             position = options.renamedTable.position;
          }
          if (options.importedPositions && options.importedPositions[table.name]) {
            position = options.importedPositions[table.name];
          }
          if (!position) position = { x: xOffset, y: yOffset };
          
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

      // Determine parsedEnums to pass to UI
      const parsedEnums = database.schemas.length > 0 ? [...database.schemas[0].enums] : [];

      set({ nodes: newNodes, edges: newEdges, parserError: null, errorLocation: null, parsedEnums });
    } catch (err) {
      let errorMessage = "Syntax Error: Periksa kembali penulisan kode DBML Anda.";
      let errLoc = null;
      
      if (err?.diags?.length > 0) {
        const diag = err.diags[0];
        errorMessage = diag.message || errorMessage;
        if (diag.location) {
          errLoc = {
            startLineNumber: diag.location.start.line,
            startColumn: diag.location.start.column,
            endLineNumber: diag.location.end.line,
            endColumn: diag.location.end.column,
          };
        }
      } else if (err?.message) {
        errorMessage = err.message;
      }
      
      console.error("Parser Error:", err);
      set({ parserError: errorMessage, errorLocation: errLoc });
    }
  }
}));
