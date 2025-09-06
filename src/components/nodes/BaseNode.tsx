import React, { useEffect, useRef, useState } from 'react';
import NodeHeader from './NodeHeader';
import { Handle, Position } from 'reactflow';
import { NodeDefinition, FieldData } from '../../types';
import './BaseNode.scss'; // Import the new SCSS file

interface BaseNodeProps {
  id: string;
  data: NodeDefinition & { dynamicData?: FieldData }; // Use NodeDefinition directly for static data, and optional dynamicData
  onNodeDataChange: (nodeId: string, newData: Partial<FieldData>) => void; // onNodeDataChange will now update only FieldData
}

const BaseNode: React.FC<BaseNodeProps> = ({ id, data }) => {
  const elRef = useRef<HTMLDivElement>(null);

  // nodeData will now hold a combination of NodeDefinition and its dynamicData
  const [nodeState, setNodeState] = useState<NodeDefinition & { dynamicData: FieldData }>({
    ...data,
    dynamicData: data.dynamicData || {}, // Ensure dynamicData is always an object
  });

  useEffect(() => {
    // Update local nodeData when React Flow's data prop changes
    setNodeState((prev) => ({
      ...prev,
      ...data,
      dynamicData: data.dynamicData || {}, // Ensure dynamicData is always an object
    }));
  }, [data]);

  const handleNameChange = (value: string) => {
    // For static properties like name, we might not want to update via onNodeDataChange (which is for dynamic data)
    setNodeState((prev) => ({ ...prev, name: value }));
    // If name is considered dynamic, then use: onNodeDataChange(id, { name: value });
  };




  return (
    <div 
      ref={elRef} 
      className="react-flow__node-default basenode"
      style={{ cursor: 'pointer' }}
    >
      <Handle type="target" position={Position.Left} />
      <NodeHeader
        id={id}
        name={nodeState.name}
        value={nodeState.name}
        onChange={handleNameChange}
      />
      
      <div className="node-body">
        <span className="text-white-50 w-100">
          {nodeState.description || "Set description"}
        </span>
      </div>
      
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export { BaseNode };
