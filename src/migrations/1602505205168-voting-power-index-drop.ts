import {MigrationInterface, QueryRunner} from "typeorm";

export class votingPowerIndexDrop1602505205168 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('transactions','transactions_txnhash');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX transactions_txnHash ON transactions ("txnHash") WHERE "txnSubj" != 'REWARD'`);
    }

}
