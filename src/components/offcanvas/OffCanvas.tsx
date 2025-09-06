import React, { ReactNode } from 'react';

interface OffCanvasProps {
  show: boolean;
  onHide: () => void;
  placement: 'start' | 'end' | 'top' | 'bottom';
  name: string;
  children: ReactNode;
}

const OffCanvas: React.FC<OffCanvasProps> = ({ show, onHide, placement, name, children }) => {
  const offcanvasClasses = `offcanvas offcanvas-${placement} ${show ? 'show' : ''}`;

  return (
    <div className={offcanvasClasses} tabIndex={-1} id={`offcanvas-${name.replace(/\s/g, '')}`} aria-labelledby={`offcanvas-${name.replace(/\s/g, '')}Label`}>
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id={`offcanvas-${name.replace(/\s/g, '')}Label`}>
          {name}
        </h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
          onClick={onHide}
        ></button>
      </div>
      <div className="offcanvas-body">
        {children}
      </div>
    </div>
  );
};

export default OffCanvas;