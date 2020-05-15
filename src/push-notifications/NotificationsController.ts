import {Body, ClassSerializerInterceptor, Controller, Get, Put, Req, UseGuards, UseInterceptors} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {NotificationsService} from "./NotificationsService";
import {MarkNotificationsReadRequest} from "./types/request";
import {WebsocketPushNotification} from "./types/response";
import {User} from "../users/entities";

@Controller("api/v1/notifications")
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {
    }

    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public getNotReadNotificationsOfCurrentUser(@Req() request: Request): Promise<Array<WebsocketPushNotification<any>>> {
        return this.notificationsService.getNotReadNotificationsOfCurrentUser(request.user as User);
    }

    @UseGuards(AuthGuard("jwt"))
    @UseInterceptors(ClassSerializerInterceptor)
    @Put("read")
    public markNotificationsAsRead(@Body() markNotificationsReadRequest: MarkNotificationsReadRequest,
                                   @Req() request: Request): Promise<Array<WebsocketPushNotification<any>>> {
        return this.notificationsService.markNotificationsAsRead(
            markNotificationsReadRequest,
            request.user as User
        );
    }
}
