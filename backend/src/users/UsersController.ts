import {Controller, Get, Param} from "@nestjs/common";
import {UsersService} from "./UsersService";
import {UserResponse} from "./types/response";

@Controller("api/v3/users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {
    }

    @Get(":address")
    public findByAddress(@Param("address") address: string): Promise<UserResponse> {
        return this.usersService.findUserByEthereumAddress(address);
    }
}
