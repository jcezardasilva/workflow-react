import React from 'react';

interface NodeHeaderProps {
  name: string;
  value: string;
  onEdit: () => void;
  onChangeCollapse: (collapsed: boolean) => void;
  onChange: (value: string) => void;
  className?: string;
}

const NodeHeader: React.FC<NodeHeaderProps> = ({
  onEdit,
  name,
  className = '',
}) => {
  return (
    <div className={`node-header ${className} d-flex justify-content-between bg-transparent border-0 text-white-50 w-100`}>
      <span>{name}</span>
      <button onClick={onEdit} style={{ background: 'none', border: 'none', marginRight: -15, color: 'white', fontSize: 18, cursor: 'pointer' }}>⚙️</button>
    </div>
  );
};

export default NodeHeader;
