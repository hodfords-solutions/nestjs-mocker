import { TypeSelectionEnum } from "../enums/type-selection.enum";

export const isArrayOfObjectType = (type) =>
  type === TypeSelectionEnum.ARRAY_OBJECT;
export const isArrayOfPrimitiveType = (type) =>
  type === TypeSelectionEnum.ARRAY_STRING ||
  type === TypeSelectionEnum.ARRAY_NUMBER;

export const isObjectType = (type) => type === TypeSelectionEnum.OBJECT;
export const isUUIDType = (type) => type === TypeSelectionEnum.UUID;
export const isFakerType = (type) => type === TypeSelectionEnum.FAKER;
export const isEnumType = (type) => type === TypeSelectionEnum.ENUM;
export const isEntitiesType = (type) => type === TypeSelectionEnum.ENTITIES;
export const isPrimitive = (type) =>
  type === TypeSelectionEnum.UUID ||
  type === TypeSelectionEnum.STRING ||
  type === TypeSelectionEnum.NUMBER ||
  type === TypeSelectionEnum.BOOLEAN ||
  type === TypeSelectionEnum.FAKER;
