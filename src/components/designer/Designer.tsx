import { useState, useEffect, useRef, ReactElement, Children } from 'react';
import Drawflow, { DrawflowNode } from 'drawflow';
import "./Designer.scss";
import ReactDOMServer from 'react-dom/server';
import BaseNode from '../nodes/BaseNode';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus, faMagnifyingGlass, faCirclePlus, faCircleMinus } from '@fortawesome/free-solid-svg-icons'
import ToolboxCard from './ToolboxCard';
import NodeDrawer from '../nodes/NodeDrawer';
import nodes from '../../data/nodes.json';
import { v4 as uuid } from 'uuid';

type FieldData = {
  [key: string]: string | number;
};

interface Field {
  name: string;
  label?: string;
  type?: 'text' | 'number' | 'select' | 'textarea';
  description?: string;
  values?: string[];
  min?: number;
  max?: number;
}

interface Fields {
  input: Field[];
  output: Field[];
}

interface Icon {
  name: string;
  source?: string;
  library?: 'font-awesome' | 'custom';
  color?: string;
}

interface NodeDefinition {
  id: string;
  name: string;
  description: string;
  frontendComponent: string;
  backendComponent: string;
  collectionId: string;
  icon: Icon;
  data: string;
  fields: Fields;
  inputCount: number;
  outputCount: number;
}

