import {Controller, Get, Query} from "@nestjs/common";
import {TransactionsService} from "./TransactionsService";
import {TransactionResponse, TransactionType} from "../model/api/response";
import {getValidPage, getValidPageSize} from "../utils/pagination";

@Controller("api/v3/transactions")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {
    }

    @Get()
    public findTransactionsByAddress(@Query("address") address: string,
                                     @Query("page") page?: number,
                                     @Query("size") size?: number,
                                     @Query("type") type?: string): Promise<TransactionResponse[]> {
        page = getValidPage(page, 0, true);
        size = getValidPageSize(size);

        if (type) {
            const transactionType: TransactionType = type === "dataUpload" ? TransactionType.DATA_UPLOAD : TransactionType.DATA_PURCHASE;
            return this.transactionsService.getTransactionsByAddressAndType(address, transactionType, page, size);
        } else {
            return this.transactionsService.getTransactionsByAddress(address, page, size);
        }
    }
}
