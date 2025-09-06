import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../../contexts/ThemeContext';
import './Toolbar.scss';

interface ToolbarProps {
  onExport: () => void;
  onImport: () => void;
  onClose?: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ onExport, onImport, onClose }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="toolbar d-flex justify-content-end align-items-center">
      <button 
        className="btn btn-sm btn-outline-secondary m-2" 
        onClick={toggleTheme}
        title={`Alternar para tema ${theme === 'light' ? 'escuro' : 'claro'}`}
      >
        <FontAwesomeIcon icon={theme === 'light' ? faMoon : faSun} />
      </button>
      <button className="btn btn-sm btn-outline-secondary m-2" onClick={onImport}>
        Import
      </button>
      <button className="btn btn-sm btn-outline-secondary m-2" onClick={onExport}>
        Export
      </button>
      {onClose && (
        <button className="btn btn-sm btn-outline-danger m-2" onClick={onClose}>
          Close
        </button>
      )}
    </div>
  );
};

export default Toolbar;
