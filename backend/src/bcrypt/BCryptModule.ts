import {Module, Global} from "@nestjs/common";
import {BCryptPasswordEncoder} from "./BCryptPasswordEncoder";

@Module({
    providers: [BCryptPasswordEncoder],
    exports: [BCryptPasswordEncoder]
})
export class BCryptModule {}
