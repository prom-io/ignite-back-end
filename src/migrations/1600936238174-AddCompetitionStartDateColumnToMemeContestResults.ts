import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddCompetitionStartDateColumnToMemeContestResults1600936238174 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('memezator_contest_results', new TableColumn({type: "timestamptz", isNullable: true, name: 'competitionStartDate'}))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('memezator_contest_results', 'competitionStartDate');
    }
}
