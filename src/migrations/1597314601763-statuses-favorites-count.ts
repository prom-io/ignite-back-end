import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class statusesFavoritesCount1597314601763 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('status', new TableColumn({type:'int', name: 'favoritesCount', default:0}));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('status', 'favoritesCount');
    }
}
