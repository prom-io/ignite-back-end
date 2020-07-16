import {Global, Module} from "@nestjs/common";
import {RequestBodyCurrentUserWritingInterceptor} from "./RequestBodyCurrentUserWritingInterceptor";

@Global()
@Module({
    providers: [RequestBodyCurrentUserWritingInterceptor],
    exports: [RequestBodyCurrentUserWritingInterceptor]
})
export class ValidationModule {

}
