import React from 'react';

interface NodeHeaderProps {
  id: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

const NodeHeader: React.FC<NodeHeaderProps> = ({
  id,
  name,
  className = '',
}) => {
  return (
    <div className={`node-header ${className} d-flex justify-content-center bg-transparent border-0 text-white-50 w-100`}>
      <span>{name}</span>
    </div>
  );
};

export default NodeHeader;
