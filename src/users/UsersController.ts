import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {UsersService} from "./UsersService";
import {User} from "./entities";
import {
    CreateUserRequest,
    SignUpForPrivateBetaTestRequest,
    UpdatePreferencesRequest,
    UpdateUserRequest,
    UsernameAvailabilityResponse
} from "./types/request";
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

    @Post("private-beta")
    public async signUpForPrivateBeta(@Body() signUpForPrivateBetaTestRequest: SignUpForPrivateBetaTestRequest) {
        await this.usersService.signUpForPrivateBeta(signUpForPrivateBetaTestRequest);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post()
    public async createUser(@Body() createUserRequest: CreateUserRequest): Promise<void> {
        await this.usersService.saveUser(createUserRequest);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put("preferences")
    public async updatePreferences(@Body() updatePreferencesRequest: UpdatePreferencesRequest,
                                   @Req() request: Request): Promise<UpdatePreferencesRequest> {
        return this.usersService.updateUserPreferences(updatePreferencesRequest, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Get("relationships")
    public getRelationships(@Query("id") ids: string[],
                            @Req() request: Request): Promise<RelationshipsResponse[]> {
        return this.userSubscriptionsService.getUserRelationships(ids, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Get("current")
    public getCurrentUser(@Req() request: Request): Promise<UserResponse> {
        return this.usersService.getCurrentUser(request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Get("follow-recommendations")
    public getFollowRecommendations(@Query() paginationRequest: PaginationRequest,
                                    @Req() request: Request): Promise<UserResponse[]> {
        return this.usersService.getFollowRecommendations(paginationRequest, request.user as User);
    }

    @UseGuards(OptionalJwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get(":address")
    public findByAddress(@Param("address") address: string,
                         @Req() request: Request): Promise<UserResponse> {
        return this.usersService.findUserByEthereumAddress(address, request.user as User | null);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Put(":address")
    public updateUser(@Param("address") address: string,
                      @Body() updateUserRequest: UpdateUserRequest,
                      @Req() request: Request): Promise<UserResponse> {
        return this.usersService.updateUser(address, updateUserRequest, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(OptionalJwtAuthGuard)
    @Get(":address/statuses")
    public findStatusesOfUser(@Param("address") address: string,
                              @Req() request: Request,
                              @Query("since_id") sinceId?: string,
                              @Query("max_id") maxId?: string): Promise<StatusResponse[]> {
        return this.statusesService.findStatusesByUser(address, {sinceId, maxId}, request.user as User | null);
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
                      @Req() request: Request): Promise<UserResponse> {
        return this.userSubscriptionsService.followUser(address, request.user as User)
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"))
    @Post(":address/unfollow")
    public unfollowUser(@Param("address") address: string,
                        @Req() request: Request): Promise<UserResponse> {
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

    @Get("username/:username/is-available")
    public checkUsernameAvailability(@Param("username") username: string): Promise<UsernameAvailabilityResponse> {
        return this.usersService.isUsernameAvailable(username);
    }
}
