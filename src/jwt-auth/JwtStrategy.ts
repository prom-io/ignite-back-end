import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {UserResponse} from "../users/types/response";
import {UsersService} from "../users";
import {User} from "../users/entities";
import {config} from "../config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: config.JWT_SECRET
        });
    }

    public async validate(payload: UserResponse): Promise<User> {
        try {
            return await this.usersService.findUserEntityByEthereumAddress(payload.id);
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
