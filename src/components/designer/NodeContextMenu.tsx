import React, { useEffect, useRef } from 'react';
import { Node } from 'reactflow';

interface NodeContextMenuProps {
  node: Node | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onDelete: (nodeId: string) => void;
  onEdit: (node: Node) => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({ 
  node, 
  position, 
  onClose, 
  onDelete,
  onEdit
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (position) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [position, onClose]);

  if (!node || !position) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja remover este nó?')) {
      onDelete(node.id);
      onClose();
    }
  };

  const handleEdit = () => {
    onEdit(node);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 1000,
        backgroundColor: 'var(--bg-primary)',
        border: '1px solid var(--border-primary)',
        borderRadius: '4px',
        boxShadow: 'var(--shadow-md)',
        padding: '4px 0',
        minWidth: '140px',
      }}
    >
      <button
        onClick={handleEdit}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-button-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        ✏️ Editar Nó
      </button>
      
      <div style={{
        height: '1px',
        backgroundColor: 'var(--border-primary)',
        margin: '4px 0'
      }} />
      
      <button
        onClick={handleDelete}
        style={{
          width: '100%',
          padding: '8px 12px',
          border: 'none',
          backgroundColor: 'transparent',
          color: '#dc3545',
          textAlign: 'left',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--bg-button-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        🗑️ Remover Nó
      </button>
    </div>
  );
};

export default NodeContextMenu;
