import React, { useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Position,
  MarkerType,
  Handle,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Table, KeyRound, Link as LinkIcon, Play, Move } from 'lucide-react';
import { TableSchema } from '../cases/types';

interface SchemaDiagramProps {
  schemas: TableSchema[];
  onSelectTableQuery?: (tableName: string) => void;
  getTableCount: (tableName: string) => number;
}

// Custom Node for displaying a Database Table
const CustomTableNode = ({ data }: { data: any }) => {
  const { table, rowCount, onSelectTableQuery } = data;

  return (
    <div className="bg-noir-900/95 border-2 border-noir-700 hover:border-noir-accent rounded-xl shadow-2xl overflow-hidden min-w-[230px] max-w-[270px] text-xs transition-all select-none">
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-noir-accent !w-2.5 !h-2.5 !border-noir-900"
      />

      {/* Table Header - Grabbable to drag node */}
      <div className="bg-noir-850 px-3.5 py-2.5 border-b border-noir-800 flex items-center justify-between cursor-grab active:cursor-grabbing">
        <div className="flex items-center space-x-2 truncate">
          <Table className="w-4 h-4 text-noir-accent flex-shrink-0" />
          <span className="font-mono font-bold text-slate-100 truncate text-[13px]">
            {table.name}
          </span>
        </div>
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <span className="text-[10px] text-slate-400 font-mono bg-noir-900 px-1.5 py-0.5 rounded border border-noir-800">
            {rowCount} dòng
          </span>
          {onSelectTableQuery && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectTableQuery(table.name);
              }}
              className="p-1 text-slate-400 hover:text-noir-gold hover:bg-noir-800 rounded transition-colors cursor-pointer"
              title={`Nạp câu lệnh SELECT bảng ${table.name}`}
            >
              <Play className="w-3.5 h-3.5 text-noir-accent" />
            </button>
          )}
        </div>
      </div>

      {/* Columns List */}
      <div className="p-2.5 space-y-1 bg-noir-950/80 divide-y divide-noir-850/60 cursor-grab active:cursor-grabbing">
        {table.columns.map((col: any) => {
          const isPk = col.type.toUpperCase().includes('PRIMARY KEY');
          const isFk = table.foreignKeys?.some((fk: any) => fk.fromColumn === col.name);

          return (
            <div
              key={col.name}
              className="pt-1.5 first:pt-0 flex items-center justify-between font-mono text-[11px]"
            >
              <div className="flex items-center space-x-1.5 truncate pr-2">
                {isPk && (
                  <span title="Khóa chính (PK)">
                    <KeyRound className="w-3 h-3 text-noir-gold flex-shrink-0" />
                  </span>
                )}
                {isFk && (
                  <span title="Khóa ngoại (FK)">
                    <LinkIcon className="w-3 h-3 text-sky-400 flex-shrink-0" />
                  </span>
                )}
                <span
                  className={
                    isPk
                      ? 'text-noir-gold font-bold'
                      : isFk
                      ? 'text-sky-300 font-semibold'
                      : 'text-slate-200'
                  }
                >
                  {col.name}
                </span>
              </div>
              <span className="text-[10px] text-slate-500 truncate flex-shrink-0">
                {col.type.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-sky-400 !w-2.5 !h-2.5 !border-noir-900"
      />
    </div>
  );
};

const nodeTypes = {
  tableNode: CustomTableNode,
};

export const SchemaDiagram: React.FC<SchemaDiagramProps> = ({
  schemas,
  onSelectTableQuery,
  getTableCount,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate layout nodes and edges when schemas change
  useEffect(() => {
    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];

    // Layout configuration: 2 columns for comfortable side-by-side spacing
    const colCount = Math.min(2, Math.max(1, schemas.length));
    const xSpacing = 310;
    const ySpacing = 260;

    schemas.forEach((table, index) => {
      const col = index % colCount;
      const row = Math.floor(index / colCount);

      generatedNodes.push({
        id: table.name,
        type: 'tableNode',
        position: {
          x: 40 + col * xSpacing,
          y: 40 + row * ySpacing,
        },
        data: {
          table,
          rowCount: getTableCount(table.name),
          onSelectTableQuery,
        },
      });

      // Generate foreign key edges
      if (table.foreignKeys) {
        table.foreignKeys.forEach((fk, fkIdx) => {
          generatedEdges.push({
            id: `edge-${table.name}-${fk.fromColumn}-${fk.toTable}-${fkIdx}`,
            source: table.name,
            target: fk.toTable,
            animated: true,
            label: `${fk.fromColumn} ➔ ${fk.toColumn}`,
            labelStyle: { fill: '#38bdf8', fontSize: 10, fontFamily: 'monospace', fontWeight: 600 },
            labelBgStyle: { fill: '#0f172a', fillOpacity: 0.9, rx: 4 },
            style: { stroke: '#38bdf8', strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: '#38bdf8',
            },
          });
        });
      }
    });

    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [schemas, getTableCount, onSelectTableQuery, setNodes, setEdges]);

  return (
    <div className="w-full h-[480px] bg-noir-950 border border-noir-800 rounded-xl overflow-hidden relative shadow-inner cursor-grab active:cursor-grabbing">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.3}
        maxZoom={1.8}
        panOnDrag={true}
        zoomOnScroll={true}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#2c3240" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-noir-900 !border-noir-700 !text-slate-300 [&>button]:!border-noir-800 [&>button]:!bg-noir-850 hover:[&>button]:!bg-noir-800"
        />
      </ReactFlow>

      {/* Helper Legend Overlay - Top Left */}
      <div className="absolute top-3 left-3 bg-noir-900/90 border border-noir-800/90 rounded-lg px-3 py-1.5 flex flex-wrap items-center gap-3 text-[11px] text-slate-300 backdrop-blur pointer-events-none shadow-md">
        <div className="flex items-center space-x-1">
          <KeyRound className="w-3.5 h-3.5 text-noir-gold" />
          <span>Khóa chính (PK)</span>
        </div>
        <div className="flex items-center space-x-1">
          <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
          <span>Khóa ngoại (FK)</span>
        </div>
        <div className="flex items-center space-x-1 text-slate-400">
          <Move className="w-3.5 h-3.5 text-noir-accent" />
          <span>Kéo nền để di chuyển • Kéo từng bảng để sắp xếp</span>
        </div>
      </div>
    </div>
  );
};
