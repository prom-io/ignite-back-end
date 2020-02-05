import {NodeType} from "../NodeType";

export interface RegisteredNodeInstance {
    ipAddress: string,
    port: number,
    type: NodeType,
    bootstrap: boolean,
    addresses: string[]
}
