import {Module} from "@nestjs/common";
import {DefaultAccountRepository} from "./DefaultAccountRepository";
import {DefaultAccountProviderService} from "./DefaultAccountProviderService";
import {NedbModule} from "../nedb";

@Module({
    providers: [DefaultAccountProviderService, DefaultAccountRepository],
    exports: [DefaultAccountProviderService],
})
export class DefaultAccountProviderModule {}
