import {ClassSerializerInterceptor, Controller, Get, Param, Req, UseGuards, UseInterceptors} from "@nestjs/common";
import {Request} from "express";
import {UsersService} from "./UsersService";
import {UserResponse} from "./types/response";
import {OptionalJwtAuthGuard} from "../jwt-auth/OptionalJwtAuthGuard";
import {User} from "./entities";

@Controller()
export class UserByAddressController {
    constructor(private readonly usersService: UsersService) {
    }

    @UseGuards(OptionalJwtAuthGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    @Get("api/v1/account_by_username/:address")
    public getUserByAddress(@Param("address") address: string,
                            @Req() request: Request): Promise<UserResponse> {
        return this.usersService.getUserProfile(address, request.user as User | null);
    }
}
