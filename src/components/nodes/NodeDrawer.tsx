import React, { useState, useEffect, useCallback } from 'react';
import NodeInputFields from './NodeInputFields';
import NodeOutputFields from './NodeOutputFields';
import { Fields, FieldData } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface NodeDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: Fields;
  dataNode: FieldData;
  direction?: 'rtl' | 'ltr';
  onUpdateData: (newData: FieldData) => void;
  onDelete?: () => void;
}

const NodeDrawer: React.FC<NodeDrawerProps> = ({
  open,
  onClose,
  title,
  fields,
  dataNode,
  direction = 'rtl',
  onUpdateData,
  onDelete,
}) => {
  const [localData, setLocalData] = useState<FieldData>(dataNode);
  const [openSections, setOpenSections] = useState({
    informations: true,
    input: true,
    output: true
  });

  // Sincronizar o estado local com as mudanças externas apenas quando o painel abre
  useEffect(() => {
    if (open) {
      setLocalData(dataNode);
    }
  }, [open, dataNode]);

  const handleUpdateData = useCallback((newData: FieldData) => {
    setLocalData(newData);
    onUpdateData(newData);
  }, [onUpdateData]);

  // Handlers específicos para evitar re-renders
  const handleDescriptionChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newData = { ...localData, description: e.target.value };
    setLocalData(newData);
    onUpdateData(newData);
  }, [localData, onUpdateData]);

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...localData, label: e.target.value };
    setLocalData(newData);
    onUpdateData(newData);
  }, [localData, onUpdateData]);

  const handleTagsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...localData, tags: e.target.value };
    setLocalData(newData);
    onUpdateData(newData);
  }, [localData, onUpdateData]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const AccordionSection: React.FC<{
    title: string;
    icon: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }> = ({ title, icon, isOpen, onToggle, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: '6px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{icon}</span>
          <span style={{ 
            color: '#fff', 
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {title}
          </span>
        </div>
        <FontAwesomeIcon 
          icon={isOpen ? faChevronDown : faChevronRight} 
          style={{ color: '#ccc', fontSize: '12px' }}
        />
      </div>
      {isOpen && (
        <div style={{
          padding: '16px',
          backgroundColor: '#1e1e1e',
          border: '1px solid #444',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px'
        }}>
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`drawer${open ? ' open' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        [direction === 'rtl' ? 'right' : 'left']: 0,
        width: 400,
        height: '100%',
        background: '#222',
        color: 'white',
        zIndex: 1000,
        transform: open ? 'translateX(0)' : `translateX(${direction === 'rtl' ? '100%' : '-100%'})`,
        transition: 'transform 0.3s',
        overflowY: 'auto',
      }}
    >
      <div style={{ padding: 16, borderBottom: '1px solid #444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{title} - Properties</strong>
        <button 
          onClick={onClose} 
          style={{ 
            background: 'none', 
            color: 'white', 
            border: 'none', 
            fontSize: 20,
            padding: '4px 8px',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
          title="Fechar"
        >
          &times;
        </button>
      </div>
      <div style={{ padding: 16 }}>
        {/* Accordion 1: Informações */}
        <AccordionSection
          title="Informações"
          icon="📋"
          isOpen={openSections.informations}
          onToggle={() => toggleSection('informations')}
        >
          <div style={{ marginBottom: 12 }}>
            <label style={{ 
              color: '#ccc', 
              fontSize: '12px', 
              display: 'block', 
              marginBottom: 4 
            }}>
              Descrição
            </label>
            <textarea
              value={String(localData.description || '')}
              onChange={handleDescriptionChange}
              placeholder="Descrição do nó..."
              style={{
                width: '100%',
                minHeight: '60px',
                padding: '8px',
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px',
                resize: 'vertical'
              }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ 
              color: '#ccc', 
              fontSize: '12px', 
              display: 'block', 
              marginBottom: 4 
            }}>
              Label
            </label>
            <input
              type="text"
              value={String(localData.label || '')}
              onChange={handleLabelChange}
              placeholder="Label do nó..."
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
          </div>
          <div>
            <label style={{ 
              color: '#ccc', 
              fontSize: '12px', 
              display: 'block', 
              marginBottom: 4 
            }}>
              Tags
            </label>
            <input
              type="text"
              value={String(localData.tags || '')}
              onChange={handleTagsChange}
              placeholder="Tags separadas por vírgula..."
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#333',
                border: '1px solid #555',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '12px'
              }}
            />
          </div>
        </AccordionSection>

        {/* Accordion 2: Input */}
        <AccordionSection
          title="Input"
          icon="📥"
          isOpen={openSections.input}
          onToggle={() => toggleSection('input')}
        >
          <NodeInputFields 
            fields={fields.input} 
            dataNode={localData} 
            onUpdateData={handleUpdateData} 
          />
        </AccordionSection>

        {/* Accordion 3: Output */}
        <AccordionSection
          title="Output"
          icon="📤"
          isOpen={openSections.output}
          onToggle={() => toggleSection('output')}
        >
          <NodeOutputFields 
            fields={fields.output} 
            dataNode={localData} 
            onUpdateData={handleUpdateData} 
          />
        </AccordionSection>
        
        {/* Delete button at the bottom */}
        {onDelete && (
          <div style={{ 
            marginTop: 30, 
            paddingTop: 20, 
            borderTop: '1px solid #444',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <button 
              onClick={onDelete} 
              style={{ 
                background: '#ff6b6b', 
                color: 'white', 
                border: 'none', 
                fontSize: 14,
                padding: '8px 16px',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold'
              }}
              title="Remover nó"
            >
              <FontAwesomeIcon icon={faTrash} />
              Remover Nó
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeDrawer;
