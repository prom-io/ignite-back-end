import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class statusesFavoritesCount1597314601763 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('status', new TableColumn({type:'int', name: 'favoritesCount', default:0}));
        await queryRunner.query(`
        UPDATE status
	        SET "favoritesCount" = likes_per_status.likes_count
	        FROM (
                SELECT count(id) AS likes_count, status_like."statusId" AS status_id
                FROM status_like 
                WHERE "reverted" = false 
                GROUP BY status_id
                ) AS likes_per_status
	        WHERE status.id = likes_per_status.status_id;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('status', 'favoritesCount');
    }
}
