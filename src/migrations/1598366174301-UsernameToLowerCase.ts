import {MigrationInterface, QueryRunner} from "typeorm";

export class UsernameToLowerCase1598366174301 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "user" SET username=LOWER(username)`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
