import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class votingPowerPurchaseTxnsum1602248496718 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('voting_power_purchase', 'tokenQnt');
        await queryRunner.addColumn('voting_power_purchase', new TableColumn({
            name: 'txnSum',
            type: 'numeric',
            isNullable: true
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('voting_power_purchase', 'txnSum');
        await queryRunner.addColumn('voting_power_purchase', new TableColumn({
            name: 'tokenQnt',
            type: 'numeric',
            isNullable: true
        }));
    }

}
