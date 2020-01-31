import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {AccountsRepository} from "./AccountsRepository";
import {accountToAccountResponse} from "./account-mappers";
import {AccountResponse, BalanceResponse, BalancesResponse, DataOwnersOfDataValidatorResponse} from "./types/response";
import {CreateDataValidatorRequest, ICreateDataOwnerRequest} from "./types/request";
import {ServiceNodeApiClient} from "../service-node-api";
import {AccountType, EntityType} from "../model/entity";

@Injectable()
export class AccountsService {
    constructor(private readonly accountsRepository: AccountsRepository,
                private readonly serviceNodeClient: ServiceNodeApiClient) {

    }

    public async createDataValidatorAccount(createDataValidatorAccountRequest: CreateDataValidatorRequest): Promise<void> {
        try {
            await this.serviceNodeClient.registerAccount({
                address: createDataValidatorAccountRequest.address,
                type: AccountType.DATA_VALIDATOR
            });
            await this.accountsRepository.save({
                address: createDataValidatorAccountRequest.address,
                privateKey: createDataValidatorAccountRequest.privateKey,
                _type: EntityType.ACCOUNT
            });
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    throw new HttpException(
                        `Account with address ${createDataValidatorAccountRequest.address} has already been registered`,
                        HttpStatus.BAD_REQUEST
                    )
                }
                // tslint:disable-next-line:max-line-length
                throw new HttpException(`Error occurred when tried to create data validator. Service node responded with ${error.status} status`, HttpStatus.INTERNAL_SERVER_ERROR);
            } else {
                throw new HttpException("Service node is unreachable", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async getAllAccounts(): Promise<AccountResponse[]> {
        return (await this.accountsRepository.findAll()).map(account => accountToAccountResponse(account));
    }

    public async createDataOwner(createDataOwnerRequest: ICreateDataOwnerRequest): Promise<DataOwnersOfDataValidatorResponse> {
        try {
            return (await this.serviceNodeClient.registerDataOwner(createDataOwnerRequest)).data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `Could not create data owner, service node responded with ${error.response.status} status`,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException("Service node is unreachable", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async getBalanceOfAccount(address: string): Promise<BalanceResponse> {
        try {
            return (await this.serviceNodeClient.getBalanceOfAccount(address)).data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `Could not get balance of account, service node responded with ${error.response.status} status`,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException("Service node is unreachable", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async getDataOwnersOfDataValidator(dataValidatorAddress: string): Promise<DataOwnersOfDataValidatorResponse> {
        try {
            return (await this.serviceNodeClient.getDataOwnersOfDataValidator(dataValidatorAddress)).data;
        } catch (error) {
            if (error.response) {
                throw new HttpException(
                    `Could not get data owners of data validator, service node responded with ${error.response.status} status`,
                    HttpStatus.INTERNAL_SERVER_ERROR
                )
            } else {
                throw new HttpException("Service node is unreachable", HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    public async getBalancesOfAllAccounts(): Promise<BalancesResponse> {
        return this.accountsRepository.findAll().then(accounts => {
            const result: {[address: string]: number} = {};
            return Promise.all(accounts.map(async account => ({
                address: account.address,
                balance: (await this.getBalanceOfAccount(account.address)).balance
            })))
                .then(balances => {
                    balances.forEach(balance => result[balance.address] = balance.balance);
                    return result;
                })
        })
    }
}
