import {Controller, Get, Param} from "@nestjs/common";
import {UsersService} from "./UsersService";
import {UserResponse} from "./types/response";

@Controller()
export class UserByAddressController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get("api/v1/account_by_username/:address")
    public getUserByAddress(@Param("address") address: string): Promise<UserResponse> {
        return this.usersService.getUserProfile(address);
    }
}
