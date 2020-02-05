import {Module, Global} from "@nestjs/common";
import Axios from "axios";
import {ServiceNodeApiClient} from "./ServiceNodeApiClient";
import {DiscoveryModule} from "../discovery";

@Global()
@Module({
    providers: [
        {
            provide: "serviceNodeApiAxios",
            useValue: Axios.create()
        },
        ServiceNodeApiClient
    ],
    imports: [DiscoveryModule],
    exports: [ServiceNodeApiClient]
})
export class ServiceNodeApiClientModule {}
