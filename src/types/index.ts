export type FieldData = {
  [key: string]: string | number | boolean;
};

export interface Field {
  name: string;
  label?: string;
  type?: string; // Changed to string to accommodate various values from nodes.json
  description?: string;
  values?: string[];
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

// Redefine NodeDefinition to explicitly separate static properties from dynamic data
export interface NodeDefinition {
  id: string;
  name: string;
  description: string;
  frontendComponent: string;
  backendComponent: string;
  collectionId: string;
  icon: Icon;
  // The 'data' property from nodes.json will now be parsed into FieldData for dynamic use
  data: string; // This will still be the original string from JSON, parsed at runtime
  fields: Fields;
  inputCount: number;
  outputCount: number;
  // Add a property to hold the parsed dynamic data for React Flow nodes
  dynamicData?: FieldData;
}
