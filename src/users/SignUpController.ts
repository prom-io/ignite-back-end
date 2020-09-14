import {Body, Controller, Post} from "@nestjs/common";
import {UsersService} from "./UsersService";
import {SignUpRequest} from "./types/request";
import {UserResponse} from "./types/response";

@Controller("api/v1/sign-up")
export class SignUpController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    public async signUp(@Body() signUpRequest: SignUpRequest): Promise<UserResponse> {
        return await this.usersService.signUp(signUpRequest);
    }
}
