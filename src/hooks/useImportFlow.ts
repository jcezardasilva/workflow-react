import { useCallback } from 'react';
import { Node, Edge } from 'reactflow';

interface ImportFlowData {
  nodes: Node[];
  edges: Edge[];
}

const useImportFlow = () => {
  const handleImport = useCallback((): Promise<ImportFlowData | null> => {
    return new Promise((resolve, reject) => {
      // Create file input element
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.style.display = 'none';

      // Handle file selection
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve(null);
          return;
        }

        // Validate file type
        if (!file.name.toLowerCase().endsWith('.json')) {
          reject(new Error('Por favor, selecione um arquivo JSON válido.'));
          return;
        }

        // Read file content
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const content = e.target?.result as string;
            const data = JSON.parse(content) as ImportFlowData;

            // Validate data structure
            if (!data || typeof data !== 'object') {
              reject(new Error('Formato de arquivo inválido. O arquivo deve conter um objeto com propriedades "nodes" e "edges".'));
              return;
            }

            if (!Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
              reject(new Error('Formato de arquivo inválido. As propriedades "nodes" e "edges" devem ser arrays.'));
              return;
            }

            // Validate nodes structure
            for (const node of data.nodes) {
              if (!node.id || !node.type || !node.position || !node.data) {
                reject(new Error('Formato de arquivo inválido. Cada nó deve ter as propriedades: id, type, position e data.'));
                return;
              }
            }

            // Validate edges structure
            for (const edge of data.edges) {
              if (!edge.id || !edge.source || !edge.target) {
                reject(new Error('Formato de arquivo inválido. Cada aresta deve ter as propriedades: id, source e target.'));
                return;
              }
            }

            resolve(data);
          } catch (error) {
            reject(new Error('Erro ao processar o arquivo JSON. Verifique se o arquivo está em um formato válido.'));
          }
        };

        reader.onerror = () => {
          reject(new Error('Erro ao ler o arquivo. Tente novamente.'));
        };

        reader.readAsText(file);
      };

      // Handle cancellation
      input.oncancel = () => {
        resolve(null);
      };

      // Trigger file selection
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    });
  }, []);

  return { handleImport };
};

export default useImportFlow;
