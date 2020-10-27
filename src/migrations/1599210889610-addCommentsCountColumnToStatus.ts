import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class addCommentsCountColumnToStatus1599210889610 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.addColumn('status', new TableColumn({type:'int', name: 'commentsCount', default:0}));
        await queryRunner.query(`
        UPDATE status
            SET "commentsCount" = comments_per_status.comments_count
            FROM (
                SELECT count(id) AS comments_count, "referredStatusId"
                FROM status  
                WHERE "referredStatusId" IS NOT NULL AND "statusReferenceType" = 'COMMENT' 
                GROUP BY "referredStatusId"
                ) AS comments_per_status
            WHERE status.id = comments_per_status."referredStatusId"
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
         await queryRunner.dropColumn('status', 'comments_count');
    }

}
