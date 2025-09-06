import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Field, FieldData } from '../../types';

interface NodeInputFieldsProps {
  fields: Field[];
  dataNode: FieldData;
  onUpdateData: (newData: FieldData) => void;
}

const NodeInputFields: React.FC<NodeInputFieldsProps> = ({ fields, dataNode, onUpdateData }) => {
  const [localFields, setLocalFields] = useState<FieldData>({});
  const isInitialized = useRef(false);

  useEffect(() => {
    // Sincroniza o estado local apenas na inicialização ou quando os fields mudam
    if (!isInitialized.current || fields.length !== Object.keys(localFields).length) {
      const initialFields = fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: dataNode[field.name] || ''
      }), {} as FieldData);
      setLocalFields(initialFields);
      isInitialized.current = true;
    }
  }, [fields]); // Removido dataNode da dependência para evitar re-renders desnecessários

  const handleInputChange = useCallback((fieldName: string, value: string | number | boolean) => {
    // Atualiza o estado local
    setLocalFields(prev => {
      const newFields = { ...prev, [fieldName]: value };
      
      // Notifica o componente pai das mudanças de forma assíncrona
      setTimeout(() => {
        onUpdateData({ ...dataNode, ...newFields });
      }, 0);
      
      return newFields;
    });
  }, [dataNode, onUpdateData]);

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

export default NodeInputFields;
