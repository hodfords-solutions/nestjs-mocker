import { ColumnType } from 'typeorm';

export interface ColumnMeteArgs {
    key: string;
    type: ColumnType;
    isRequired: boolean;
}
