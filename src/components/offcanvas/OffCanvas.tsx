import { DrawflowNode } from "drawflow";

export default function OffCanvas({ children, onClose, data }: 
  { children?: React.ReactNode, onClose: () => void, data?:DrawflowNode }) {
  return (
  <div className="offcanvas offcanvas-end show" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
    <div className="offcanvas-header">
      <h5 id="offcanvasRightLabel">{data?.name} - Properties</h5>
      <button type="button" 
      className="btn-close" 
      data-bs-dismiss="offcanvas" 
      aria-label="Close"
      onClick={onClose}></button>
    </div>
    <div className="offcanvas-body">
        {children}
    </div>
  </div>  
  );
}