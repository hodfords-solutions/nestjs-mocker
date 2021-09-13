import { QueryRunner } from 'typeorm';
import { BaseMigration } from '@diginexhk/typeorm-helper';

export class CreateBuildingTable1626709701941 extends BaseMigration {
    async run(queryRunner: QueryRunner) {
        await this.create('Building', (table) => {
            table.primaryUuid('id');
            table.string('name');
            table.string('location');
            table.string('city');
            table.string('province');
            table.string('countryCode');
            table.string('postalCode');
            table.integer('employeeCount');
            table.jsonb('energies');
            table.decimal('amountCo2');
            table.createdAt();
            table.updatedAt();
            table.deletedAt();
        });
    }

    async rollback(queryRunner: QueryRunner) {
        await this.drop('Building');
    }
}
