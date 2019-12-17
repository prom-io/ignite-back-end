import {Injectable} from "@nestjs/common";
import {DataOwnerResponse, ServiceNodeTransactionResponse, TransactionResponse, TransactionType} from "../model/api/response";
import {DataOwnersService} from "../accounts/DataOwnersService";
import {FilesService} from "../files/FilesService";
import {ServiceNodeApiClient} from "../service-node-api";

@Injectable()
export class TransactionsService {
    constructor(private readonly dataOwnersService: DataOwnersService,
                private readonly filesService: FilesService,
                private readonly serviceNodeApiClient: ServiceNodeApiClient) {
    }

    // tslint:disable-next-line:max-line-length
    public async getTransactionsByAddressAndType(address: string, type: TransactionType, page: number, pageSize: number): Promise<TransactionResponse[]> {
        return new Promise<TransactionResponse[]>(async resolve => {
            const transactions: ServiceNodeTransactionResponse[] = (await this.serviceNodeApiClient.getTransactionsOfAddressByType(
                address,
                type,
                page,
                pageSize
            )).data;

            resolve(this.mapTransactionsAndDataOwners(transactions));
        })
    }

    public async getTransactionsByAddress(address: string, page: number, size: number): Promise<TransactionResponse[]> {
        return new Promise<TransactionResponse[]>(async resolve => {
            const transactions: ServiceNodeTransactionResponse[] = (await this.serviceNodeApiClient.getTransactionsOfAddress(
                address,
                page,
                size
            )).data;

            resolve(this.mapTransactionsAndDataOwners(transactions));
        })
    }

    private async mapTransactionsAndDataOwners(transactions: ServiceNodeTransactionResponse[]): Promise<TransactionResponse[]> {
        const result: TransactionResponse[] = [];

        for (const transaction of transactions) {
            if (await this.dataOwnersService.existsByAddress(transaction.dataOwner)) {
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
        }

        return result;
    }
}
