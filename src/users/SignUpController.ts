import { Body, Controller, Post, Req } from "@nestjs/common";
import { UsersService } from "./UsersService";
import { SignUpRequest } from "./types/request";
import { UserResponse } from "./types/response";
import { LoggerService } from "nest-logger";
import { Request } from "express";

@Controller("api/v1/sign-up")
export class SignUpController {
    constructor(
        private readonly usersService: UsersService,
        private readonly logger: LoggerService,
    ) {}

    @Post()
    public signUp(
        @Body() signUpRequest: SignUpRequest,
        @Req() request: Request,
    ): Promise<UserResponse> {
        this.logger.log(
            `signUp: Ip: ${request.ip}. Recaptcha token is: ${request.headers["x-recaptcha"]}`,
        );
        return this.usersService.signUp(signUpRequest);
    }
}
