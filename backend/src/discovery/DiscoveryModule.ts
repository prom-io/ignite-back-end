import {Module} from "@nestjs/common";
import {ScheduleModule} from "nest-schedule";
import {BootstrapNodesContainer} from "./BootstrapNodesContainer";
import {RoundRobinLoadBalancerClient} from "./RoundRobinLoadBalancerClient";

@Module({
    providers: [BootstrapNodesContainer, RoundRobinLoadBalancerClient],
    imports: [ScheduleModule.register()],
    exports: [RoundRobinLoadBalancerClient]
})
export class DiscoveryModule {}
