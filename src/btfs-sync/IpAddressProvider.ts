import {Injectable, OnApplicationBootstrap} from "@nestjs/common";
import {Cron, NestSchedule} from "nest-schedule";
import {getIpAddress, GetIpAddressOptions} from "../utils/ip";

@Injectable()
export class IpAddressProvider extends NestSchedule implements OnApplicationBootstrap {
    private globalIpAddress: string = "";
    private localIpAddress: string = "";

    public async onApplicationBootstrap(): Promise<void> {
        this.localIpAddress = await getIpAddress({useLocalIpAddress: true});
        this.globalIpAddress = await getIpAddress({useLocalIpAddress: false});
    }

    public getLocalIpAddress(): string {
        return this.localIpAddress;
    }

    public getGlobalIpAddress(): string {
        return this.globalIpAddress;
    }

    public getIpAddress(options: GetIpAddressOptions): string {
        if (options.useLocalIpAddress) {
            return this.getLocalIpAddress();
        } else {
            return this.getGlobalIpAddress();
        }
    }

    @Cron("*/10 * * * *")
    public async updateLocalIpAddress(): Promise<void> {
        this.localIpAddress = await getIpAddress({useLocalIpAddress: true});
    }

    @Cron("0 * * * *")
    public async updateGlobalIpAddress(): Promise<void> {
        this.globalIpAddress = await getIpAddress({useLocalIpAddress: false});
    }
}
