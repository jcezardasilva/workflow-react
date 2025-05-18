
import React from 'react';
import NodeInputFields from './NodeInputFields';
import NodeOutputFields from './NodeOutputFields';
import VariablesTable from './VariablesTable';

interface NodeDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: { input: any[]; output: any[] };
  dataNode: any;
  store: any;
  direction?: 'rtl' | 'ltr';
  onUpdateData: () => void;
}

const NodeDrawer: React.FC<NodeDrawerProps> = ({
  open,
  onClose,
  title,
  fields,
  dataNode,
  store,
  direction = 'rtl',
  onUpdateData,
}) => {
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
      <div style={{ padding: 16, borderBottom: '1px solid #444' }}>
        <strong>{title} - Properties</strong>
        <button onClick={onClose} style={{ float: 'right', background: 'none', color: 'white', border: 'none', fontSize: 20 }}>&times;</button>
      </div>
      <div style={{ padding: 16 }}>
        <NodeInputFields fields={fields.input} dataNode={dataNode} onUpdateData={onUpdateData} />
        <NodeOutputFields fields={fields.output} dataNode={dataNode} onUpdateData={onUpdateData} />
        <div style={{ marginTop: 32 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Context Variables</div>
          <VariablesTable data={store?.contextVariables || []} />
        </div>
      </div>
    </div>
  );
};

export default NodeDrawer;
