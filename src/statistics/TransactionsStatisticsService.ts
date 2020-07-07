import {Injectable, Inject} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import {TransactionsCountResponse} from "./types/response";

@Injectable()
export class TransactionsStatisticsService {
    constructor(@Inject("transactionsStatisticsServiceAxiosInstance") private readonly axios: AxiosInstance) {
    }

    public getBinanceChainTransactionsCount(): AxiosPromise<TransactionsCountResponse> {
        return this.axios.get("/api/v1/binance-smart-chain-test-network/cid-chain/tx-count");
    }

    public getBtfsChunksCount(): AxiosPromise<TransactionsCountResponse> {
        return this.axios.get("/api/v1/plasma-network/cid-block/tx-count");
    }
}
