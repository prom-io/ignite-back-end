import { Module } from "@nestjs/common";
import { BscApiService } from "./bsc-api.service";

@Module({
    providers: [BscApiService],
    exports: [BscApiService],
})
export class BscApiModule {}
