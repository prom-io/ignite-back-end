import {Controller, Query, Get} from "@nestjs/common";
import {TransactionsService} from "./TransactionsService";
import {TransactionResponse} from "../model/api/response";

@Controller("api/v3/transactions")
export class TransactionsController {
    constructor(private readonly transactionsService: TransactionsService) {
    }

    @Get()
    public findTransactionsByAddress(@Query("address") address: string): Promise<TransactionResponse[]> {
        return this.transactionsService.getTransactionsByAddress(address);
    }
}
