import { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  ReactFlowInstance,
  NodeChange,
  EdgeChange,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeProps,
} from 'reactflow';

import 'reactflow/dist/style.css';
import Toolbar from '../toolbar/Toolbar'; // Import the new Toolbar component
import useExportFlow from '../../hooks/useExportFlow'; // Import the new hook
import { Toolbox } from '../toolbox/Toolbox';
import nodeData from '../../data/nodes.json';
import NodeDrawer from '../nodes/NodeDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NodeDefinition, FieldData } from '../../types';
import { v4 as uuid } from 'uuid';
import { WrappedBaseNode } from '../nodes/WrappedBaseNode';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface ReactFlowDesignerProps { }

const ReactFlowDesigner: React.FC<ReactFlowDesignerProps> = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [toolboxNodes, setToolboxNodes] = useState<NodeDefinition[]>([]);
  const [isToolboxVisible, setIsToolboxVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  useEffect(() => {
    setToolboxNodes(nodeData);
  }, []);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges],
  );

  const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const { handleExport } = useExportFlow(nodes, edges);

  const onDrag = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData('application/reactflow',
      (event.target as HTMLButtonElement).getAttribute('data-content') ?? '');
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
  }, []);

  const onNodeDataChange = useCallback(
    (nodeId: string, newData: Partial<FieldData>) => {
      // Update nodes array
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, dynamicData: { ...(node.data.dynamicData || {}), ...newData } } }
            : node
        )
      );
      
      // Only update selectedNode if it's the same node being edited
      // This prevents unnecessary re-renders when selectedNode hasn't actually changed
      setSelectedNode((prev) => {
        if (prev && prev.id === nodeId) {
          const updatedDynamicData = { ...(prev.data.dynamicData || {}), ...newData };
          // Only update if the data actually changed
          if (JSON.stringify(prev.data.dynamicData) !== JSON.stringify(updatedDynamicData)) {
            return { ...prev, data: { ...prev.data, dynamicData: updatedDynamicData } };
          }
        }
        return prev;
      });
    },
    [setNodes, setSelectedNode],
  );

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      if (window.confirm('Are you sure you want to delete this node?')) {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        
        // Close drawer if the deleted node was selected
        if (selectedNode && selectedNode.id === nodeId) {
          setSelectedNode(null);
          setIsDrawerOpen(false);
        }
      }
    },
    [selectedNode],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const nodeDataString = event.dataTransfer.getData('application/reactflow');
      const nodeDefinition = JSON.parse(nodeDataString) as NodeDefinition;

      if (!nodeDataString || !reactFlowBounds || !reactFlowInstance.current) {
        return;
      }

      const position = reactFlowInstance.current.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if (!position) {
        return;
      }

      const newNode: Node = {
        id: uuid(),
        type: 'baseNode',
        position,
        data: {
          ...nodeDefinition, // Include all static NodeDefinition properties
          dynamicData: JSON.parse(nodeDefinition.data || '{}'), // Parse the data string into dynamicData
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const nodeTypes = useMemo(() => ({ baseNode: (nodeProps: NodeProps<NodeDefinition & { dynamicData?: FieldData }>) => <WrappedBaseNode {...nodeProps} onNodeDataChange={onNodeDataChange} /> }), [onNodeDataChange]);

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar onExport={handleExport} />
      
      {/* Toggle Toolbox Button */}
      <button
        className="btn btn-secondary toggle-toolbox-button"
        onClick={() => setIsToolboxVisible(!isToolboxVisible)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1001,
        }}
      >
        <FontAwesomeIcon icon={faBars} className="me-2" />
        {isToolboxVisible ? 'Hide Toolbox' : 'Show Toolbox'}
      </button>
      
      {/* Toolbox - Overlay without blocking canvas interactions */}
      {isToolboxVisible && (
        <div style={{ 
          width: '350px', 
          overflowY: 'auto',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1000,
          pointerEvents: 'auto' // Allow interactions with toolbox
        }}>
          <div style={{ padding: '20px' }}>
            <h5 style={{ color: 'white', marginBottom: '20px' }}>Toolbox</h5>
            <Toolbox nodes={toolboxNodes} isNodesVisible={isToolboxVisible} onDrag={onDrag} />
          </div>
        </div>
      )}
      
      {/* ReactFlow Canvas - Full width, always accessible */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onInit={(instance) => (reactFlowInstance.current = instance)}
        fitView
        fitViewOptions={{ 
          padding: 0.1,
          minZoom: 0.1,
          maxZoom: 1
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        style={{ 
          width: '100%', 
          height: '100%',
          pointerEvents: 'auto' // Ensure canvas is always interactive
        }}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      
      {selectedNode && (
        <NodeDrawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          title={selectedNode.data.name}
          fields={selectedNode.data.fields || { input: [], output: [] }}
          dataNode={selectedNode.data.dynamicData || {}} // Pass dynamicData to NodeDrawer
          onUpdateData={(newData) => onNodeDataChange(selectedNode.id, newData)} // Correctly pass updates to parent
          onDelete={() => onDeleteNode(selectedNode.id)} // Pass delete callback
        />
      )}
    </div>
  );
};

export default ReactFlowDesigner;
