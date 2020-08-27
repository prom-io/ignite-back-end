import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class TransactionIndexes1598536944558 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createIndices(
            "transactions",
            [
                new TableIndex({
                    columnNames: ["txnFrom"]

                }),
                new TableIndex({
                    columnNames: ["txnTo"]
                }),
            ]
        )
    }
    
    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropIndex("transactions", "txnFrom")
        await queryRunner.dropIndex("transactions", "txnTo")
    }
}
