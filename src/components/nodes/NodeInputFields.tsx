import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Field, FieldData } from '../../types';

interface NodeInputFieldsProps {
  fields: Field[];
  dataNode: FieldData;
  onUpdateData: (newData: FieldData) => void; // Keep for interface compatibility
}

const NodeInputFields: React.FC<NodeInputFieldsProps> = ({ fields, dataNode, onUpdateData: _onUpdateData }) => {
  const [localFields, setLocalFields] = useState<FieldData>({});
  const isInitialized = useRef(false);

  useEffect(() => {
    // Sincroniza o estado local apenas na inicialização ou quando os fields mudam
    if (!isInitialized.current) {
      const initialFields = fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: dataNode[field.name] || ''
      }), {} as FieldData);
      setLocalFields(initialFields);
      isInitialized.current = true;
    }
  }, [fields, dataNode]); // Adicionado dataNode de volta para sincronização inicial

  const handleInputChange = useCallback((fieldName: string, value: string | number | boolean) => {
    // Only update local state - no propagation
    setLocalFields(prev => ({
      ...prev,
      [fieldName]: value
    }));
  }, []); // No dependencies needed

  const renderInput = useCallback((field: Field) => {
    const value = String(localFields[field.name] || '');
    const commonStyles = {
      width: '100%',
      background: '#333',
      color: 'white',
      border: '1px solid #444',
      padding: '4px 8px',
      borderRadius: '4px'
    };

    if (field.type === 'select' && field.values) {
      return (
        <select
          value={value}
          onChange={e => handleInputChange(field.name, e.target.value)}
          style={commonStyles}
        >
          <option value="">Selecione...</option>
          {field.values.map((value, i) => (
            <option key={i} value={value}>{value}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={e => handleInputChange(field.name, e.target.value)}
          style={{ ...commonStyles, minHeight: '80px', padding: 4 }}
        />
      );
    }

    if (field.type === 'number') {
      return (
        <input
          type="number"
          value={value}
          onChange={e => handleInputChange(field.name, Number(e.target.value))}
          min={field.min}
          max={field.max}
          style={commonStyles}
        />
      );
    }
    if (field.type === "boolean") {
      return (
        <input
          type="checkbox"
          checked={value === 'true'}
          onChange={e => handleInputChange(field.name, e.target.checked)}
          style={{
            margin: '0 8px 0 0',
            cursor: 'pointer'
          }}
        />
      );
    }

    return (
      <input
        type="text"
        value={value}
        onChange={e => handleInputChange(field.name, e.target.value)}
        style={commonStyles}
      />
    );
  }, [localFields, handleInputChange]);

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Inputs</div>
      {fields.map((field) => (
        <div key={field.name} style={{ marginBottom: 8 }}>
          <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              flexDirection: field.type === 'boolean' ? 'row' : 'column',
              width: '100%'
            }}>
              <label style={{ 
                marginBottom: field.type === 'boolean' ? 0 : 4,
                display: 'flex',
                alignItems: 'center'
              }}>
                {field.type === 'boolean' && renderInput(field)}
                {field.label || field.name}
              </label>
              {field.type !== 'boolean' && renderInput(field)}
            </div>
            {field.description && (
              <span style={{ fontSize: '0.8em', color: '#999' }}>
                ({field.description})
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(NodeInputFields, (prevProps, nextProps) => {
  // Comparação customizada para evitar re-renders desnecessários
  if (prevProps.fields !== nextProps.fields) return false;
  if (prevProps.onUpdateData !== nextProps.onUpdateData) return false;
  
  // Comparação mais eficiente dos dados do nó
  const prevKeys = Object.keys(prevProps.dataNode);
  const nextKeys = Object.keys(nextProps.dataNode);
  
  if (prevKeys.length !== nextKeys.length) return false;
  
  for (const key of prevKeys) {
    if (prevProps.dataNode[key] !== nextProps.dataNode[key]) {
      return false;
    }
  }
  
  return true;
});
