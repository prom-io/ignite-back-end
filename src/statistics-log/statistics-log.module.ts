import { Module } from '@nestjs/common';
import { StatisticsLogController } from './statistics-log.controller';
import { StatisticsLogService } from './statistics-log.service';

@Module({
  controllers: [StatisticsLogController],
  providers: [StatisticsLogService]
})
export class StatisticsLogModule {}
