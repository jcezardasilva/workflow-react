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
import useImportFlow from '../../hooks/useImportFlow'; // Import the import hook
import { Toolbox } from '../toolbox/Toolbox';
import nodeData from '../../data/nodes.json';
import NodeDrawer from '../nodes/NodeDrawer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { NodeDefinition } from '../../types';
import { v4 as uuid } from 'uuid';
import { WrappedBaseNode } from '../nodes/WrappedBaseNode';
import EdgeContextMenu from './EdgeContextMenu';
import NodeContextMenu from './NodeContextMenu';

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
  const [edgeContextMenu, setEdgeContextMenu] = useState<{ edge: Edge; position: { x: number; y: number } } | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = useState<{ node: Node; position: { x: number; y: number } } | null>(null);
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
  const { handleImport } = useImportFlow();

  const onImportFlow = useCallback(async () => {
    try {
      const importedData = await handleImport();
      if (importedData) {
        // Confirm before replacing current flow
        const confirmMessage = 'Isso irá substituir o fluxo atual. Deseja continuar?';
        if (window.confirm(confirmMessage)) {
          setNodes(importedData.nodes);
          setEdges(importedData.edges);
          
          // Close any open drawer
          setSelectedNode(null);
          setIsDrawerOpen(false);
          
          // Show success message
          alert('Fluxo importado com sucesso!');
        }
      }
    } catch (error) {
      // Show error message
      alert(`Erro ao importar fluxo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }, [handleImport, setNodes, setEdges]);

  const onDrag = (event: React.DragEvent<HTMLButtonElement>) => {
    event.dataTransfer.setData('application/reactflow',
      (event.target as HTMLButtonElement).getAttribute('data-content') ?? '');
    event.dataTransfer.effectAllowed = 'move';
  };

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
    setEdgeContextMenu(null); // Close edge context menu when clicking on node
    setNodeContextMenu(null); // Close node context menu when clicking on node
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setNodeContextMenu({
      node,
      position: { x: event.clientX, y: event.clientY }
    });
    setEdgeContextMenu(null); // Close edge context menu when opening node context menu
  }, []);

  const onEdgeContextMenu = useCallback((event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setEdgeContextMenu({
      edge,
      position: { x: event.clientX, y: event.clientY }
    });
    setNodeContextMenu(null); // Close node context menu when opening edge context menu
  }, []);

  const onDeleteEdge = useCallback((edgeId: string) => {
    setEdges((eds) => eds.filter((e) => e.id !== edgeId));
  }, []);

  const onDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    
    // Close drawer if the deleted node was selected
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
      setIsDrawerOpen(false);
    }
  }, [selectedNode]);

  const onEditNode = useCallback((node: Node) => {
    setSelectedNode(node);
    setIsDrawerOpen(true);
  }, []);

  const onCloseEdgeContextMenu = useCallback(() => {
    setEdgeContextMenu(null);
  }, []);

  const onCloseNodeContextMenu = useCallback(() => {
    setNodeContextMenu(null);
  }, []);

  const onNodeDataChange = useCallback(
    (nodeId: string, newData: NodeDefinition) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: newData }
            : node
        )
      );
      
      // Only update selectedNode if it's the same node being edited
      // This prevents unnecessary re-renders when selectedNode hasn't actually changed
      setSelectedNode((prev) => {
        if (prev && prev.id === nodeId) {
          // Only update if the data actually changed
          if (JSON.stringify(prev.data) !== JSON.stringify(newData)) {
            return { ...prev, data: newData };
          }
        }
        return prev;
      });
    },
    [setNodes, setSelectedNode],
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
          // Initialize fields with empty values if they don't exist
          fields: {
            input: nodeDefinition.fields?.input?.map(field => ({
              ...field,
              value: field.value || ''
            })) || [],
            output: nodeDefinition.fields?.output?.map(field => ({
              ...field,
              value: field.value || ''
            })) || []
          }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes],
  );

  const nodeTypes = useMemo(() => ({ baseNode: (nodeProps: NodeProps<NodeDefinition>) => <WrappedBaseNode {...nodeProps} onNodeDataChange={onNodeDataChange} /> }), [onNodeDataChange]);

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Toolbar 
        onExport={handleExport} 
        onImport={onImportFlow} 
      />
      
      {/* Toggle Toolbox Button */}
      <button
        className="btn btn-secondary toggle-toolbox-button"
        onClick={() => setIsToolboxVisible(!isToolboxVisible)}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1001,
          backgroundColor: 'var(--bg-button)',
          borderColor: 'var(--border-primary)',
          color: 'var(--text-primary)',
        }}
      >
        <FontAwesomeIcon icon={faBars} className="me-2" />
        {isToolboxVisible ? 'Hide Toolbox' : 'Show Toolbox'}
      </button>
      
      {/* Toolbox - Overlay without blocking canvas interactions */}
      {isToolboxVisible && (
        <div         style={{ 
          width: '350px', 
          overflowY: 'auto',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 1000,
          pointerEvents: 'auto', // Allow interactions with toolbox
          backgroundColor: 'var(--bg-toolbox)',
          border: '1px solid var(--border-primary)',
          borderRadius: '8px',
          margin: '20px'
        }}>
          <div style={{ padding: '20px' }}>
            <h5 style={{ color: 'var(--text-primary)', marginBottom: '20px' }}>Toolbox</h5>
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
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onInit={(instance) => (reactFlowInstance.current = instance)}
        deleteKeyCode={null} // Desabilita remoção com Backspace
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
          dataNode={selectedNode.data} // Pass the entire node data to NodeDrawer
          onUpdateData={(newData) => onNodeDataChange(selectedNode.id, newData)} // Correctly pass updates to parent
          onDelete={() => onDeleteNode(selectedNode.id)} // Pass delete callback
        />
      )}

      {/* Edge Context Menu */}
      <EdgeContextMenu
        edge={edgeContextMenu?.edge || null}
        position={edgeContextMenu?.position || null}
        onClose={onCloseEdgeContextMenu}
        onDelete={onDeleteEdge}
      />

      {/* Node Context Menu */}
      <NodeContextMenu
        node={nodeContextMenu?.node || null}
        position={nodeContextMenu?.position || null}
        onClose={onCloseNodeContextMenu}
        onDelete={onDeleteNode}
        onEdit={onEditNode}
      />
    </div>
  );
};

export default ReactFlowDesigner;
