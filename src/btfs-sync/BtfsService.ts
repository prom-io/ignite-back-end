import {Injectable} from "@nestjs/common";
import {BtfsHashRepository} from "./BtfsHashRepository";
import uuid from "uuid/v4";
import {CreateBtfsCidRequest} from "./types/request";
import {BtfsHash} from "./entities";
import {BtfsHashResponse} from "./types/response";

@Injectable()
export class BtfsService {
    constructor(private readonly btfsHashRepository: BtfsHashRepository) {
    }

    public async createBtfcCid(createBtfsCidRequest: CreateBtfsCidRequest): Promise<void> {
        const btfsHash: BtfsHash = {
            id: uuid(),
            createdAt: new Date(),
            synced: false,
            btfsCid: createBtfsCidRequest.btfsCid,
            peerIp: createBtfsCidRequest.peerIp,
            peerWallet: createBtfsCidRequest.peerWallet
        };
        await this.btfsHashRepository.save(btfsHash);
    }

    public async getAllBtfsCids(): Promise<BtfsHashResponse[]> {
        return (await this.btfsHashRepository.findAll())
            .map(btfsHash => new BtfsHashResponse({
                cid: btfsHash.btfsCid,
                soterLink: `https://sandbox.btfssoter.io/btfs/${btfsHash.btfsCid}`,
                createdAt: btfsHash.createdAt.toISOString(),
                synced: true,
                peerIp: btfsHash.peerIp,
                peerWallet: btfsHash.peerWallet
            }))
    }
}
