import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    Param,
    Post,
    Req,
    UseGuards,
    UseInterceptors
} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {Request} from "express";
import {SignUpReferencesService} from "./SignUpReferencesService";
import {CreateSignUpReferenceRequest} from "./types/request";
import {SignUpReferenceResponse, UserResponse} from "./types/response";
import {User} from "./entities";
import {AdminGuard} from "../jwt-auth/AdminGuard";
import {RequiresAdmin} from "../jwt-auth/RequiresAdmin";

@Controller("api/v1/sign-up-reference")
export class SignUpReferencesController {
    constructor(private readonly signUpReferencesService: SignUpReferencesService) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"), AdminGuard)
    @RequiresAdmin()
    @Post()
    public createSignUpReference(@Body() createSignUpReferenceRequest: CreateSignUpReferenceRequest,
                                 @Req() request: Request): Promise<SignUpReferenceResponse> {
        return this.signUpReferencesService.createSignUpReference(createSignUpReferenceRequest, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"), AdminGuard)
    @RequiresAdmin()
    @Get()
    public findAllSignUpReferences(@Req() request: Request): Promise<SignUpReferenceResponse[]> {
        return this.signUpReferencesService.findAllSignUpReferences(request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"), AdminGuard)
    @RequiresAdmin()
    @Get(":id/users")
    public findUsersBySignUpReference(@Param("id") id: string, @Req() request: Request): Promise<UserResponse[]> {
        return this.signUpReferencesService.findUsersBySignUpReference(id, request.user as User);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @UseGuards(AuthGuard("jwt"), AdminGuard)
    @RequiresAdmin()
    @Get(":id")
    public findSignUpReferenceById(@Param("id") id: string, @Req() request: Request): Promise<SignUpReferenceResponse> {
        return this.signUpReferencesService.findSignUpReferenceById(id, request.user as User);
    }
}
