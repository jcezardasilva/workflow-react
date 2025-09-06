import React, { useState, useCallback } from 'react';
import { Controller, Control, FieldErrors } from 'react-hook-form';
import { NodeDefinition, NodeFormData } from '../../types';

interface NodeInfoEditorProps {
  nodeData: NodeDefinition;
  control: Control<NodeFormData>;
  errors: FieldErrors<NodeFormData>;
}

const NodeInfoEditor: React.FC<NodeInfoEditorProps> = ({ nodeData, control, errors }) => {
  const [newTag, setNewTag] = useState('');

  // Função para adicionar uma nova tag
  const addTag = useCallback((currentTags: string[], onChange: (tags: string[]) => void) => {
    if (newTag.trim() && !currentTags.includes(newTag.trim())) {
      const updatedTags = [...currentTags, newTag.trim()];
      onChange(updatedTags);
      setNewTag('');
    }
  }, [newTag]);

  // Função para remover uma tag
  const removeTag = useCallback((tagToRemove: string, currentTags: string[], onChange: (tags: string[]) => void) => {
    const updatedTags = currentTags.filter(tag => tag !== tagToRemove);
    onChange(updatedTags);
  }, []);

  // Função para lidar com Enter no input de tag
  const handleTagKeyPress = useCallback((e: React.KeyboardEvent, currentTags: string[], onChange: (tags: string[]) => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(currentTags, onChange);
    }
  }, [addTag]);

  const handleNewTagChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTag(e.target.value);
  }, []);

  return (
    <div>
      {/* Informações de Referência (somente leitura) */}
      <div style={{ marginBottom: 16, padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '4px', border: '1px solid var(--border-primary)' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          Informações de Referência
        </div>
        <div style={{ marginBottom: '8px' }}>
          <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Nome:</strong>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
            {nodeData.name}
          </span>
        </div>
        <div>
          <strong style={{ fontSize: '12px', color: 'var(--text-primary)' }}>Descrição:</strong>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', marginLeft: '8px' }}>
            {nodeData.description}
          </span>
        </div>
      </div>

      {/* Campo Title */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 4, 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: 'var(--text-primary)'
        }}>
          Título Personalizado
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input
              type="text"
              {...field}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none'
              }}
              placeholder="Título personalizado para o nó"
            />
          )}
        />
        {errors.title && (
          <div style={{ 
            color: '#ff6b6b', 
            fontSize: '12px', 
            marginTop: '4px',
            marginLeft: '8px'
          }}>
            {errors.title.message}
          </div>
        )}
      </div>

      {/* Campo Custom Description */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ 
          display: 'block', 
          marginBottom: 4, 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: 'var(--text-primary)'
        }}>
          Descrição Personalizada
        </label>
        <Controller
          name="customDescription"
          control={control}
          render={({ field }) => (
            <textarea
              {...field}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid var(--border-primary)',
                borderRadius: '4px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                minHeight: '60px'
              }}
              placeholder="Descrição personalizada para o nó"
              rows={3}
            />
          )}
        />
        {errors.customDescription && (
          <div style={{ 
            color: '#ff6b6b', 
            fontSize: '12px', 
            marginTop: '4px',
            marginLeft: '8px'
          }}>
            {errors.customDescription.message}
          </div>
        )}
      </div>

      {/* Campo Tags */}
      <div>
        <label style={{ 
          display: 'block', 
          marginBottom: 4, 
          fontSize: '12px', 
          fontWeight: 'bold',
          color: 'var(--text-primary)'
        }}>
          Tags
        </label>
        
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <div>
              {/* Input para adicionar nova tag */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="text"
                  value={newTag}
                  onChange={handleNewTagChange}
                  onKeyPress={(e) => handleTagKeyPress(e, field.value || [], field.onChange)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--bg-input)',
                    color: 'var(--text-primary)',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                  placeholder="Adicionar tag..."
                />
                <button
                  type="button"
                  onClick={() => addTag(field.value || [], field.onChange)}
                  disabled={!newTag.trim()}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: newTag.trim() ? '#4CAF50' : 'var(--bg-button)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-primary)',
                    borderRadius: '4px',
                    fontSize: '12px',
                    cursor: newTag.trim() ? 'pointer' : 'not-allowed',
                    opacity: newTag.trim() ? 1 : 0.6
                  }}
                >
                  +
                </button>
              </div>

              {/* Lista de tags existentes */}
              {field.value && field.value.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {field.value.map((tag: string, index: number) => (
                    <span
                      key={index}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        backgroundColor: 'var(--bg-tag)',
                        color: 'var(--text-primary)',
                        border: '1px solid var(--border-primary)',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '500'
                      }}
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag, field.value || [], field.onChange)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          fontSize: '10px',
                          padding: '0',
                          marginLeft: '2px'
                        }}
                        title="Remover tag"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        />
        {errors.tags && (
          <div style={{ 
            color: '#ff6b6b', 
            fontSize: '12px', 
            marginTop: '4px',
            marginLeft: '8px'
          }}>
            {errors.tags.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(NodeInfoEditor);
