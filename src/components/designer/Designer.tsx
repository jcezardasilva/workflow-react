import React from 'react';
import "./Designer.scss";
import ReactFlowDesigner from './ReactFlowDesigner';

interface DesignerProps { }

const Designer: React.FC<DesignerProps> = () => {
  return (
    <div className="designer-container">
      <div className="reactflow-col">
        <ReactFlowDesigner />
        <div className="toolbar d-flex justify-content-end">
          <button className="btn btn-sm btn-outline-secondary m-2">Import</button>
          <button className="btn btn-sm btn-outline-secondary m-2">Export</button>
          <button className="btn btn-sm btn-outline-danger m-2">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Designer;