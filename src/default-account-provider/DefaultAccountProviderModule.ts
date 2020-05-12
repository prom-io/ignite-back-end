import {Module} from "@nestjs/common";
import {DefaultAccountProviderService} from "./DefaultAccountProviderService";
import {Web3Module} from "../web3";

@Module({
    providers: [DefaultAccountProviderService],
    imports: [Web3Module],
    exports: [DefaultAccountProviderService],
})
export class DefaultAccountProviderModule {}
