import {Module} from "@nestjs/common";
import {PassportModule} from "@nestjs/passport";
import {JwtModule} from "@nestjs/jwt";
import {AuthService} from "./AuthService";
import {LocalStrategy} from "./LocalStrategy";
import {AuthController} from "./AuthController";
import {JwtStrategy} from "./JwtStrategy";
import {UsersModule} from "../users";
import {config} from "../config";

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret: config.JWT_SECRET,
            signOptions: {
                expiresIn: "3600s"
            }
        })
    ]
})
export class AuthModule {}
