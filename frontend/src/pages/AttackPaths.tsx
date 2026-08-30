import { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

export default function AttackPaths() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const fetchPaths = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/paths/");
        const data = await response.json();
        setNodes(data.nodes);
        setEdges(data.edges);
      } catch (error) {
        console.error("Error fetching attack paths:", error);
      }
    };
    fetchPaths();
  }, []);

  return (
    <div style={{ padding: "30px", height: "80vh", color: "white" }}>
      <h1>Attack Path Mapping</h1>
      <p style={{ color: "#8a99ad", marginBottom: "20px" }}>Visualizing live exploitation routes</p>
      
      <div style={{ width: "100%", height: "100%", border: "1px solid #30363d", borderRadius: "8px" }}>
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#30363d" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}