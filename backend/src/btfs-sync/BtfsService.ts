import {Injectable} from "@nestjs/common";
import {BtfsHashRepository} from "./BtfsHashRepository";
import uuid from "uuid/v4";
import {CreateBtfsCidRequest} from "./types/request";
import {BtfsHash} from "./entities";
import {BtfsLibp2pEventsHandler} from "./BtfsLibp2pEventsHandler";

@Injectable()
export class BtfsService {
    constructor(private readonly btfsHashRepository: BtfsHashRepository,
                /*private readonly btfsLibp2pEventsHandler: BtfsLibp2pEventsHandler*/) {
    }

    public async createBtfcCid(createBtfsCidRequest: CreateBtfsCidRequest): Promise<void> {
        const btfsHash: BtfsHash = {
            id: uuid(),
            createdAt: new Date(),
            synced: false,
            btfsCid: createBtfsCidRequest.btfsCid
        };
        await this.btfsHashRepository.save(btfsHash);
        // this.btfsLibp2pEventsHandler.publishNewBtfsCid(createBtfsCidRequest.btfsCid);
    }
}
