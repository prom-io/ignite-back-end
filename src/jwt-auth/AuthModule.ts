import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {AuthService} from "./AuthService";
import {LocalStrategy} from "./LocalStrategy";
import {AuthController} from "./AuthController";
import {JwtStrategy} from "./JwtStrategy";
import {UsersModule} from "../users";
import {config} from "../config";
import {OptionalJwtStrategy} from "./OptionalJwtStrategy";
import {OptionalJwtAuthGuard} from "./OptionalJwtAuthGuard";

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, OptionalJwtStrategy, OptionalJwtAuthGuard],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: config.JWT_SECRET,
            signOptions: {
                expiresIn: "3600000000s"
            }
        })
    ]
})
export class AuthModule {
}
