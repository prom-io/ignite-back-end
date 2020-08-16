import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddUsersBalanceAndMemezatorVoteWeight1597329501690 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumns("user_statistics",  [
            new TableColumn({
                name: "balance",
                type: "numeric",
                default: "0"
            }),
            new TableColumn({
                name: "memezatorVoteWeight",
                type: "integer",
                default: 1
            })
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn("user_statistics", "balance")
        await queryRunner.dropColumn("user_statistics", "memezatorVoteWeight")
    }

}
