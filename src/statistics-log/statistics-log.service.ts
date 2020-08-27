import { Injectable } from "@nestjs/common";
import { LoggerService } from "nest-logger";
import { Request } from "express";
import { User } from "../users/entities";

@Injectable()
export class StatisticsLogService {
    constructor(private logger: LoggerService) {}

    logData(body: object, request: Request): void {
        const statistics = {
            ip: request.ip,
            user: request.user ? (request.user as User).ethereumAddress : null,
            data: body,
        }
        this.logger.log(JSON.stringify(statistics))
    }
}
