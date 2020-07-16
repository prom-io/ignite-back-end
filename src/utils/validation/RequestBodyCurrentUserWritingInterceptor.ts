import {CallHandler, ExecutionContext, Injectable, NestInterceptor} from "@nestjs/common";
import {Observable} from "rxjs";
import {Request} from "express";

@Injectable()
export class RequestBodyCurrentUserWritingInterceptor implements NestInterceptor {
    public async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest<Request>();
        request.body.currentUser = request.user;
        return next.handle();
    }
}
