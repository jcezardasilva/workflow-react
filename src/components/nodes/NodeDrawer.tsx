import React, { useState, useEffect, useCallback } from 'react';
import NodeInputFields from './NodeInputFields';
import NodeOutputFields from './NodeOutputFields';
import NodeInfoEditor from './NodeInfoEditor';
import { Fields, FieldData, NodeDefinition } from '../../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useNodeForm } from '../../hooks/useNodeForm';


interface NodeDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: Fields;
  dataNode: NodeDefinition;
  direction?: 'rtl' | 'ltr';
  onUpdateData: (newData: NodeDefinition) => void;
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
  // Usa o hook customizado para gerenciar o formulário
  const { form, saveFormData, resetForm, handleSubmit, errors, isDirty } = useNodeForm(fields, dataNode);
  
  const [openSections, setOpenSections] = useState({
    info: true,
    input: true,
    output: true
  });

  // Reset do formulário quando o painel abre ou o nó muda
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, dataNode, resetForm]);



  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Função para salvar os dados do formulário
  const onFormSubmit = useCallback((formData: FieldData) => {
    const updatedData = saveFormData(formData);
    
    // Debug: Log dos dados salvos
    console.log('📊 Dados salvos no nó:', {
      nodeId: dataNode.id,
      nodeName: dataNode.name,
      savedData: formData,
      updatedFields: updatedData.fields
    });

    onUpdateData(updatedData);
    onClose();
  }, [saveFormData, dataNode, onUpdateData, onClose]);

  // Handle drawer close - salva os dados atuais do formulário
  const handleClose = useCallback(() => {
    // Pega os valores atuais do formulário
    const currentValues = form.getValues();
    onFormSubmit(currentValues);
  }, [form, onFormSubmit]);

  // Função para salvar sem fechar
  const handleSave = useCallback(() => {
    const currentValues = form.getValues();
    const updatedData = saveFormData(currentValues);
    onUpdateData(updatedData);
  }, [form, saveFormData, onUpdateData]);


  // Componente separado para o botão de salvar para evitar re-renderizações
  const SaveButton: React.FC<{ isDirty: boolean; onSave: () => void }> = React.memo(({ isDirty, onSave }) => (
    <button 
      onClick={onSave}
      disabled={!isDirty}
      style={{ 
        background: isDirty ? '#4CAF50' : 'var(--bg-button)', 
        color: 'var(--text-primary)', 
        border: '1px solid var(--border-primary)', 
        fontSize: 12,
        padding: '4px 8px',
        cursor: isDirty ? 'pointer' : 'not-allowed',
        borderRadius: '4px',
        opacity: isDirty ? 1 : 0.6
      }}
      title={isDirty ? "Salvar Alterações" : "Nenhuma alteração para salvar"}
    >
      💾 Salvar
    </button>
  ));

  const AccordionSection: React.FC<{
    title: string;
    icon: string;
    isOpen: boolean;
    onToggle: () => void;
    children: React.ReactNode;
  }> = React.memo(({ title, icon, isOpen, onToggle, children }) => (
    <div style={{ marginBottom: 16 }}>
      <div
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px solid var(--border-primary)',
          borderRadius: '6px',
          cursor: 'pointer',
          userSelect: 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>{icon}</span>
          <span style={{ 
            color: 'var(--text-primary)', 
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {title}
          </span>
        </div>
        <FontAwesomeIcon 
          icon={isOpen ? faChevronDown : faChevronRight} 
          style={{ color: 'var(--text-secondary)', fontSize: '12px' }}
        />
      </div>
      {isOpen && (
        <div style={{
          padding: '16px',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-primary)',
          borderTop: 'none',
          borderRadius: '0 0 6px 6px'
        }}>
          {children}
        </div>
      )}
    </div>
  ));

  return (
    <div
      className={`drawer${open ? ' open' : ''}`}
      style={{
        position: 'fixed',
        top: 0,
        [direction === 'rtl' ? 'right' : 'left']: 0,
        width: 400,
        height: '100%',
        background: 'var(--bg-drawer)',
        color: 'var(--text-primary)',
        zIndex: 1000,
        transform: open ? 'translateX(0)' : `translateX(${direction === 'rtl' ? '100%' : '-100%'})`,
        transition: 'transform 0.3s',
        overflowY: 'auto',
        border: '1px solid var(--border-primary)',
      }}
    >
      <div style={{ padding: 16, borderBottom: '1px solid var(--border-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{title} - Properties</strong>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <SaveButton isDirty={isDirty} onSave={handleSave} />
          <button 
            onClick={handleClose} 
            style={{ 
              background: 'none', 
              color: 'var(--text-primary)', 
              border: 'none', 
              fontSize: 20,
              padding: '4px 8px',
              cursor: 'pointer',
              borderRadius: '4px'
            }}
            title="Fechar e Salvar"
          >
            &times;
          </button>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <form onSubmit={handleSubmit(onFormSubmit as any)}>
          {/* Accordion 1: Node Info */}
          <AccordionSection
            title="Informações"
            icon="ℹ️"
            isOpen={openSections.info}
            onToggle={() => toggleSection('info')}
          >
            <NodeInfoEditor 
              nodeData={dataNode}
              control={form.control as any}
              errors={errors}
            />
          </AccordionSection>

          {/* Accordion 2: Input */}
          <AccordionSection
            title="Entradas"
            icon="📥"
            isOpen={openSections.input}
            onToggle={() => toggleSection('input')}
          >
            <NodeInputFields 
              fields={fields.input} 
              control={form.control as any}
              errors={errors}
            />
          </AccordionSection>

          {/* Accordion 3: Output */}
          <AccordionSection
            title="Saídas"
            icon="📤"
            isOpen={openSections.output}
            onToggle={() => toggleSection('output')}
          >
            <NodeOutputFields 
              fields={fields.output} 
              control={form.control as any}
              errors={errors}
            />
          </AccordionSection>
        </form>
        
        {/* Delete button at the bottom */}
        {onDelete && (
          <div style={{ 
            marginTop: 30, 
            paddingTop: 20, 
            borderTop: '1px solid var(--border-primary)',
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

// Simple memoization - let React handle most of the optimization
export default React.memo(NodeDrawer);
