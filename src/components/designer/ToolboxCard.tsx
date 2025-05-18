import React from 'react';
import Card from '../card/Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faDatabase, faCogs, IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface ToolboxCardProps {
  actions: any[];
  isActionsVisible: boolean;
  onDrag: (e: React.DragEvent<HTMLButtonElement>) => void;
}

const getIcon = (iconName: string) => {
  const icons: Record<string, IconDefinition> = {
    faCode,
    faDatabase,
    faCogs,
  };
  return icons[iconName] || faCode;
};

const ToolboxCard: React.FC<ToolboxCardProps> = ({ actions, isActionsVisible, onDrag }) => {
  if (!isActionsVisible) return null;
  return (
    <Card className="actions-card">
      <div className="accordion" id="actionsAccordion">
        {Object.entries(
          actions.reduce((acc: Record<string, any[]>, node: any) => {
            const collection = node.collectionId || 'Sem coleção';
            if (!acc[collection]) acc[collection] = [];
            acc[collection].push(node);
            return acc;
          }, {} as Record<string, any[]>)
        ).map(([collection, nodesInCollection], index) => (
          <div className="accordion-item" key={collection}>
            <h2 className="accordion-header" id={`heading-${index}`}>
              <button
                className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded={index === 0 ? 'true' : 'false'}
                aria-controls={`collapse-${index}`}
              >
                {collection}
              </button>
            </h2>
            <div
              id={`collapse-${index}`}
              className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#actionsAccordion"
            >
              <div className="accordion-body">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {nodesInCollection.map((node: any) => (
                    <button
                      key={node.id}
                      type="button"
                      className="btn btn-outline-secondary btn-lg"
                      style={{ margin: 0 }}
                      draggable="true"
                      data-bs-container="body"
                      data-bs-toggle="popover"
                      data-bs-placement="top"
                      data-bs-content="Top popover"
                      data-content={JSON.stringify(node)}
                      onDragStart={onDrag}
                    >
                      {node.icon?.source === 'fontawesome' && (
                        <FontAwesomeIcon icon={getIcon(node.icon.name)} className="me-2" />
                      )}
                      {node.icon?.source !== 'fontawesome' && node.icon?.source && (
                        <img src={node.icon.source} alt="icon" className="me-2" />
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
    </Card>
  );
};

export default ToolboxCard;
