import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy} from "passport-jwt";
import {UsersService} from "../users";
import {config} from "../config";
import {UserResponse} from "../users/types/response";
import {User} from "../users/entities";

@Injectable()
export class OptionalJwtStrategy extends PassportStrategy(Strategy, "optionalJwt") {

    constructor(private readonly usersService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.JWT_SECRET,
        });
    }

    public async validate(payload?: UserResponse): Promise<User | null> {
        if (!payload) {
            return null;
        }

        try {
            return await this.usersService.findUserEntityByEthereumAddress(payload.ethereumAddress);
        } catch (error) {
            throw new UnauthorizedException();
        }
    }
}
