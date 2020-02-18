import {Controller, Post, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";

@Controller("api/v3/auth")
export class AuthController {

    @UseGuards(AuthGuard("local"))
    @Post("login")
    public login(@Req() request: Request) {
        return request.user;
    }
}
