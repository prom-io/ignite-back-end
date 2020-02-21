import {ClassSerializerInterceptor, Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {UsersService} from "./UsersService";
import {User} from "./entities";
import {UserResponse} from "./types/response";
import {StatusesService} from "../statuses";
import {StatusResponse} from "../statuses/types/response";
import {PaginationRequest} from "../utils/pagination";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";
import {UserSubscriptionsService} from "../user-subscriptions";
import {RelationshipsResponse, UserSubscriptionResponse} from "../user-subscriptions/types/response";

@Controller("api/v1/accounts")
export class UsersController {
    constructor(private readonly usersService: UsersService,
                private readonly statusesService: StatusesService,
                private readonly userSubscriptionsService: UserSubscriptionsService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Get("relationships")
    public getRelationships(@Query("id") ids: string[],
                            @Req() request: Request): Promise<RelationshipsResponse[]> {
        return this.userSubscriptionsService.getUserRelationships(ids, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":address")
    public findByAddress(@Param("address") address: string): Promise<UserResponse> {
        return this.usersService.findUserByEthereumAddress(address);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("current/statuses")
    public findStatusesOfCurrentUser(@Query() paginationRequest: PaginationRequest,
                                     @Req() request: Request): Promise<StatusResponse[]> {
        return this.statusesService.findStatusesByUser((request.user as User).ethereumAddress, paginationRequest);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(":address/statuses")
    public findStatusesOfUser(@Param("address") address: string,
                              @Query() paginationRequest: PaginationRequest,
                              @Req() request: Request): Promise<StatusResponse[]> {
        return this.statusesService.findStatusesByUser(address, paginationRequest, request.user as User | null);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("current/subscriptions")
    public getSubscriptionsOfCurrentUser(@Query() paginationRequest: PaginationRequest,
                                         @Req() request: Request): Promise<UserSubscriptionResponse[]> {
        return this.userSubscriptionsService.getSubscriptionsOfCurrentUser(request.user as User, paginationRequest);
    }

    @Get(":address/subscriptions")
    public getSubscriptionsOfUser(@Param("address") address: string,
                                  @Query() paginationRequest: PaginationRequest): Promise<UserSubscriptionResponse[]> {
        return this.userSubscriptionsService.getSubscriptionsByUser(address, paginationRequest);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("current/profile")
    public getCurrentUserProfile(@Req() request: Request): Promise<UserResponse> {
        return this.usersService.getCurrentUserProfile(request.user as User);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @Get(":address/profile")
    public getUserProfile(@Param("address") address: string,
                          @Req() request: Request): Promise<UserResponse> {
        return this.usersService.getUserProfile(address, request.user as User | null);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Post(":address/follow")
    public followUser(@Param("address") address: string,
                      @Req() request: Request): Promise<RelationshipsResponse> {
        return this.userSubscriptionsService.followUser(address, request.user as User)
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Post(":address/unfollow")
    public unfollowUser(@Param("address") address: string,
                        @Req() request: Request): Promise<RelationshipsResponse> {
        return this.userSubscriptionsService.unfollowUser(address, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":address/followers")
    public getFollowersOfUser(@Param("address") address: string): Promise<UserResponse[]> {
        return this.userSubscriptionsService.getFollowersOfUser(address);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":address/following")
    public getFollowingOfUser(@Param("address") address: string): Promise<UserResponse[]> {
        return this.userSubscriptionsService.getFollowingOfUser(address);
    }
}
