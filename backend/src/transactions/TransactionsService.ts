import {Injectable} from "@nestjs/common";
import {BillingTransactionResponse, TransactionResponse, TransactionType} from "../model/api/response";
import {billingTransactionToTransactionResponse} from "./transaction-mappers";
import {DataOwnersService} from "../accounts/DataOwnersService";
import {FilesService} from "../files/FilesService";

@Injectable()
export class TransactionsService {
    constructor(private readonly dataOwnersService: DataOwnersService,
                private readonly filesService: FilesService) {
    }

    public async getTransactionsByAddress(address: string): Promise<TransactionResponse[]> {
        return new Promise<TransactionResponse[]>(resolve => {
            const transactions: BillingTransactionResponse[] = [
                {
                    value: 5,
                    to: "0x72b5D57248d53440aA33bA9602045ACb65fC254F",
                    status: true,
                    serviceNode: "0xAF597a4ADb86867735fD0222D858A83dC9D66b8C",
                    from: "0xac59139612C240f8493f15BaCC8b6f2c99ec050E",
                    hash: "0xd74227919f096631a4e567595b317fc2b44c889904a9895dd34ae93c8e74f4a9",
                    id: "0b45f144-8e77-44c4-b0e1-a22a5844fc82",
                    type: TransactionType.DATA_SELL,
                    createdAt: "2019-11-9"
                },
                {
                    value: 5,
                    to: "0x72b5D57248d53440aA33bA9602045ACb65fC254F",
                    status: true,
                    serviceNode: "0xAF597a4ADb86867735fD0222D858A83dC9D66b8C",
                    from: "0xac59139612C240f8493f15BaCC8b6f2c99ec050E",
                    hash: "0xd74227919f096631a4e567595b317fc2b44c889904a9895dd34ae93c8e74f4a9",
                    id: "0b45f144-8e77-44c4-b0e1-a22a5844fc82",
                    type: TransactionType.DATA_SELL,
                    createdAt: "2019-11-9"
                },
                {
                    value: 5,
                    to: "0x72b5D57248d53440aA33bA9602045ACb65fC254F",
                    status: true,
                    serviceNode: "0xAF597a4ADb86867735fD0222D858A83dC9D66b8C",
                    from: "0xac59139612C240f8493f15BaCC8b6f2c99ec050E",
                    hash: "0xd74227919f096631a4e567595b317fc2b44c889904a9895dd34ae93c8e74f4a9",
                    id: "0b45f144-8e77-44c4-b0e1-a22a5844fc82",
                    type: TransactionType.DATA_SELL,
                    createdAt: "2019-11-9"
                },
                {
                    value: 5,
                    to: "0x72b5D57248d53440aA33bA9602045ACb65fC254F",
                    status: true,
                    serviceNode: "0xAF597a4ADb86867735fD0222D858A83dC9D66b8C",
                    from: "0xac59139612C240f8493f15BaCC8b6f2c99ec050E",
                    hash: "0xd74227919f096631a4e567595b317fc2b44c889904a9895dd34ae93c8e74f4a9",
                    id: "0b45f144-8e77-44c4-b0e1-a22a5844fc82",
                    type: TransactionType.DATA_SELL,
                    createdAt: "2019-11-9"
                },
                {
                    value: 5,
                    to: "0x72b5D57248d53440aA33bA9602045ACb65fC254F",
                    status: true,
                    serviceNode: "0xAF597a4ADb86867735fD0222D858A83dC9D66b8C",
                    from: "0xac59139612C240f8493f15BaCC8b6f2c99ec050E",
                    hash: "0xd74227919f096631a4e567595b317fc2b44c889904a9895dd34ae93c8e74f4a9",
                    id: "0b45f144-8e77-44c4-b0e1-a22a5844fc82",
                    type: TransactionType.DATA_SELL,
                    createdAt: "2019-11-9"
                },
                {
                    value: 5,
                    to: "0x72b5D57248d53440aA33bA9602045ACb65fC254F",
                    status: true,
                    serviceNode: "0xAF597a4ADb86867735fD0222D858A83dC9D66b8C",
                    from: "0xac59139612C240f8493f15BaCC8b6f2c99ec050E",
                    hash: "0xd74227919f096631a4e567595b317fc2b44c889904a9895dd34ae93c8e74f4a9",
                    id: "0b45f144-8e77-44c4-b0e1-a22a5844fc82",
                    type: TransactionType.DATA_SELL,
                    createdAt: "2019-11-9"
                }
            ];

            Promise.all(transactions.map(async transaction => {
                const dataOwner = (await this.dataOwnersService.findAllDataOwners())
                    // tslint:disable-next-line:no-shadowed-variable
                    .filter(dataOwner => dataOwner.file !== undefined)
                    // tslint:disable-next-line:no-shadowed-variable
                    .filter(dataOwner => dataOwner.file.id === transaction.id)
                    // tslint:disable-next-line:no-shadowed-variable
                    .reduce(dataOwner => dataOwner);
                return billingTransactionToTransactionResponse(transaction, dataOwner.file, dataOwner);
            }))
                // tslint:disable-next-line:no-shadowed-variable
                .then(transactions => resolve(transactions));
        })
    }
}
