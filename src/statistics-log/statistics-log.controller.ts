import { Controller, Post, UseInterceptors, ClassSerializerInterceptor, Body, Req, UseGuards } from "@nestjs/common";
import {Request} from "express";
import { StatisticsLogService } from "./statistics-log.service";
import { ApiOkResponse } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";

@Controller("statistics-log")
export class StatisticsLogController {
    constructor(private statisticsLogService: StatisticsLogService) {}

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("optionalJwt"))
    @ApiOkResponse()
    @Post()
    public logData(@Body() body: object, @Req() request: Request): void {
        this.statisticsLogService.logData(body, request);
    }
}
