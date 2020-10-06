import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class Transactions1597919903105 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const transactionsTable = new Table({
            name: "transactions",
            indices: [{ columnNames: ["createdAt", "txnHash", "txnStatus"] }],
            columns: [
                {
                    name: "id",
                    type: "uuid",
                    isPrimary: true,
                },
                {
                    name: "createdAt",
                    type: "timestamptz",
                    isNullable: false,
                },
                {
                    name: "txnHash",
                    type: "varchar",
                    isNullable: true,
                },
                {
                    name: "txnDate",
                    type: "timestamptz",
                    isNullable: true,
                },
                {
                    name: "txnStatus",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "txnFrom",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "txnTo",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "txnSum",
                    type: "numeric",
                    isNullable: false,
                },
                {
                    name: "txnSubj",
                    type: "varchar",
                    isNullable: false,
                },
                {
                    name: "txnDetails",
                    type: "jsonb",
                    isNullable: true,
                },
            ],
        });

        await queryRunner.createTable(transactionsTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("transactions")
    }
}
