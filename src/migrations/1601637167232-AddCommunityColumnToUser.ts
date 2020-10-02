import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddCommunityColumnToUser1601637167232 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.addColumn("user", new TableColumn({type: 'boolean', name: "isCommunity", default: false}))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropColumn("user", "isCommunity")
    }

}
