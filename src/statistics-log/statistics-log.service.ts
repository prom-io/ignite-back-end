import { Injectable } from '@nestjs/common';
import { LoggerService } from 'nest-logger';
import { Request } from 'express';

@Injectable()
export class StatisticsLogService {
    constructor(private logger: LoggerService){}

    async logData(body: Object, request: Request){
        let statistics = {
            ip: JSON.stringify(request.ip),
            user: request.user ? JSON.stringify(request.user['ethereumAddress']) : null,
            data: JSON.stringify(body)
        }
        this.logger.log(JSON.stringify(statistics))
    }
}
