import {Controller, Query, Get} from "@nestjs/common";
import {TransactionsService} from "./TransactionsService";
import {TransactionResponse} from "../model/api/response";
import {getValidPage, getValidPageSize} from "../utils/pagination";

@Controller("api/v3/transactions")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {
    }

    @Get()
    public findTransactionsByAddress(@Query("address") address: string,
                                     @Query("page") page?: number,
                                     @Query("size") size?: number): Promise<TransactionResponse[]> {
        page = getValidPage(page, 0, true);
        size = getValidPageSize(size);
        return this.transactionsService.getTransactionsByAddress(address, page, size);
    }
}
