import { RequestMethodEnum } from "~mocks/enums/request-method.enum";
import {
  PathsObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

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
