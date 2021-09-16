import { PathsObject, SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { RequestMethodEnum } from '../enums/request-method.enum';

export interface UpdateMockApiJson {
    method: RequestMethodEnum;
    endpoint: string;
    pathObject: PathsObject;
    schemaObject?: {
        key: string;
        value: SchemaObject;
    };
    responses?: any[];
}
