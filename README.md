# ArchFlow

Professional Diagramming & ERD Editor built for developers and architects. Design databases, draw flowcharts, and map out systems visually with a seamless, high-performance web interface.

## Key Features

- **Database ERD Mode (Code & UI Sync):** 
  - Write DBML schemas in the Monaco Editor and watch your ERD generate in real-time.
  - Interact with tables visually (Add tables, fields, edit types via double-click) and your DBML code syncs instantly.
  - **Auto Layout:** Intelligently arranges messy diagrams using `dagre`.
- **Flowchart Mode:** Drag-and-drop standard flowchart nodes (Process, Decision, Database, etc.) from a dedicated sidebar. Connect them freely in any direction.
- **User Story Mode:** Map out your product features and user flows (Coming Soon).
- **Premium "Business" Dark Theme:** High-contrast, pure neutral dark UI (Base-141414). Zero distracting colors, smooth custom scrollbars, and fully responsive resizable panes.
- **Comprehensive Import/Export:**
  - **Export Visuals:** Save your diagrams as high-res PNG or vector SVG.
  - **Export Code:** Export databases to raw `.dbml` or compile directly to SQL (MySQL).
  - **Import Data:** Parse `.sql` or `.dbml` files directly into your workspace.
  - **Save Workspaces:** Save full projects locally as `.dbmlproj` and open them anytime.

## Tech Stack

- **[React 18](https://react.dev/)** + **[Vite](https://vitejs.dev/)** - Lightning-fast frontend environment.
- **[TailwindCSS v3](https://tailwindcss.com/)** - Utility-first atomic CSS for precise styling.
- **[React Flow](https://reactflow.dev/)** - Robust canvas engine for node-based interactive diagrams.
- **[Zustand](https://github.com/pmndrs/zustand)** - Lightweight, fast, and scalable global state management.
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - The same code editor that powers VS Code.
- **[@dbml/core](https://dbml.dbdiagram.io/home/)** - Database schema parser and SQL compiler.
- **[Lucide SVG Icons](https://lucide.dev/)** - Clean, consistent, inline scalable vector graphics.

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adine07/archflow.git
   cd archflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open the App**  
   Navigate to `http://localhost:5173` in your browser.

## UI Interactions & Shortcuts

- **Pan & Zoom:** Use the mouse wheel to zoom. Click and drag on empty canvas space to pan around.
- **Resize Panels:** Hover over the vertical divider between the code editor and diagram canvas to resize workspaces.
- **Drag & Drop:** In Flowchart Mode, simply drag shapes from the left sidebar onto the canvas.
- **Inline Editing:** Double-click on any Flowchart shape text, Table Header, Table Field, or Enum Value to edit inline.
- **Connections:** Drag from any node handle (dots on the edges) to another node handle to draw connecting lines.

## Contributing

Contributions, issues, and feature requests are always welcome! Feel free to check the issues page or submit a pull request if you'd like to improve the app.

---
**ArchFlow** — Built with passion for better architecture design.
