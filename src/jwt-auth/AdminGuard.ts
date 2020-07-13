import {CanActivate, ExecutionContext, Injectable} from "@nestjs/common";
import {Reflector} from "@nestjs/core";
import {Request} from "express";
import {User} from "../users/entities";
import {isAdmin} from "../utils/is-admin";

@Injectable()
export class AdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {
    }

    public canActivate(context: ExecutionContext): boolean {
        const requiresAdmin = this.reflector.get<boolean>("requiresAdmin", context.getHandler());

        const request = context.switchToHttp().getRequest<Request>();
        const user = request.user as User | null;

        return requiresAdmin && isAdmin(user);
    }

}
