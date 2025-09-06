import './App.scss';
import ReactFlowDesigner from './components/designer/ReactFlowDesigner';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {  
  
  return (
    <ThemeProvider>
      <ReactFlowDesigner />
    </ThemeProvider>
  )
}

export default App
