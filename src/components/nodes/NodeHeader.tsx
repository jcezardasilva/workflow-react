import React from 'react';

interface NodeHeaderProps {
  id: string;
  name: string;
  value: string;
  onChange?: (value: string) => void;
  className?: string;
}

const NodeHeader: React.FC<NodeHeaderProps> = ({
  name,
  className = '',
}) => {
  return (
    <div 
      className={`node-header ${className} d-flex justify-content-center bg-transparent border-0 w-100`}
      style={{ color: 'var(--text-primary)' }}
    >
      <span>{name}</span>
    </div>
  );
};

export default NodeHeader;
