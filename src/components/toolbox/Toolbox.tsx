import React, { useState, useMemo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faDatabase,
  faCogs,
  IconDefinition,
  faMessage,
  faServer,
  faHexagonNodes,
  faHardDrive,
  faDiagramProject,
  faSearch,
  faBrain,
  faLink,
  faRobot,
  faMemory,
  faFolder,
  faGlobe
} from '@fortawesome/free-solid-svg-icons';
import Tooltip from './Tooltip';
import './Toolbox.scss';

interface ToolboxProps {
  nodes: any[];
  isNodesVisible: boolean;
  onDrag: (e: React.DragEvent<HTMLButtonElement>) => void;
}

const getIcon = (iconName: string) => {
  const icons: Record<string, IconDefinition> = {
    faCode,
    faDatabase,
    faCogs,
    faMessage,
    faServer,
    faHexagonNodes,
    faHardDrive,
    faDiagramProject,
    faBrain,
    faLink,
    faRobot,
    faMemory,
    faFolder,
    faGlobe
  };
  return icons[iconName] || faCode;
};

const Toolbox: React.FC<ToolboxProps> = ({ nodes, isNodesVisible, onDrag }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar nós baseado no termo de busca
  const filteredNodes = useMemo(() => {
    if (!searchTerm.trim()) return nodes;
    
    return nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (node.description && node.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (node.collectionId && node.collectionId.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [nodes, searchTerm]);

  // Agrupar nós filtrados por coleção
  const groupedNodes = useMemo(() => {
    return filteredNodes.reduce((acc: Record<string, any[]>, node: any) => {
      const collection = node.collectionId || 'Sem coleção';
      if (!acc[collection]) acc[collection] = [];
      acc[collection].push(node);
      return acc;
    }, {} as Record<string, any[]>);
  }, [filteredNodes]);

  if (!isNodesVisible) return null;

  return (
    <div 
      className="toolbox-wrapper"
      style={{ 
        width: '380px', 
        overflowY: 'auto',
        position: 'fixed',
        left: 0,
        top: '60px',
        zIndex: 1000,
        pointerEvents: 'auto',
        backgroundColor: 'var(--bg-toolbox)',
        border: '1px solid var(--border-primary)',
        borderRadius: '12px',
        margin: '20px',
        boxShadow: 'var(--shadow-lg)'
      }}
    >
      <div style={{ padding: '24px' }}>
        <h5 style={{ 
          color: 'var(--text-primary)', 
          marginBottom: '20px',
          fontSize: '1.1rem',
          fontWeight: '600',
          letterSpacing: '0.5px'
        }}>Toolbox</h5>
        
        {/* Campo de Busca */}
        <div className="toolbox-search" style={{ marginBottom: '20px' }}>
          <div style={{ position: 'relative' }}>
            <FontAwesomeIcon 
              icon={faSearch} 
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)',
                fontSize: '14px'
              }}
            />
            <input
              type="text"
              placeholder="Buscar componentes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px 10px 36px',
                border: '1px solid var(--border-primary)',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-primary)',
                fontSize: '14px',
                outline: 'none',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--border-focus)';
                e.target.style.boxShadow = '0 0 0 2px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-primary)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        
        <div className="accordion" id="toolboxAccordion">
          {Object.keys(groupedNodes).length > 0 ? (
            Object.entries(groupedNodes).map(([collection, nodesInCollection]) => (
              <div className="accordion-item" key={collection}>
                <h2 className="accordion-header" id={`heading-${collection.replace(/\s/g, '')}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${collection.replace(/\s/g, '')}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${collection.replace(/\s/g, '')}`}
                  >
                    {collection} ({nodesInCollection.length})
                  </button>
                </h2>
                <div
                  id={`collapse-${collection.replace(/\s/g, '')}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${collection.replace(/\s/g, '')}`}
                  data-bs-parent="#toolboxAccordion"
                >
                  <div className="accordion-body">
                    <div className="toolbox-nodes">
                      {nodesInCollection.map((node: any) => (
                        <Tooltip
                          key={node.id}
                          content={node.description || 'Sem descrição disponível'}
                          position="right"
                          delay={300}
                        >
                          <button
                            type="button"
                            className="toolbox-node-item"
                            draggable="true"
                            data-content={JSON.stringify(node)}
                            onDragStart={onDrag}
                          >
                            {node.icon?.source === 'fontawesome' && (
                              <FontAwesomeIcon icon={getIcon(node.icon.name)} className="me-2" />
                            )}
                            {node.name}
                          </button>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: 'var(--text-muted)',
              fontSize: '14px'
            }}>
              <FontAwesomeIcon 
                icon={faSearch} 
                style={{ 
                  fontSize: '24px', 
                  marginBottom: '12px',
                  opacity: 0.5
                }} 
              />
              <div>Nenhum componente encontrado</div>
              <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                Tente um termo diferente
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { Toolbox };
