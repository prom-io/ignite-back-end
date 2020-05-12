import {Module, Global} from "@nestjs/common";
import {BCryptPasswordEncoder} from "./BCryptPasswordEncoder";

@Global()
@Module({
    providers: [BCryptPasswordEncoder],
    exports: [BCryptPasswordEncoder]
})
export class BCryptModule {}
