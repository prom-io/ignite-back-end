import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddWinnersByLikesColumnToMemezator1600699931450 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('memezator_contest_results', new TableColumn({type: "jsonb", isArray: true, default: [], name: 'winnersByLikes'}))
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropColumn('memezator_contest_results', 'winnersByLikes');
    }
}
