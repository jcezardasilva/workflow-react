import { useState, useEffect, useRef, ReactElement, Children } from 'react';
import Drawflow, { DrawflowNode } from 'drawflow';
import "./Designer.scss";
import ReactDOMServer from 'react-dom/server';
import ActionBox from '../action-box/ActionBox';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus, faMagnifyingGlass, faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons'
import Card from '../card/Card';
import { ActionModel } from '../../models/ActionModel';
import OffCanvas from '../offcanvas/OffCanvas';
import { v4 as uuidv4 } from 'uuid';
import { defaultActions } from '../../data/toolbox';

const Designer = ({ children }: {children?: ReactElement<typeof ActionBox>[]}) => {
  const [editor, setEditor] = useState<Drawflow|null>(null);
  const drawflowRef = useRef<HTMLDivElement | null>(null);
  const [isActionsVisible, setIsActionsVisible] = useState(false);
  const [isPropertiesVisible, setIsPropertiesVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState<DrawflowNode|undefined>(undefined);
  const [actions, setActions] = useState<ActionModel[]>(defaultActions);
  
  useEffect(() => {
    if (drawflowRef) {
        setEditor(new Drawflow(drawflowRef.current as HTMLDivElement));
    }
  }, [drawflowRef]);

  useEffect(() => {
    if (drawflowRef.current && editor) {
      editor.start();
      
      Children.map(children, (child) => {
        if(React.isValidElement(child) && child.type === ActionBox) {
          const nodeHtml = ReactDOMServer.renderToString(child);
          editor.addNode(
            child.type.name,
            1,
            1,
            child.props.x,
            child.props.y,
            child.type.name.toLowerCase(),
            { name: '' },
            nodeHtml,
            false
          );
        }
      });
    }
  }, [editor,children]);
  
  const addActionToEditor = ({id,clientX,clientY,title,description}:{id:string, clientX:number, clientY: number,title:string,description:string}) => {
    if(!editor) return;

    const pos_x = clientX * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    const pos_y = clientY * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));
    const actionBox = <ActionBox id={id} title={title} description={description} x={pos_x} y={pos_y}/>;

    const nodeHtml = ReactDOMServer.renderToString(actionBox);
    editor.addNode(
      actionBox.type.name,
      1,
      1,
      pos_x,
      pos_y,
      actionBox.type.name.toLowerCase(),
      { name: '', id: id },
      nodeHtml,
      false
    );
    setActionBoxEventListeners();
  }
  function setActionBoxEventListeners(){
    const actionBoxes = document.querySelectorAll('.action');
    actionBoxes.forEach((actionBox) => {
      const editButton = actionBox.querySelector('.edit');
      if(editButton){
        editButton.addEventListener('click', (e) => {
          const element = (e.target as HTMLElement);
          let dataId = element.getAttribute('data-id') || "";
          if(!dataId) dataId = element.parentElement?.getAttribute('data-id') || "";
          const editorNodes = editor?.export().drawflow.Home.data;
          const match = Object.keys(editorNodes as {[node:string]: DrawflowNode}).find((key:string) => {
            return editorNodes![key].data.id === dataId;
          });
          if(dataId && match){
            setSelectedAction((editorNodes!)[match]);
            setIsPropertiesVisible(!isPropertiesVisible);
          }
        });
      }
    });
  }
  const onDrag = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData("data", (e.target as HTMLButtonElement).getAttribute('data-content') ?? '');
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const action:ActionModel = JSON.parse(e.dataTransfer.getData("data"));
    setIsActionsVisible(false);
    
    e.preventDefault();
    addActionToEditor({
      ...action,
      clientX:e.clientX, 
      clientY:e.clientY
    });
  }
  const toggleProperties = () => setIsPropertiesVisible(!isPropertiesVisible);

  return (
    <>
      <div ref={drawflowRef} onDrop={onDrop} onDragOver={(e)=> e.preventDefault()}>
        {!isActionsVisible && <FontAwesomeIcon className="show-actions" icon={faCirclePlus} onClick={()=>setIsActionsVisible(true)}/>}
        {isActionsVisible && <FontAwesomeIcon className="show-actions" icon={faCircleMinus} onClick={()=>setIsActionsVisible(false)}/>}
        {isActionsVisible && 
        <Card className="actions-card">
          <div className="accordion" id="actionsAccordion">
            {Object.entries(
              actions.reduce((acc, action) => {
                const category = action.category || "Uncategorized"; // Agrupa por categoria
                if (!acc[category]) acc[category] = [];
                acc[category].push(action);
                return acc;
              }, {} as Record<string, ActionModel[]>)
            ).map(([category, actionsInCategory], index) => (
              <div className="accordion-item" key={category}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className={`accordion-button ${index === 0 ? '' : 'collapsed'}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`collapse-${index}`}
                  >
                    {category}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#actionsAccordion"
                >
                  <div className="accordion-body">
                    {actionsInCategory.map((action) => (
                      <button
                        key={action.title}
                        type="button"
                        className="btn btn-outline-secondary btn-lg m-1"
                        draggable="true"
                        data-bs-container="body"
                        data-bs-toggle="popover"
                        data-bs-placement="top"
                        data-bs-content="Top popover"
                        data-content={JSON.stringify(action)}
                        onDragStart={onDrag}
                      >
                        {action.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
        }
        {isPropertiesVisible && <OffCanvas onClose={toggleProperties} data={selectedAction}></OffCanvas>}

        <div className="bar-zoom d-flex justify-content-between">
            <FontAwesomeIcon icon={faMagnifyingGlassMinus} onClick={()=>editor?.zoom_out()} className="m-2" style={{cursor:'pointer'}}/>
            <FontAwesomeIcon icon={faMagnifyingGlass} onClick={()=>editor?.zoom_reset()}  className="m-2" style={{cursor:'pointer'}}/>
            <FontAwesomeIcon icon={faMagnifyingGlassPlus} onClick={()=>editor?.zoom_in()}  className="m-2" style={{cursor:'pointer'}}/>
          </div>
      </div>
    </>
  )
};

export default Designer;