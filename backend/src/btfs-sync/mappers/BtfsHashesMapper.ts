import {Injectable} from "@nestjs/common";
import {BtfsHash} from "../entities";
import {BtfsHashResponse} from "../types/response";

@Injectable()
export class BtfsHashesMapper {

    public toBtfsHashResponse(btfsHash: BtfsHash): BtfsHashResponse {
        return new BtfsHashResponse({
            cid: btfsHash.btfsCid,
            soterLink: `https://sandbox.btfssoter.io/btfs/${btfsHash.btfsCid}`,
            createdAt: btfsHash.createdAt.toISOString(),
            synced: btfsHash.synced,
            peerIp: btfsHash.peerIp,
            peerWallet: btfsHash.peerWallet
        })
    }
}
