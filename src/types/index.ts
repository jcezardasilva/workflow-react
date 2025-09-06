export type FieldData = {
  [key: string]: string | number | boolean;
};

export interface Field {
  name: string;
  label?: string;
  type?: string;
  description?: string;
  value?: string | number | boolean;
  values?: string[];
  enum?: string[];
  min?: number;
  max?: number;
}

export interface Fields {
  input: Field[];
  output: Field[];
}

export interface Icon {
  name: string;
  source?: string; // Changed to string to accommodate various values from nodes.json
  library?: 'font-awesome' | 'custom';
  color?: string;
}

// Simplified NodeDefinition - all data at root level
export interface NodeDefinition {
  id: string;
  name: string;
  description: string;
  frontendComponent: string;
  backendComponent: string;
  collectionId: string;
  icon: Icon;
  fields: Fields;
  inputCount: number;
  outputCount: number;
}
