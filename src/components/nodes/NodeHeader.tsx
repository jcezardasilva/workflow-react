import React from 'react';

interface NodeHeaderProps {
  title: string;
  value: string;
  onEdit: () => void;
  onChangeCollapse: (collapsed: boolean) => void;
  onChange: (value: string) => void;
  className?: string;
}

const NodeHeader: React.FC<NodeHeaderProps> = ({
  title,
  value,
  onEdit,
  onChangeCollapse,
  onChange,
  className = '',
}) => {
  return (
    <div className={`node-header ${className}`} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#222', color: 'white', padding: 8 }}>
      <button onClick={() => onChangeCollapse(true)} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>-</button>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={title}
        style={{ flex: 1, background: 'transparent', color: 'white', border: 'none', fontWeight: 'bold', fontSize: 16 }}
      />
      <button onClick={onEdit} style={{ background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>⚙️</button>
    </div>
  );
};

export default NodeHeader;
