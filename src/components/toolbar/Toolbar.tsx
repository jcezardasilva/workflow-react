import React from 'react';
import './Toolbar.scss';

interface ToolbarProps {
  onExport: () => void;
  // Adicione outras props para Import e Close se necessário
}

const Toolbar: React.FC<ToolbarProps> = ({ onExport }) => {
  return (
    <div className="toolbar d-flex justify-content-end">
      <button className="btn btn-sm btn-outline-secondary m-2">Import</button>
      <button className="btn btn-sm btn-outline-secondary m-2" onClick={onExport}>Export</button>
      <button className="btn btn-sm btn-outline-danger m-2">Close</button>
    </div>
  );
};

export default Toolbar;
