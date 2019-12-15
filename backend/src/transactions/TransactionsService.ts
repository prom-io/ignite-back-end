import {Injectable} from "@nestjs/common";
import {ServiceNodeTransactionResponse, TransactionResponse} from "../model/api/response";
import {serviceNodeTransactionToTransactionResponse} from "./transaction-mappers";
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
            const transactions: ServiceNodeTransactionResponse[] = (await this.serviceNodeApiClient.getTransactionsOfAddress(
                address,
                page,
                size
            )).data;

            Promise.all(transactions.map(async transaction => {
                const dataOwner = (await this.dataOwnersService.findAllDataOwners())
                    // tslint:disable-next-line:no-shadowed-variable
                    .filter(dataOwner => dataOwner.file !== undefined)
                    // tslint:disable-next-line:no-shadowed-variable
                    .filter(dataOwner => dataOwner.file.id === transaction.id)
                    // tslint:disable-next-line:no-shadowed-variable
                    .reduce(dataOwner => dataOwner);
                return serviceNodeTransactionToTransactionResponse(transaction, dataOwner.file, dataOwner);
            }))
                // tslint:disable-next-line:no-shadowed-variable
                .then(transactions => resolve(transactions));
        })
    }
}
