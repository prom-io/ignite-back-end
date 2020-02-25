import {ModuleRef} from "@nestjs/core";
import {Injectable, OnApplicationBootstrap, OnModuleInit} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import Axios from "axios";
import {RoundRobinLoadBalancerClient} from "./RoundRobinLoadBalancerClient";
import {RegisterNodeRequest} from "./types/request";
import {NodeType} from "./types";
import {config} from "../config";
import {getIpAddress} from "../utils/ip";
import {AccountsRepository} from "../accounts/AccountsRepository";

@Injectable()
export class SelfRegistrationService implements OnApplicationBootstrap, OnModuleInit {
    private accountsRepository: AccountsRepository;

    constructor(private readonly loadBalancerClient: RoundRobinLoadBalancerClient,
                private readonly log: LoggerService,
                private readonly moduleRef: ModuleRef) {
    }

    public async registerSelf(): Promise<void> {
        const accounts = await this.accountsRepository.findAll();
        await this.loadBalancerClient.refreshInstances();

        if (accounts.length !== 0) {
            this.log.info("Registering itself to bootstrap node");
            const ipAddress = await getIpAddress({
                useLocalIpAddress: config.USE_LOCAL_IP_FOR_REGISTRATION
            });

            const registerNodeRequest: RegisterNodeRequest = {
                ipAddress,
                type: NodeType.DATA_VALIDATOR,
                walletAddresses: accounts.map(account => account.address),
                bootstrap: false,
                port: config.DATA_VALIDATOR_API_PORT
            };

            const serviceNodeInstance = this.loadBalancerClient.getServiceNodeInstance();

            const response = await Axios.post(
                `http://${serviceNodeInstance.ipAddress}:${serviceNodeInstance.port}/api/v1/discovery/nodes`,
                registerNodeRequest
            );

            this.log.info(`Received node is is ${response.data.id}`);
        }
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.registerSelf();
    }

    public onModuleInit(): void {
        this.accountsRepository = this.moduleRef.get(AccountsRepository, {strict: false});
    }
}
