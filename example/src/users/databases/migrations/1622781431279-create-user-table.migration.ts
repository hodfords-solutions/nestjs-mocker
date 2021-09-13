import { QueryRunner } from 'typeorm';
import { BaseMigration } from '@diginexhk/typeorm-helper';

export class CreateUserTable1622781431279 extends BaseMigration {
    async run(queryRunner: QueryRunner) {
        await this.create('User', (table) => {
            table.primaryUuid('id');
            table.string('email');
            table.string('firstName').nullable();
            table.string('lastName').nullable();
            table.createdAt();
            table.updatedAt();
            table.deletedAt();
        });
    }

    async rollback() {
        await this.drop('User');
    }
}
