import React from 'react';

interface NodeInputFieldsProps {
  fields: any[];
  dataNode: any;
  onUpdateData: () => void;
}

const NodeInputFields: React.FC<NodeInputFieldsProps> = ({ fields, dataNode, onUpdateData }) => {
  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Inputs</div>
      {fields.map((field, idx) => (
        <div key={idx} style={{ marginBottom: 8 }}>
          <label>{field.label || field.name}</label>
          <input
            type="text"
            value={dataNode[field.name] || ''}
            onChange={e => {
              dataNode[field.name] = e.target.value;
              onUpdateData();
            }}
            style={{ width: '100%', background: '#333', color: 'white', border: '1px solid #444', padding: 4 }}
          />
        </div>
      ))}
    </div>
  );
};

export default NodeInputFields;
