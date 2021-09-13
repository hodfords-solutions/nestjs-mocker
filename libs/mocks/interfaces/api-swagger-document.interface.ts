interface Endpoint {
    operationId: string;
    summary?: string;
    description?: string;
    tags: string[];
}

interface Endpoints {
    [method: string]: Endpoint;
}

export interface ApiSwaggerDocumentInterface {
    [endpoint: string]: Endpoints;
}
