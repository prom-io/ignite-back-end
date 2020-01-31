import {Injectable} from "@nestjs/common";
import {Cron, NestSchedule} from "nest-schedule";
import {LoggerService} from "nest-logger";
import Axios from "axios";
import {RegisteredNodeInstance} from "./types/response";
import {BootstrapNode, NodeType} from "./types";
import {BootstrapNodesContainer} from "./BootstrapNodesContainer";
import {getRandomElement} from "../utils/random-element";

@Injectable()
export class RoundRobinLoadBalancerClient extends NestSchedule {
    private nodeInstances: RegisteredNodeInstance[] = [];
    private selectedNodeIndex = 0;

    constructor(private readonly bootstrapNodesContainer: BootstrapNodesContainer,
                private readonly log: LoggerService) {
        super();
    }

    public getServiceNodeInstance(): RegisteredNodeInstance {
        const serviceNodes = this.nodeInstances.filter(instance => instance.type === NodeType.SERVICE_NODE);

        if (this.selectedNodeIndex < serviceNodes.length) {
            const result: RegisteredNodeInstance = serviceNodes[this.selectedNodeIndex];
            this.selectedNodeIndex += 1;
            return result;
        } else {
            this.selectedNodeIndex = 0;
            return serviceNodes[this.selectedNodeIndex];
        }
    }

    public async getServiceNodesByAddressAndType(address: string, type: NodeType): Promise<RegisteredNodeInstance[]> {
        const nodes = this.nodeInstances
            .filter(node => node.type === type)
            .filter(node => node.addresses.includes(address));

        if (nodes.length !== 0) {
            return nodes;
        } else {
            await this.refreshInstances();
            return this.nodeInstances
                .filter(node => node.type === type)
                .filter(node => node.addresses.includes(address))
        }
    }

    @Cron("*/10 * * * *", {
        immediate: true,
        waiting: true
    })
    public async refreshInstances(): Promise<void> {
        this.log.info("Refreshing list of registered nodes");
        const randomBootstrapNode: BootstrapNode = getRandomElement(this.bootstrapNodesContainer.getBootstrapNodes());
        this.nodeInstances = (await Axios.get(`http://${randomBootstrapNode.ipAddress}:${randomBootstrapNode.port}/api/v1/discovery/nodes`)).data;
    }
}
