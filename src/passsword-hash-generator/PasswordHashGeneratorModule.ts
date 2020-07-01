import {Module} from "@nestjs/common";
import {PasswordHashGeneratorController} from "./PasswordHashGeneratorController";
import {BCryptModule} from "../bcrypt";

@Module({
    controllers: [PasswordHashGeneratorController],
    imports: [BCryptModule]
})
export class PasswordHashGeneratorModule {

}
