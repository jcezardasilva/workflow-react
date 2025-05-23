import React, { useEffect, useRef, useState } from 'react';
import NodeHeader from './NodeHeader';
import NodeDrawer from './NodeDrawer';
interface NodeData {
  nodeName: string;
  nodeDescription: string;
  [key: string]: any;
}

interface BaseNodeProps {
  name: string;
  id: string;
  fields?: { input: any[]; output: any[] };
  description?: string;
  store?: any;
  x?: number;
  y?: number;
}

const BaseNode: React.FC<BaseNodeProps> = ({ name, id, fields = { input: [], output: [] }, description = '', store, x, y }) => {
  const elRef = useRef<HTMLDivElement>(null);
  const [drawer, setDrawer] = useState(false);
  const [dataNode, setDataNode] = useState<NodeData>({ nodeName: '', nodeDescription: '' });
  const [nodeId, setNodeId] = useState<string>(id);

  // Simulação de df (Drawflow) e store, adapte conforme necessário
  const df = (window as any).df || { getNodeFromId: () => ({}), updateNodeDataFromId: () => {} };
  const effectiveStore = store || (window as any).store || {};

  useEffect(() => {
    if (elRef.current) {
      const parentId = elRef.current.parentElement?.parentElement?.id;
      if (parentId && parentId.startsWith('node-')) {
        const id = parentId.slice(5);
        setNodeId(id);
        const node = df.getNodeFromId(id) || {};
        setDataNode((prev) => ({ ...prev, ...node.data }));
      }
    }
  }, []);

  useEffect(() => {
    if (description && dataNode.nodeDescription !== description) {
      setDataNode((prev) => ({ ...prev, nodeDescription: description }));
    }
  }, [description]);

  useEffect(() => {
    if (nodeId) {
      df.updateNodeDataFromId(nodeId, dataNode);
    }
  }, [dataNode, nodeId]);

  const handleNameChange = (value: string) => {
    setDataNode((prev) => ({ ...prev, nodeName: value }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDataNode((prev) => ({ ...prev, nodeDescription: e.target.value }));
  };

return (
    <div ref={elRef}>
      <NodeHeader
        id={nodeId}
        name={name}
        value={dataNode.nodeName}
        onEdit={() => setDrawer(true)}
        onChange={handleNameChange}
      />
      
      <div className="node-body">
        <textarea
          className={`bg-transparent border-0 text-white-50 w-100`}
          value={dataNode.nodeDescription}
          onChange={handleDescriptionChange}
          placeholder="Set description"
        />
      </div>
      
      <NodeDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        title={name}
        fields={fields}
        dataNode={dataNode}
        store={effectiveStore}
        direction="rtl"
        onUpdateData={() => nodeId && df.updateNodeDataFromId(nodeId, dataNode)}
      />
    </div>
  );
};

export default BaseNode;
