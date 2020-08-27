import { Controller, Post, UseInterceptors, ClassSerializerInterceptor, Body, Req, UseGuards } from "@nestjs/common";
import {Request} from "express";
import { StatisticsLogService } from "./statistics-log.service";
import { ApiOkResponse } from "@nestjs/swagger";
import { OptionalJwtAuthGuard } from "../jwt-auth/OptionalJwtAuthGuard";

@Controller("/api/v1/statistics-logs")
export class StatisticsLogController {
    constructor(private statisticsLogService: StatisticsLogService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(OptionalJwtAuthGuard)
    @ApiOkResponse()
    @Post()
    public logData(@Body() body: object, @Req() request: Request): void {
        this.statisticsLogService.logData(body, request);
    }
}
