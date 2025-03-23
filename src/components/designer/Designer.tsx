import { useState, useEffect, useRef, ReactElement, Children } from 'react';
import Drawflow from 'drawflow';
import "./Designer.css";
import ReactDOMServer from 'react-dom/server';
import NodeBox from '../nodebox';
import React from 'react';

const Designer = ({ children }: {children?: ReactElement<typeof NodeBox>[]}) => {
  const [editor, setEditor] = useState<Drawflow|null>(null);
  const drawflowRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    const drawflowElement = document.getElementById('drawflow');
    if (drawflowElement) {
      if (drawflowElement instanceof HTMLDivElement) {
        drawflowRef.current = drawflowElement;
        setEditor(new Drawflow(drawflowRef.current));
      }
    }
  }, []);

  useEffect(() => {
    if (drawflowRef.current && editor) {
      editor.start();
      
      Children.map(children, (child) => {
        if(React.isValidElement(child) && child.type === NodeBox) {
          const nodeHtml = ReactDOMServer.renderToString(child);
          editor.addNode(
            child.type.name,
            1,
            1,
            child.props.x,
            child.props.y,
            child.type.name,
            { name: '' },
            nodeHtml,
            false
          );
        }
      });
    }
  }, [editor,children]);
  
  return (
    <>
      <div id="drawflow" className="drawflow" ref={drawflowRef}></div>
    </>
  )
};

export default Designer;