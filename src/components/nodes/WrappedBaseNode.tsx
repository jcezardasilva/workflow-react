import React from 'react';
import { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import { NodeDefinition, FieldData } from '../../types';

interface WrappedBaseNodeProps extends NodeProps {
  data: NodeDefinition & { dynamicData?: FieldData };
  onNodeDataChange: (nodeId: string, newData: Partial<FieldData>) => void;
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
