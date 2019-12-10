import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {AccountsService} from "./AccountsService";
import {DataOwnersService} from "./DataOwnersService";
import {CreateDataOwnerRequest, CreateDataValidatorRequest} from "../model/api/request";
import {AccountResponse, BalanceResponse, BalancesResponse, DataOwnerResponse, DataOwnersOfDataValidatorResponse} from "../model/api/response";

@Controller("api/v3/accounts")
export class AccountsController {
    constructor(private readonly accountsService: AccountsService,
                private readonly dataOwnersService: DataOwnersService) {}

    @Get()
    public getAllAccounts(): Promise<AccountResponse[]> {
        return this.accountsService.getAllAccounts();
    }

    @Post()
    public createDataValidator(@Body() createDataValidatorRequest: CreateDataValidatorRequest): Promise<void> {
        return this.accountsService.createDataValidatorAccount(createDataValidatorRequest);
    }

    @Post("data-owners")
    public createDataOwner(@Body() createDataOwnerRequest: CreateDataOwnerRequest): Promise<DataOwnerResponse> {
        return this.dataOwnersService.createDataOwner(createDataOwnerRequest);
    }

    @Get("data-validators/:address/data-owners")
    public getDataOwnersOfDataValidator(@Param("address") address: string): Promise<DataOwnersOfDataValidatorResponse> {
        return new Promise<DataOwnersOfDataValidatorResponse>(resolve => this.dataOwnersService.findAllDataOwnersByDataValidator(address)
            .then(dataOwners => resolve({dataOwners}))
        );
    }

    @Get(":address/balance")
    public getBalanceOfAccount(@Param("address") address: string): Promise<BalanceResponse> {
        return this.accountsService.getBalanceOfAccount(address);
    }

    @Get("balances")
    public getBalancesOfAllAccounts(): Promise<BalancesResponse> {
        return this.accountsService.getBalancesOfAllAccounts();
    }
}
