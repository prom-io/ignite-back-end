import { MigrationInterface, QueryRunner } from "typeorm";

export class RewardIndexes1603708359331 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "txnTo_index" ON "rewards" (lower("txnTo"))`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "txnTo_index"`)
    }

}
