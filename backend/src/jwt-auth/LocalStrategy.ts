import {Injectable, UnauthorizedException} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy} from "passport-local";
import {AuthService} from "./AuthService";
import {User} from "../users/entities";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, "local") {
    constructor(private readonly authService: AuthService) {
        super();
    }

    public async validate(username: string, password: string): Promise<User> {
        const user = await this.authService.validateUser(username, password);
        console.log(user);

        if (user === null) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
