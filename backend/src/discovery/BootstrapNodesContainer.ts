import {Injectable, OnModuleInit} from "@nestjs/common";
import {BootstrapNode} from "./types";

// tslint:disable-next-line:no-var-requires
const bootstrapNodes: {bootstrapNodes: BootstrapNode[]} = require("../../bootstrap-nodes.json");

@Injectable()
export class BootstrapNodesContainer {
    private bootstrapNodes: BootstrapNode[] = bootstrapNodes.bootstrapNodes;

    public getBootstrapNodes(): BootstrapNode[] {
        return this.bootstrapNodes;
    }
}
