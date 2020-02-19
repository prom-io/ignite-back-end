import {Controller, Get, Param, Query, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {UsersService} from "./UsersService";
import {User} from "./entities";
import {UserResponse} from "./types/response";
import {StatusesService} from "../status/StatusesService";
import {StatusResponse} from "../status/types/response";
import {PaginationRequest} from "../utils/pagination";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";

@Controller("api/v3/users")
export class UsersController {
    constructor(private readonly usersService: UsersService,
                private readonly statusesService: StatusesService) {
    }

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
                              @Req() request: Request) {
        return this.statusesService.findStatusesByUser(address, paginationRequest, request.user as User | null);
    }
}
