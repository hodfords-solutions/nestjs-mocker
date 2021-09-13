import {
  PathsObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export interface SwaggerSpec {
  pathObject: PathsObject;
  schemaObject: {
    key: string;
    value: SchemaObject;
  };
}
