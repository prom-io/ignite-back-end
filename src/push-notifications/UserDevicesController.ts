import {Body, ClassSerializerInterceptor, Controller, Post, Req, UseGuards, UseInterceptors} from "@nestjs/common";
import {UserDevicesService} from "./UserDevicesService";
import {CreateUserDeviceRequest} from "./types/request";
import {Request} from "express";
import {User} from "../users/entities";
import {AuthGuard} from "@nestjs/passport";

@Controller("api/v1/user-devices")
export class UserDevicesController {
    constructor(private readonly userDevicesService: UserDevicesService) {
    }

    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    public async createUserDevice(@Body() createUserDeviceRequest: CreateUserDeviceRequest,
                                  @Req() request: Request): Promise<void> {
        await this.userDevicesService.createUserDevice(createUserDeviceRequest, request.user as User);
    }
}
