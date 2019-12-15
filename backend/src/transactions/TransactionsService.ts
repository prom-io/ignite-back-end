import {Injectable} from "@nestjs/common";
import {DataOwnerResponse, ServiceNodeTransactionResponse, TransactionResponse} from "../model/api/response";
import {DataOwnersService} from "../accounts/DataOwnersService";
import {FilesService} from "../files/FilesService";
import {ServiceNodeApiClient} from "../service-node-api";

@Injectable()
export class TransactionsService {
    constructor(private readonly dataOwnersService: DataOwnersService,
                private readonly filesService: FilesService,
                private readonly serviceNodeApiClient: ServiceNodeApiClient) {
    }

    public async getTransactionsByAddress(address: string, page: number, size: number): Promise<TransactionResponse[]> {
        return new Promise<TransactionResponse[]>(async resolve => {
            let transactions: ServiceNodeTransactionResponse[] = (await this.serviceNodeApiClient.getTransactionsOfAddress(
                address,
                page,
                size
            )).data;

            transactions = transactions.filter(transaction => transaction.dataOwner !== "0x5D55d7B86057F1681BC78F1d3A10F300774374d8");

            const result: TransactionResponse[] = [];

            for (const transaction of transactions) {
                const dataOwner: DataOwnerResponse = await this.dataOwnersService.findByAddress(transaction.dataOwner);
                result.push({
                    file: dataOwner.file,
                    hash: transaction.hash,
                    sum: transaction.value,
                    createdAt: transaction.created_at,
                    dataOwner,
                    dataMart: transaction.dataMart,
                    type: transaction.type
                })
            }

            resolve(result);
        })
    }
}
