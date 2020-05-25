import {Body, Controller, Post} from "@nestjs/common";
import {UsersService} from "./UsersService";
import {SignUpRequest} from "./types/request";

@Controller("api/v1/sign-up")
export class SignUpController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    public signUp(@Body() signUpRequest: SignUpRequest): Promise<void> {
        return this.usersService.signUp(signUpRequest);
    }
}
