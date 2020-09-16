import {Body, Controller, Post} from "@nestjs/common";
import {UsersService} from "./UsersService";
import {SignUpRequest} from "./types/request";
import {UserResponse} from "./types/response";
import { Recaptcha } from "@nestlab/google-recaptcha";

@Controller("api/v1/sign-up")
export class SignUpController {
    constructor(private readonly usersService: UsersService) {
    }

    @Post()
    @Recaptcha()
    public signUp(@Body() signUpRequest: SignUpRequest): Promise<UserResponse> {
        return this.usersService.signUp(signUpRequest);
    }
}