const Designer = ({ children }: {children?: ReactElement<typeof BaseNode>[]}) => {
  const [editor, setEditor] = useState<Drawflow|null>(null);
  const drawflowRef = useRef<HTMLDivElement | null>(null);
  const [isNodesVisible, setIsNodesVisible] = useState(false);
  const [isPropertiesVisible, setIsPropertiesVisible] = useState(false);
  const [selectedNodeFields, setSelectedNodeFields] = useState<Fields>({input:[],output:[]});
  const [selectedNodeData, setSelectedNodeData] = useState<FieldData>({});
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [selectedNodeTitle, setSelectedNodeTitle] = useState<string>("");
  
  useEffect(() => {
    if (drawflowRef.current) {
      const newEditor = new Drawflow(drawflowRef.current);
      newEditor.start();
      setEditor(newEditor);
    }
  }, []);

  useEffect(() => {
    if (editor && children) {
      Children.forEach(children, (child) => {
        if(React.isValidElement(child) && child.type === BaseNode) {
          const nodeHtml = ReactDOMServer.renderToString(child);
          editor.addNode(
            child.type.name,
            1,
            1,
            0,  // Posição x padrão
            0,  // Posição y padrão
            child.type.name.toLowerCase(),
            { name: '' },
            nodeHtml,
            false
          );
        }
      });
    }
  }, [editor, children]);
  
  const updateNodeData = (nodeId: string, data: FieldData) => {
    if (!editor) return;
    
    const modules = editor.export().drawflow;
    const currentModule = modules.Home;
    
    if (!currentModule || !currentModule.data) return;
    
    Object.keys(currentModule.data).forEach(key => {
      const node = currentModule.data[key];
      if (node.data.id === nodeId) {
        // Atualiza os dados do nó
        editor.updateNodeDataFromId(key, { ...node.data, ...data });
        
        // Atualiza o estado local se este for o nó selecionado
        if (selectedNodeId === nodeId) {
          setSelectedNodeData(data);
        }
      }
    });
  };

  const addNodeToEditor = ({id, clientX, clientY, name, description, fields}:{
    id: string;
    clientX: number;
    clientY: number;
    name: string;
    description: string;
    fields: Fields;
  }) => {
    if(!editor) return;

    const nodeId = id || uuid();
    const pos_x = clientX * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)) 
                 - (editor.precanvas.getBoundingClientRect().x * (editor.precanvas.clientWidth / (editor.precanvas.clientWidth * editor.zoom)));
    const pos_y = clientY * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom))
                 - (editor.precanvas.getBoundingClientRect().y * (editor.precanvas.clientHeight / (editor.precanvas.clientHeight * editor.zoom)));
    
    const baseNode = <BaseNode name={name} id={nodeId} description={description} fields={fields}/>;

    const nodeHtml = ReactDOMServer.renderToString(baseNode);
    editor.addNode(
      baseNode.type.name,
      1,
      1,
      pos_x-300,
      pos_y,
      baseNode.type.name.toLowerCase(),
      { name, id: nodeId },
      nodeHtml,
      false
    );
    setNodeBoxEventListeners();
  }

  const setNodeBoxEventListeners = () => {
    const nodeBoxes = document.querySelectorAll('.basenode');
    nodeBoxes.forEach((nodeBox) => {
      const editButton = nodeBox.querySelector('.edit');
      if(editButton){
        editButton.addEventListener('click', (e) => {
          const element = (e.target as HTMLElement);
          let dataId = element.getAttribute('data-id') || "";
          
          const buttonParent = element.closest('.edit');
          if(!dataId) dataId = buttonParent?.getAttribute('data-id') || "";

          if (!dataId) return;

          const editorNodes = editor?.export().drawflow.Home.data;
          const match = Object.keys(editorNodes as {[node:string]: DrawflowNode}).find((key:string) => {
            return editorNodes![key].data.id === dataId;
          });

          if(match){
            const node = (editorNodes!)[match];
            const nodeDef = (nodes as NodeDefinition[]).find(n => n.id === dataId);
            
            setSelectedNodeId(dataId);
            setSelectedNodeFields(nodeDef?.fields || {input:[],output:[]});
            setSelectedNodeData(node.data || {});
            setSelectedNodeTitle(nodeDef?.name || "Node");
            setIsPropertiesVisible(true);
          }
        });
      }
    });
  };

  const onDrag = (e: React.DragEvent<HTMLButtonElement>) => {
    e.dataTransfer.setData("data", (e.target as HTMLButtonElement).getAttribute('data-content') ?? '');
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const node = JSON.parse(e.dataTransfer.getData("data")) as NodeDefinition;
    setIsNodesVisible(false);
    e.preventDefault();
    addNodeToEditor({
      ...node,
      clientX: e.clientX, 
      clientY: e.clientY,
      fields: node.fields || {input:[],output:[]}
    });
  };

  const handleNodeDataUpdate = (newData: FieldData) => {
    if (selectedNodeId) {
      updateNodeData(selectedNodeId, newData);
    }
  };

  return (
    <>
      <div ref={drawflowRef} onDrop={onDrop} onDragOver={(e)=> e.preventDefault()}>
        {!isNodesVisible && <FontAwesomeIcon className="show-nodes" icon={faCirclePlus} onClick={()=>setIsNodesVisible(true)}/>}
        {isNodesVisible && <FontAwesomeIcon className="show-nodes" icon={faCircleMinus} onClick={()=>setIsNodesVisible(false)}/>}
        <ToolboxCard nodes={nodes as NodeDefinition[]} isNodesVisible={isNodesVisible} onDrag={onDrag} />
        {isPropertiesVisible && (
          <NodeDrawer
            open={isPropertiesVisible}
            onClose={() => setIsPropertiesVisible(false)}
            title={selectedNodeTitle}
            fields={selectedNodeFields}
            dataNode={selectedNodeData}
            direction="rtl"
            onUpdateData={handleNodeDataUpdate}
          />
        )}
        <div className="bar-zoom d-flex justify-content-between">
          <FontAwesomeIcon icon={faMagnifyingGlassMinus} onClick={()=>editor?.zoom_out()} className="m-2" style={{cursor:'pointer'}}/>
          <FontAwesomeIcon icon={faMagnifyingGlass} onClick={()=>editor?.zoom_reset()} className="m-2" style={{cursor:'pointer'}}/>
          <FontAwesomeIcon icon={faMagnifyingGlassPlus} onClick={()=>editor?.zoom_in()} className="m-2" style={{cursor:'pointer'}}/>
        </div>
      </div>
    </>
  );
};

export default Designer;