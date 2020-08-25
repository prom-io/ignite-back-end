import { Injectable } from '@nestjs/common';
import { LoggerService } from 'nest-logger';
import { Request } from 'express';

@Injectable()
export class StatisticsLogService {
    constructor(private logger: LoggerService){}

    async logData(body: Object, request: Request){
        this.logger.log(`User ip address is ${JSON.stringify(request.ip)}`)
        if (request.user){
            this.logger.log(JSON.stringify(`User data: ${JSON.stringify(request.user)}`))
        }
        this.logger.log(JSON.stringify(body))
    }
}
