import {Controller, Get, Post, Body, Param} from "@nestjs/common";
import {AccountsService} from "./AccountsService";
import {CreateDataOwnerRequest, CreateDataValidatorRequest} from "../model/api/request";
import {BalanceResponse, BalancesResponse, DataOwnersOfDataValidatorResponse} from "../model/api/response";

@Controller("api/v3/accounts")
export class AccountsController {
    constructor(private readonly accountsService: AccountsService) {}

    @Post("data-validators")
    public createDataValidator(@Body() createDataValidatorRequest: CreateDataValidatorRequest): Promise<void> {
        return this.accountsService.createDataValidatorAccount(createDataValidatorRequest);
    }

    @Post("data-owners")
    public createDataOwner(@Body() createDataOwnerRequest: CreateDataOwnerRequest): Promise<DataOwnersOfDataValidatorResponse> {
        return this.accountsService.createDataOwner(createDataOwnerRequest);
    }

    @Get("data-validators/:address/data-owners")
    public getDataOwnersOfDataValidator(@Param("address") address: string): Promise<DataOwnersOfDataValidatorResponse> {
        return this.accountsService.getDataOwnersOfDataValidator(address);
    }

    @Get(":address/balance")
    public getBalanceOfAccount(@Param("address") address: string): Promise<BalanceResponse> {
        return this.accountsService.getBalanceOfAccount(address);
    }

    @Get()
    public getBalancesOfAllAccounts(): Promise<BalancesResponse> {
        return this.accountsService.getBalancesOfAllAccounts();
    }
}
