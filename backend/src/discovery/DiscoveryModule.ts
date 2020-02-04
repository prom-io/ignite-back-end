import {Module} from "@nestjs/common";
import {ScheduleModule} from "nest-schedule";
import {BootstrapNodesContainer} from "./BootstrapNodesContainer";
import {RoundRobinLoadBalancerClient} from "./RoundRobinLoadBalancerClient";
import {SelfRegistrationService} from "./SelfRegistrationService";

@Module({
    providers: [BootstrapNodesContainer, RoundRobinLoadBalancerClient, SelfRegistrationService],
    imports: [ScheduleModule.register()],
    exports: [RoundRobinLoadBalancerClient]
})
export class DiscoveryModule {}
