import {Expose} from "class-transformer";

export class BtfsHashResponse {
    cid: string;

    @Expose({name: "soter_link"})
    soterLink: string;

    @Expose({name: "created_at"})
    createdAt: string;

    synced: boolean;

    @Expose({name: "peer_ip"})
    peerIp?: string;

    @Expose({name: "peer_wallet"})
    peerWallet?: string;

    constructor(plainObject: BtfsHashResponse) {
        Object.assign(this, plainObject);
    }
}
