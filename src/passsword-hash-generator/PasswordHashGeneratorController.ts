import {Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors} from "@nestjs/common";
import {GeneratePasswordHashRequest} from "./types/request";
import {GeneratePasswordHashResponse} from "./types/response";
import {BCryptPasswordEncoder} from "../bcrypt";

@Controller("api/v1/password-hash")
export class PasswordHashGeneratorController {
    constructor(private readonly bCryptPasswordEncoder: BCryptPasswordEncoder) {
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Post()
    public async generatePasswordHash(@Body() generatePasswordHashRequest: GeneratePasswordHashRequest): Promise<GeneratePasswordHashResponse> {
        return new GeneratePasswordHashResponse({
            passwordHash: this.bCryptPasswordEncoder.encode(generatePasswordHashRequest.password, 12)
        })
    };
}
