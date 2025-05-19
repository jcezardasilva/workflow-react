import React, { useState, useEffect } from 'react';

interface Field {
  name: string;
  label?: string;
  type?: 'text' | 'number' | 'select' | 'textarea';
  description?: string;
  values?: string[];
  min?: number;
  max?: number;
}

type FieldData = {
  [key: string]: string | number;
};

interface NodeOutputFieldsProps {
  fields: Field[];
  dataNode: FieldData;
  onUpdateData: (newData: FieldData) => void;
}

const NodeOutputFields: React.FC<NodeOutputFieldsProps> = ({ fields, dataNode, onUpdateData }) => {
  const [localFields, setLocalFields] = useState<FieldData>({});

  useEffect(() => {
    const initialFields = fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: dataNode[field.name] || ''
    }), {} as FieldData);
    setLocalFields(initialFields);
  }, [dataNode, fields]);

  const handleInputChange = (fieldName: string, value: string | number) => {
    setLocalFields(prev => {
      const newFields = { ...prev, [fieldName]: value };
      onUpdateData({ ...dataNode, ...newFields });
      return newFields;
    });
  };

  const renderInput = (field: Field) => {
    const value = String(localFields[field.name] || '');
    const commonStyles = {
      width: '100%',
      background: '#333',
      color: 'white',
      border: '1px solid #444',
      padding: '4px 8px',
      borderRadius: '4px'
    };

    if (field.type === 'textarea') {      return (
        <textarea
          value={value}
          onChange={e => handleInputChange(field.name, e.target.value)}
          style={{ ...commonStyles, minHeight: '80px' }}
        />
      );
    }

    return (      <input
        type={field.type || 'text'}
        value={value}
        onChange={e => handleInputChange(field.name, e.target.value)}
        style={commonStyles}
      />
    );
  };

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Outputs</div>
      {fields.map((field, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
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

export default NodeOutputFields;
