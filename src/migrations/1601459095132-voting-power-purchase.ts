import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class votingPowerPurchase1601459095132 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({name: 'voting_power_purchase',
        foreignKeys:[
            {   
                name: "FK_voting_power_purchase_user_id",
                columnNames: ['userId'],
                referencedTableName: 'user',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            },
            {
                name: "FK_voting_power_purchase_txnId",
                columnNames:['txnId'],
                referencedTableName: 'transactions',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            },
        ],
        columns: [
            {
                name: "id",
                type: "uuid",
                isPrimary: true, 
            },
            {
                name: 'createdAt',
                type: 'timestamp without time zone',
                isNullable: false,
                default: 'NOW()',
            },
            {
                name: "userId",
                type: "varchar",
                isNullable: false
            },
            {
                name: "txnId",
                type: "uuid",
                isNullable: false
            },
            {
                name: "txnHash",
                type: "varchar",
                isNullable: false
            },
            {
                name: "txnDate",
                type: "timestamptz",
                isNullable: false,
            },
            {
                name: "tokenQnt",
                type: "numeric"
            },
            {
                name: "votingPower",
                type: "float"
            }

        ]}))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("voting_power_purchase");
    }

}
