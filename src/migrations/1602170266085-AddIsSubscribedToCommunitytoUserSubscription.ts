import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddIsSubscribedToCommunitytoUserSubscription1602167652565 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.addColumn("user_subscription", new TableColumn({name: "isSubscribedToCommunity", type: "boolean", default: false}))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropColumn("user_subscription", "isSubscribedToCommunity")
    }
}
