import { useState, useEffect, useRef, ReactElement, Children } from 'react';
import Drawflow, { DrawflowNode } from 'drawflow';
import "./Designer.scss";
import ReactDOMServer from 'react-dom/server';
import BaseNode from '../nodes/BaseNode';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus, faMagnifyingGlass, faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons'
import ToolboxCard from './ToolboxCard';
import OffCanvas from '../offcanvas/OffCanvas';
import NodeDrawer from '../nodes/NodeDrawer';
import nodes from '../../data/nodes.json';

const Designer = ({ children }: {children?: ReactElement<typeof BaseNode>[]}) => {
  const [editor, setEditor] = useState<Drawflow|null>(null);
  const drawflowRef = useRef<HTMLDivElement | null>(null);
  const [isNodesVisible, setIsNodesVisible] = useState(false);
  const [isPropertiesVisible, setIsPropertiesVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState<DrawflowNode|undefined>(undefined);
  const [selectedNodeFields, setSelectedNodeFields] = useState<{input:any[],output:any[]}>({input:[],output:[]});
  const [selectedNodeData, setSelectedNodeData] = useState<any>({});
  const [selectedNodeTitle, setSelectedNodeTitle] = useState<string>("");
  
  useEffect(() => {
    if (drawflowRef) {
        setEditor(new Drawflow(drawflowRef.current as HTMLDivElement));
    }
  }, [drawflowRef]);

  useEffect(() => {
    if (drawflowRef.current && editor) {
      editor.start();
      
      Children.map(children, (child) => {
        if(React.isValidElement(child) && child.type === BaseNode) {
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
  
  const addNodeToEditor = ({id,clientX,clientY,name,description,fields}:{id:string, clientX:number, clientY: number,title:string,description:string,fields:any}) => {
    if(!editor) return;

    const pos_x = clientX * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) - (editor.precanvas.getBoundingClientRect().x * ( editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    const pos_y = clientY * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)) - (editor.precanvas.getBoundingClientRect().y * ( editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));
    const baseNode = <BaseNode name={name} description={description} fields={fields} x={pos_x} y={pos_y}/>;

    const nodeHtml = ReactDOMServer.renderToString(baseNode);
    editor.addNode(
      baseNode.type.name,
      1,
      1,
      pos_x-300,
      pos_y,
      baseNode.type.name.toLowerCase(),
      { name: '', id: id },
      nodeHtml,
      false
    );
    setNodeBoxEventListeners();
  }
  function setNodeBoxEventListeners(){
    const nodeBoxes = document.querySelectorAll('.node');
    nodeBoxes.forEach((nodeBox) => {
      const editButton = nodeBox.querySelector('.edit');
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
            const node = (editorNodes!)[match];
            setSelectedNode(node);
            // Buscar campos e dados do node em nodes.json
            const nodeDef = nodes.find((n:any) => n.id === dataId);
            setSelectedNodeFields(nodeDef?.fields || {input:[],output:[]});
            setSelectedNodeData(node.data || {});
            setSelectedNodeTitle(nodeDef?.name || "Node");
            setIsPropertiesVisible(true);
          }
        });
      }
    });
  }
  const onDrag = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData("data", (e.target as HTMLButtonElement).getAttribute('data-content') ?? '');
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const node:any = JSON.parse(e.dataTransfer.getData("data"));
    setIsNodesVisible(false);
    e.preventDefault();
    addNodeToEditor({
      ...node,
      clientX:e.clientX, 
      clientY:e.clientY,
      fields: node.fields || {input:[],output:[]}
    });
  }
  const toggleProperties = () => setIsPropertiesVisible(!isPropertiesVisible);



  return (
    <>
      <div ref={drawflowRef} onDrop={onDrop} onDragOver={(e)=> e.preventDefault()}>
        {!isNodesVisible && <FontAwesomeIcon className="show-nodes" icon={faCirclePlus} onClick={()=>setIsNodesVisible(true)}/>}
        {isNodesVisible && <FontAwesomeIcon className="show-nodes" icon={faCircleMinus} onClick={()=>setIsNodesVisible(false)}/>}
        <ToolboxCard nodes={nodes} isNodesVisible={isNodesVisible} onDrag={onDrag} />
        {isPropertiesVisible && (
          <OffCanvas onClose={toggleProperties} data={selectedNode}>
            <NodeDrawer
              open={isPropertiesVisible}
              onClose={toggleProperties}
              title={selectedNodeTitle}
              fields={selectedNodeFields}
              dataNode={selectedNodeData}
              store={{}}
              direction="rtl"
              onUpdateData={()=>{}}
            />
          </OffCanvas>
        )}

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