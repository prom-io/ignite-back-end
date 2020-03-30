import {Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown} from "@nestjs/common";
import {LoggerService} from "nest-logger";
import uuid from "uuid/v4";
import multiaddr from "multiaddr";
import {BtfsHashRepository} from "./BtfsHashRepository";
import {BtfsCidCreated, BtfsEvent, BtfsEventType} from "./types";
import {BtfsHash} from "./entities";
import {config} from "../config";

@Injectable()
export class BtfsLibp2pEventsHandler implements OnApplicationBootstrap, OnApplicationShutdown {
    private libp2pNodeStarted: boolean = false;

    constructor(@Inject("libp2pNode") private readonly libp2pNode: any | null,
                private readonly btfsHashRepository: BtfsHashRepository,
                private readonly log: LoggerService) {
    }

    public async onApplicationBootstrap(): Promise<void> {
        if (this.libp2pNode) {
            this.log.info("Starting libp2p node");
            this.libp2pNode.peerInfo.multiaddrs.add(multiaddr(`/ip4/0.0.0.0/tcp/${config.LIBP2P_NODE_PORT}`));
            await this.libp2pNode.start();
            this.subscribeToNewBtfsCid();
            this.libp2pNodeStarted = true;
        }
    }

    public async onApplicationShutdown(signal?: string): Promise<void> {
        if (this.libp2pNode) {
            this.log.info("Stopping libp2p node");
            await this.libp2pNode.stop();
        }
    }

    public publishNewBtfsCid(btfsCid: string): void {
        const btfsCidCreatedEvent: BtfsEvent<BtfsCidCreated> = {
            type: BtfsEventType.BTFS_CID_CREATED,
            payload: {
                btfsCid
            }
        };
        this.libp2pNode.pubsub.publish(BtfsEventType.BTFS_CID_CREATED, Buffer.from(JSON.stringify(btfsCidCreatedEvent)));
    }

    public subscribeToNewBtfsCid(): void {
        this.libp2pNode.pubsub.subcribe(BtfsEventType.BTFS_CID_CREATED, async (message: any) => {
            const btfsCidCreated: BtfsEvent<BtfsCidCreated> = JSON.parse(message.data.toString());
            const btfsCid = btfsCidCreated.payload.btfsCid;

            if (! await this.btfsHashRepository.existsByBtfsCid(btfsCid)) {
                const btfsHash: BtfsHash = {
                    id: uuid(),
                    btfsCid,
                    synced: false,
                    createdAt: new Date()
                };
                await this.btfsHashRepository.save(btfsHash);
            }
        })
    }
}
