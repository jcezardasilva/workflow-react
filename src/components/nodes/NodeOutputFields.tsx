import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { Field, FieldData } from '../../types';

interface NodeOutputFieldsProps {
  fields: Field[];
  dataNode: FieldData;
  onUpdateData: (newData: FieldData) => void;
}

const NodeOutputFields: React.FC<NodeOutputFieldsProps> = ({ fields, dataNode, onUpdateData: _onUpdateData }) => {
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

    if (field.type === 'textarea') {
      return (
        <textarea
          value={value}
          onChange={e => handleInputChange(field.name, e.target.value)}
          style={{ ...commonStyles, minHeight: '80px' }}
        />
      );
    }

    return (
      <input
        type={field.type || 'text'}
        value={value}
        onChange={e => handleInputChange(field.name, e.target.value)}
        style={commonStyles}
      />
    );
  }, [localFields, handleInputChange]);

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Outputs</div>
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
              flexDirection: 'column',
              width: '100%'
            }}>
              <label style={{ 
                marginBottom: 4,
                display: 'flex',
                alignItems: 'center'
              }}>
                {field.label || field.name}
              </label>
              {renderInput(field)}
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

export default memo(NodeOutputFields);
