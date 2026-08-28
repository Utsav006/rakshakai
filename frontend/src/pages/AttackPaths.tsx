import { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Define the nodes (the boxes) in our attack path
const initialNodes = [
  { 
    id: '1', 
    position: { x: 50, y: 150 }, 
    data: { label: '🌐 Public Internet (Attacker)' }, 
    style: { background: '#1f2937', color: '#ef4444', border: '2px solid #ef4444', borderRadius: '8px', padding: '10px', fontWeight: 'bold' } 
  },
  { 
    id: '2', 
    position: { x: 350, y: 150 }, 
    data: { label: '🚨 CVE-2024-2100 (Auth Bypass)' }, 
    style: { background: '#7f1d1d', color: '#fca5a5', border: '2px solid #f87171', borderRadius: '8px', padding: '10px' } 
  },
  { 
    id: '3', 
    position: { x: 650, y: 150 }, 
    data: { label: '💻 Student Portal (Asset #1)' }, 
    style: { background: '#1e3a8a', color: '#bfdbfe', border: '2px solid #60a5fa', borderRadius: '8px', padding: '10px' } 
  },
  { 
    id: '4', 
    position: { x: 950, y: 150 }, 
    data: { label: '🗄️ Backend Database (Sensitive Data)' }, 
    style: { background: '#1f2937', color: '#fbbf24', border: '2px solid #f59e0b', borderRadius: '8px', padding: '10px' } 
  },
];

// Define the edges (the lines) connecting the nodes
const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#ef4444', strokeWidth: 2 } },
];

export default function AttackPaths() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Attack Path Mapping</h1>
        <p className="text-gray-400 text-sm mt-1">Visualizing exploitation routes from the internet to sensitive assets</p>
      </div>
      
      <div className="flex-1 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          colorMode="dark"
        >
          <Controls className="bg-gray-800 border-gray-700 fill-white" />
          <MiniMap 
            nodeStrokeColor="#4b5563" 
            nodeColor="#1f2937" 
            maskColor="rgba(0, 0, 0, 0.7)" 
            className="bg-gray-900"
          />
          <Background color="#374151" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}