import {Module} from "@nestjs/common";
import {SkynetClient} from "./SkynetClient";

@Module({
    providers: [SkynetClient],
    exports: [SkynetClient]
})
export class SkynetModule {
}
