import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class NotStartedRewardsTable1603108269158 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: "rewards",
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
                    name: "txnDetails",
                    type: "jsonb",
                    isNullable: true,
                },
            ],
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("rewards")
    }
}
