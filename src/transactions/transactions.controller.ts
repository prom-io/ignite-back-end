import { Controller, Get, Query, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req, Body, Post, ParseIntPipe, Param } from "@nestjs/common";
import { GetTransactionsFilters } from "./types/requests/GetTransactionsFilters";
import { TransactionResponse } from "./types/responses/TransactionResponse";
import { TransactionsService } from "./transactions.service";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { User } from "../users/entities";
import { ApiOkResponse } from "@nestjs/swagger";
import { AdminGuard } from "../jwt-auth/AdminGuard";
import { RequiresAdmin } from "../jwt-auth/RequiresAdmin";
import { Transaction } from "./entities/Transaction";
import { TransactionsPerformerCronService } from "./transactions-performer-cron.service";
import { VotingPowerPurchaseCronService } from "../memezator/voting-power-purchase-cron.service";
import { RefreshTransactionsRequest } from "./types/requests/RefreshTransactionsRequest";

@Controller("api/v1")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly transactionsPerformerCron: TransactionsPerformerCronService,
    private readonly transactionsSyncCronService: VotingPowerPurchaseCronService
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(AuthGuard("jwt"))
  @ApiOkResponse({ type: () => TransactionResponse, isArray: true })
  @Get("accounts/current/transactions")
  public getTransactions(
    @Req() request: Request,
    @Query() filters: GetTransactionsFilters
  ): Promise<TransactionResponse[]> {
    return this.transactionsService.getTransactions(request.user as User, filters)
  }

  @Post("perform-transactions-by-ids")
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @RequiresAdmin()
  public performTransactionsByIds(@Body("ids") ids: string[]): Promise<Transaction[]> {
    return this.transactionsService.performTransactionsByIds(ids);
  }

  @Post("perform-not-started-reward-transactions-in-batch-mode")
  @UseGuards(AuthGuard("jwt"), AdminGuard)
  @RequiresAdmin()
  public performNotStartedRewardTransactionsInBatchMode(
    @Body("receiversLimit", new ParseIntPipe()) receiversLimit: number,
  ) {
    return this.transactionsPerformerCron.performNotStartedRewardTransactions({ receiversLimit })
  }

  /*
  @UseGuards(AuthGuard("jwt"))
  @ApiOkResponse({ type: () => TransactionResponse, isArray: true })
  @Get('accounts/current/transactions/sync')
  public refreshTransactions(@Param() param: RefreshTransactionsRequest){
    return this.transactionsService.refreshTransactions(param);
  }
  */
}
