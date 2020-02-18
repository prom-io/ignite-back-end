import {Body, Controller, Get, Param, Post, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {StatusesService} from "./StatusesService";
import {CreateStatusRequest} from "./types/request";
import {StatusResponse} from "./types/response";
import {User} from "../users/entities";

@Controller("api/v3/statuses")
export class StatusesController {
    constructor(private readonly statusesService: StatusesService) {
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    public createStatus(@Body() createStatusRequest: CreateStatusRequest,
                        @Req() request: Request): Promise<StatusResponse> {
        return this.statusesService.createStatus(createStatusRequest, request.user as User)
    }

    @Get(":id")
    public findStatusById(@Param("id") id: string): Promise<StatusResponse> {
        return this.statusesService.findStatusById(id);
    }
}
