import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class transactionsTxnHashUniqueIndex1601648264714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`CREATE UNIQUE INDEX transactions_txnHash ON transactions ("txnHash") WHERE "txnSubj" != 'REWARD'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('transactions','transactions_txnhash');
    }

}
