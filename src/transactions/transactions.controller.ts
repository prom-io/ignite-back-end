import { Controller, Get, Query, UseInterceptors, ClassSerializerInterceptor, UseGuards, Req, Body, Post } from "@nestjs/common";
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

@Controller("api/v1")
export class TransactionsController {
  constructor(
    private readonly transactionsService: TransactionsService
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
}
