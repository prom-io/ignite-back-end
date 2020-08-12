import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Put,
    Query,
    Req,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {NotificationsService} from "./NotificationsService";
import {MarkNotificationsReadRequest} from "./types/request";
import {WebsocketPushNotification} from "./types/response";
import {User} from "../users/entities";
import { ApiCreatedResponse, ApiOkResponse } from "@nestjs/swagger";
import { CountOfNotRead } from "./types/response/CountOfNotRead";

@Controller("api/v1/notifications")
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {
    }

    @UseGuards(AuthGuard("jwt"))
    @ApiCreatedResponse({description:'Возвращает все уведомления текущего пользователя.'})
    @UseInterceptors(ClassSerializerInterceptor)
    @Get()
    public getAllNotificationsOfCurrentUser(@Req() request: Request,
                                            @Query("since_id") sinceId?: string,
                                            @Query("max_id") maxId?: string): Promise<Array<WebsocketPushNotification<any>>> {
        return this.notificationsService.getAllNotificationsOfCurrentUser(request.user as User, {sinceId, maxId});
    }

    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({description:'Возвращает все непрочитанные уведомления текущего пользователя'})
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("not-read")
    public getNotReadNotificationsOfCurrentUser(@Req() request: Request,
                                                @Query("since_id") sinceId?: string,
                                                @Query("max_id") maxId?: string): Promise<Array<WebsocketPushNotification<any>>> {
        return this.notificationsService.getNotReadNotificationsOfCurrentUser(request.user as User, {sinceId, maxId});
    }

    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({type: () => CountOfNotRead, description:'Возвращает количество непрочитанных уведомлений текущего пользователя'})
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("not-read-count")
    public getCountOfNotReadNotificationsOfCurrentUser(@Req() request: Request): Promise<CountOfNotRead>{
        return this.notificationsService.getCountOfNotReadNotificationsOfCurrentUser(request.user as User);
    }

    @UseGuards(AuthGuard("jwt"))
    @ApiOkResponse({description:'Принимает массив id непрочитанных уведомлений и ставит read = true'})
    @UseInterceptors(ClassSerializerInterceptor)
    @Put("read")
    public markNotificationsAsRead(@Body() markNotificationsReadRequest: MarkNotificationsReadRequest, 
                                    @Req() request: Request): Promise<Array<WebsocketPushNotification<any>>> {
        return this.notificationsService.markNotificationsAsRead(
            request.user as User,
            markNotificationsReadRequest
        );
    }
}
