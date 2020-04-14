import {Expose} from "class-transformer";

export class BtfsHashResponse {
    cid: string;

    @Expose({name: "soter_link"})
    soterLink: string;

    @Expose({name: "created_at"})
    createdAt: string;

    synced: boolean;

    constructor(plainObject: BtfsHashResponse) {
        Object.assign(this, plainObject);
    }
}
