import {MigrationInterface, QueryRunner} from "typeorm";

export class RenameUserStatisticsColumns1597333544316 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameColumn("user_statistics", "balance", "userBalance")
        await queryRunner.renameColumn("user_statistics", "memezatorVoteWeight", "votingPower")
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.renameColumn("user_statistics", "userBalance", "balance")
        await queryRunner.renameColumn("user_statistics", "votingPower", "memezatorVoteWeight")
    }

}
