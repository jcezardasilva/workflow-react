import { useCallback } from 'react';
import { Node, Edge } from 'reactflow';

const useExportFlow = (nodes: Node[], edges: Edge[]) => {
  const handleExport = useCallback(() => {
    const data = {
      nodes: nodes,
      edges: edges,
    };

    const filename = 'reactflow_export.json';
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }, [nodes, edges]);

  return { handleExport };
};

export default useExportFlow;
