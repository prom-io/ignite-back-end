import {Controller, Post, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {AuthService} from "./AuthService";
import {User} from "../users/entities";

@Controller("api/v3/auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @UseGuards(AuthGuard("local"))
    @Post("login")
    public login(@Req() request: Request) {
        return this.authService.login(request.user as User);
    }
}
