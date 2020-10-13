import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class votingPowerTxnFrom1602505422047 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('voting_power_purchase', new TableColumn({
            name: 'txnFrom',
            type: 'varchar'
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('voting_power_purchase', 'txnFrom');
    }

}
