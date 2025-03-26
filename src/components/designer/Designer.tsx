import { useState, useEffect, useRef, ReactElement, Children } from 'react';
import Drawflow from 'drawflow';
import "./Designer.scss";
import ReactDOMServer from 'react-dom/server';
import NodeBox from '../ActionBox';
import React from 'react';

const Designer = ({ children }: {children?: ReactElement<typeof NodeBox>[]}) => {
  const [editor, setEditor] = useState<Drawflow|null>(null);
  const drawflowRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    if (drawflowRef) {
        setEditor(new Drawflow(drawflowRef.current as HTMLDivElement));
    }
  }, [drawflowRef]);

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
            child.type.name.toLowerCase(),
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
      <div ref={drawflowRef}></div>
    </>
  )
};

export default Designer;