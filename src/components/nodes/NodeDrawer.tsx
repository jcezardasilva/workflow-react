import React, { useState } from 'react';
import NodeInputFields from './NodeInputFields';
import NodeOutputFields from './NodeOutputFields';

interface Field {
  name: string;
  label?: string;
  type?: 'text' | 'number' | 'select' | 'textarea';
  description?: string;
  values?: string[];
  min?: number;
  max?: number;
}

interface Fields {
  input: Field[];
  output: Field[];
}

type FieldData = {
  [key: string]: string | number;
};

interface NodeDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: Fields;
  dataNode: FieldData;
  direction?: 'rtl' | 'ltr';
  onUpdateData: (newData: FieldData) => void;
}

const NodeDrawer: React.FC<NodeDrawerProps> = ({
  open,
  onClose,
  title,
  fields,
  dataNode,
  direction = 'rtl',
  onUpdateData,
}) => {
  const [localData, setLocalData] = useState<FieldData>(dataNode);

  const handleUpdateData = (newData: FieldData) => {
    setLocalData(newData);
    onUpdateData(newData);
  };

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
        <NodeInputFields 
          fields={fields.input} 
          dataNode={localData} 
          onUpdateData={handleUpdateData} 
        />
        <div style={{ marginTop: 20 }}>
          <NodeOutputFields 
            fields={fields.output} 
            dataNode={localData} 
            onUpdateData={handleUpdateData} 
          />
        </div>
      </div>
    </div>
  );
};

export default NodeDrawer;
