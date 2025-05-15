export interface ActionModel {
    id: string,
    title: string,
    description: string,
    category: string,
    icon: ActionIconModel,
}


export interface ActionIconModel {
    name: string,
    source?: string,
    library: "font-awesome" | "custom",
    color?: string,
}