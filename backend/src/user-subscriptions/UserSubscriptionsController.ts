import {Body, Controller, Delete, HttpCode, HttpStatus, Param, Post, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {UserSubscriptionsService} from "./UserSubscriptionsService";
import {CreateUserSubscriptionRequest} from "./types/request";
import {UserSubscriptionResponse} from "./types/response";
import {User} from "../users/entities";

@Controller("api/v3/subscriptions")
export class UserSubscriptionsController {
    constructor(private readonly userSubscriptionsService: UserSubscriptionsService) {
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    public createSubscription(@Body() createUserSubscriptionRequest: CreateUserSubscriptionRequest,
                              @Req() request: Request): Promise<UserSubscriptionResponse> {
        return this.userSubscriptionsService.createUserSubscription(
            createUserSubscriptionRequest,
            request.user as User
        )
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":id")
    @HttpCode(HttpStatus.NO_CONTENT)
    public deleteSubscription(@Param("id") id: string,
                              @Req() request: Request): Promise<void> {
        return this.userSubscriptionsService.deleteSubscription(id, request.user as User);
    }
 }
