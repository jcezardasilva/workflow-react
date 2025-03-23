import './App.css';
import Designer from './components/designer/Designer';
import NodeBox from './components/nodebox';

function App() {  
  const nodes = [
    {title: 'node1', description: 'desc1', x: 10, y: 10},
    {title: 'node2', description: 'desc2', x: 100, y: 100}];
  
  return (
    <>
      <Designer>
        {nodes.map((node) => <NodeBox key={node.title} {...node}/>)}
      </Designer>
    </>
  )
}

export default App
