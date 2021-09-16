import { ColumnType } from 'typeorm';

export interface ColumnMetaArgs {
    key: string;
    type: ColumnType;
    isRequired: boolean;
}
