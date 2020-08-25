import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class MemezatorContestResults1597875035178
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<any> {
        const memezatorContestResultsTable = new Table({
            name: "memezator_contest_results",
            indices: [{ columnNames: ["createdAt"] }],
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
                    name: "updatedAt",
                    type: "timestamptz",
                    isNullable: true,
                },
                {
                    name: "result",
                    type: "jsonb",
                    isNullable: true,
                },
            ],
        });

        await queryRunner.createTable(memezatorContestResultsTable);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable("memezator_contest_results")
    }
}
