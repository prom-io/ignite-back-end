import {NodeType} from "../NodeType";

export interface RegisteredNodeInstance {
    ipAddress: string,
    port: number,
    type: NodeType
}
