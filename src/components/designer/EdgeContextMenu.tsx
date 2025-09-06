import React, { useEffect, useRef } from 'react';
import { Edge } from 'reactflow';

interface EdgeContextMenuProps {
  edge: Edge | null;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onDelete: (edgeId: string) => void;
}

const EdgeContextMenu: React.FC<EdgeContextMenuProps> = ({ 
  edge, 
  position, 
  onClose, 
  onDelete 
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

  if (!edge || !position) {
    return null;
  }

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja remover esta conexão?')) {
      onDelete(edge.id);
      onClose();
    }
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
        minWidth: '120px',
      }}
    >
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
        🗑️ Remover Conexão
      </button>
    </div>
  );
};

export default EdgeContextMenu;
