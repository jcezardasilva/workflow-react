import React from 'react';
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
  faDiagramProject
} from '@fortawesome/free-solid-svg-icons';
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
    faDiagramProject
  };
  return icons[iconName] || faCode;
};

const Toolbox: React.FC<ToolboxProps> = ({ nodes, isNodesVisible, onDrag }) => {
  if (!isNodesVisible) return null;

  return (
    <div className="toolbox-container">
      <div className="accordion" id="toolboxAccordion">
        {Object.entries(
          nodes.reduce((acc: Record<string, any[]>, node: any) => {
            const collection = node.collectionId || 'Sem coleção';
            if (!acc[collection]) acc[collection] = [];
            acc[collection].push(node);
            return acc;
          }, {} as Record<string, any[]>)
        ).map(([collection, nodesInCollection]) => (
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
                {collection}
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
                    <button
                      key={node.id}
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { Toolbox };
