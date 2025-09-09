import React, { useEffect, useRef, useState } from 'react';
import NodeHeader from './NodeHeader';
import { Handle, Position } from 'reactflow';
import { NodeDefinition } from '../../types';
import './BaseNode.scss'; // Import the new SCSS file

interface BaseNodeProps {
  id: string;
  data: NodeDefinition;
  onNodeDataChange: (nodeId: string, newData: NodeDefinition) => void;
}

const BaseNode: React.FC<BaseNodeProps> = ({ id, data }) => {
  const elRef = useRef<HTMLDivElement>(null);

  const [nodeState, setNodeState] = useState<NodeDefinition>(data);

  useEffect(() => {
    setNodeState(data);
  }, [data]);

  const handleNameChange = (value: string) => {
    setNodeState((prev) => ({ ...prev, name: value }));
  };

  // Função para gerar handles de entrada dinamicamente
  const renderInputHandles = () => {
    const handles = [];
    const inputCount = nodeState.inputCount || 1;
    
    for (let i = 0; i < inputCount; i++) {
      let topOffset: string;
      
      if (inputCount === 1) {
        topOffset = '50%';
      } else {
        // Distribui os handles uniformemente ao longo da altura do nó
        const spacing = 100 / (inputCount + 1);
        topOffset = `${(i + 1) * spacing}%`;
      }
      
      handles.push(
        <Handle
          key={`input-${i}`}
          type="target"
          position={Position.Left}
          id={`input-${i}`}
          style={{
            top: topOffset,
            transform: 'translateY(-50%)',
          }}
        />
      );
    }
    return handles;
  };

  // Função para gerar handles de saída dinamicamente
  const renderOutputHandles = () => {
    const handles = [];
    const outputCount = nodeState.outputCount || 1;
    
    for (let i = 0; i < outputCount; i++) {
      let topOffset: string;
      
      if (outputCount === 1) {
        topOffset = '50%';
      } else {
        // Distribui os handles uniformemente ao longo da altura do nó
        const spacing = 100 / (outputCount + 1);
        topOffset = `${(i + 1) * spacing}%`;
      }
      
      handles.push(
        <Handle
          key={`output-${i}`}
          type="source"
          position={Position.Right}
          id={`output-${i}`}
          style={{
            top: topOffset,
            transform: 'translateY(-50%)',
          }}
        />
      );
    }
    return handles;
  };

  return (
    <div 
      ref={elRef} 
      className="react-flow__node-default basenode"
      style={{ cursor: 'grab' }}
    >
      {renderInputHandles()}
      <NodeHeader
        id={id}
        name={nodeState.title || nodeState.name}
        value={nodeState.title || nodeState.name}
        onChange={handleNameChange}
      />
      
      {/* Nome original abaixo do título quando há título personalizado */}
      {nodeState.title && (
        <div style={{ 
          fontSize: '11px', 
          color: 'var(--text-muted)', 
          textAlign: 'center',
          marginTop: '2px',
          fontStyle: 'italic'
        }}>
          {nodeState.name}
        </div>
      )}
      
      <div className="node-body">
        <span style={{ color: 'var(--text-secondary)', width: '100%' }}>
          {nodeState.customDescription || nodeState.description || "Set description"}
        </span>
      </div>
      
      {renderOutputHandles()}
    </div>
  );
};

export { BaseNode };
