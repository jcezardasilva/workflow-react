export interface NodeField {
    name?: string;
    label?: string;
    type?: string;
    description?: string;
    values?: any[];
    min?: number;
    max?: number;
    node?: number;
}

export interface NodeFields {
    input: NodeField[];
    output: NodeField[];
}

export interface NodeIconModel {
    name: string;
    source?: string;
    library: "font-awesome" | "custom";
    color?: string;
}
export interface NodeModel {
    id: string;
    name: string;
    frontendComponent: string;
    backendComponent: string;
    collectionId: string;
    icon: NodeIconModel;
    data: string;
    fields: NodeFields;
    inputCount: number;
    outputCount: number;
    description: string;
}

