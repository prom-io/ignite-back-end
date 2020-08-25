import {MigrationInterface, QueryRunner} from "typeorm";

export class Usernametolowercase1598342934026 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "user" SET username=LOWER(username)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
