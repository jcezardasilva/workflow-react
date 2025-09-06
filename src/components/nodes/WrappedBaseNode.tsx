import React from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import { NodeDefinition } from '../../types';

interface WrappedBaseNodeProps extends NodeProps {
  data: NodeDefinition;
  onNodeDataChange: (nodeId: string, newData: NodeDefinition) => void;
}

const WrappedBaseNode: React.FC<WrappedBaseNodeProps> = ({ id, data, onNodeDataChange }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      onNodeDataChange={onNodeDataChange}
    />
  );
};

export { WrappedBaseNode };
