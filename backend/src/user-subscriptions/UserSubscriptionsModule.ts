import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserSubscriptionsRepository} from "./UserSubscriptionsRepository";

@Module({
    imports: [
        TypeOrmModule.forFeature([UserSubscriptionsRepository])
    ]
})
export class UserSubscriptionsModule {}
