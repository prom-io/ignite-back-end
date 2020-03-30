import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {BtfsController} from "./BtfsController";
import {BtfsService} from "./BtfsService";
import {BtfsHashRepository} from "./BtfsHashRepository";

@Module({
    controllers: [BtfsController],
    providers: [BtfsService],
    imports: [
        TypeOrmModule.forFeature([BtfsHashRepository])
    ]
})
export class BtfsModule {}
