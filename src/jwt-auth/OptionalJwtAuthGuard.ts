import {Injectable, UnauthorizedException} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("optionalJwt") {

    handleRequest(err, user, info) {
        if (info && info.name === "TokenExpiredError") {
            throw new UnauthorizedException("JWT expired");
        }

        return user;
    }

}
