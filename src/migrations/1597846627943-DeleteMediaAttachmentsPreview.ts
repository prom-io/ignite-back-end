import {MigrationInterface, QueryRunner} from "typeorm";

/**
 * Delete existing previews, cuz preview generation logic has been changed
 */
export class DeleteMediaAttachmentsPreview1597846627943 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            DELETE FROM media_attachment
            WHERE "originalId" IS NOT NULL;
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        // do nothing
    }

}
