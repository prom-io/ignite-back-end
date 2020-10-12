import { Injectable, Inject } from "@nestjs/common";
import { AxiosInstance } from "axios";
import { config } from "../config";
import { IGNITE_TOKEN_EXCHANGE_API_AXIOS } from "./constants";
import { BalanceResponse, SendTokensParams, SendTokensResponse } from "./types";

@Injectable()
export class TokenExchangeService {
  constructor(
    @Inject(IGNITE_TOKEN_EXCHANGE_API_AXIOS)
    private readonly axios: AxiosInstance
  ) {}

  async getBalanceInProms(ethAddress: string): Promise<string> {
    const response = await this.axios.get<BalanceResponse>("/balance/eth", {
      params: {
        address_eth: ethAddress
      }
    })

    if (response.data.status !== "Success") {
      throw new Error(`TokenExchangeService: Error occurred: ${JSON.stringify(response.data)}`)
    }

    return response.data.balance
  }

  /**
   * @returns хэш транзакции перевода
   */
  async sendTokens(params: SendTokensParams): Promise<string> {
    const response = await this.axios.post<SendTokensResponse>("/sendtokens", {
      private_key_from: params.privateKeyFrom,
      address_to: params.addressTo,
      amount: params.amount,
    })

    if (response.data.status !== "Success") {
      throw new Error(`TokenExchangeService: Error occurred: ${JSON.stringify(response.data)}`)
    }

    return response.data.result
  }

  /**
   * @returns хэш транзакции перевода
   */
  async sendTokensFromMemezatorPrizeFund(params: Omit<SendTokensParams, "privateKeyFrom">): Promise<string> {
    const response = await this.axios.post<SendTokensResponse>("/sendtokens", {
      private_key_from: config.MEMEZATOR_PRIZE_FUND_ACCOUNT_PRIVATE_KEY,
      address_to: params.addressTo,
      amount: params.amount,
    })

    if (response.data.status !== "Success") {
      throw new Error(`TokenExchangeService: Error occurred: ${JSON.stringify(response.data)}`)
    }

    if (!response.data.result) {
        throw new Error(
            `TokenExchangeService: Invalid response ${JSON.stringify(
                response.data,
            )}`,
        );
    }

    return response.data.result
  }
}
