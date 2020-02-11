export interface PanelSettings {
    animate: boolean;
    sumTimings: boolean;
    filterEmptyConnections: boolean;
    style: PanelStyleSettings;
    showDebugInformation: boolean;
    showConnectionStats: boolean;
    externalIcons: IconResource[];
    dataMapping: DataMapping;
    showDummyData: boolean;
};

export interface DataMapping {
    sourceComponentPrefix: string;
    targetComponentPrefix: string;

    responseTimeColumn: string;
    requestRateColumn: string;
    errorRateColumn: string;
    responseTimeOutgoingColumn: string;
    requestRateOutgoingColumn: string;
    errorRateOutgoingColumn: string;

    extOrigin: string;
    extTarget: string;
    type: string;
};

export interface PanelStyleSettings {
    healthyColor: string;
    dangerColor: string;
}

export interface IconResource {
    name: string;
    filename: string;
}

export interface QueryResponseColumn {
    type: string;
    text: string;
};

export interface QueryResponse {
    columns: QueryResponseColumn[];
    rows: any[];
};

export interface CyData {
    group: string;
    data: {
        id: string;
        source?: string;
        target?: string;
        metrics: IGraphMetrics;
        type?: string;
        external_type?: string;
    }
};

export interface CurrentData {
    graph: GraphDataElement[];
    raw: QueryResponse[];
    columnNames: string[];
}

export interface GraphDataElement {
    source?: string;
    target: string;
    data: DataElement;
    type: GraphDataType;
};

export interface DataElement {
    rate_in?: number;
    rate_out?: number;
    response_time_in?: number;
    response_time_out?: number;
    error_rate_in?: number;
    error_rate_out?: number;
    type?: string;
};

export enum GraphDataType {
    SELF = 'SELF',
    INTERNAL = 'INTERNAL',
    EXTERNAL_OUT = 'EXTERNAL_OUT',
    EXTERNAL_IN = 'EXTERNAL_IN'
};

export interface IGraph {
    nodes: IGraphNode[],
    edges: IGraphEdge[]
};

export interface IGraphNode {
    name: string;
    type: EGraphNodeType;
    metrics?: IGraphMetrics;
    external_type?: string;
};

export interface IGraphMetrics {
    rate?: number;
    error_rate?: number;
    response_time?: number;
    success_rate?: number;
};

export enum EGraphNodeType {
    INTERNAL = 'INTERNAL',
    EXTERNAL = 'EXTERNAL'
};

export interface IGraphEdge {
    source: string;
    target: string;
    metrics?: IGraphMetrics;
};

export interface Particle {
    velocity: number;
    startTime: number;
};

export interface Particles {
    normal: Particle[];
    danger: Particle[];
};

export interface CyCanvas {
    getCanvas: () => HTMLCanvasElement;
    clear: (CanvasRenderingContext2D) => void;
    resetTransform: (CanvasRenderingContext2D) => void;
    setTransform: (CanvasRenderingContext2D) => void;
};

export interface TableContent {
    name: string;
    responseTime: string;
    rate: number | undefined;
    error:  string;
}