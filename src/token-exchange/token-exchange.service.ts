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

    return response.data.result
  }

  async getTransactions() {
    return [
      {
        txnHash: "0xa6b9deba6d4ded99e4d441eba2453f197be69d538830f570de1f48bd07283164",
        tokenQnt: 2,
        txnDate: "2020-09-03 22:12:33.841+00",
        addressFrom: "0x7e760d6A6d63304A46289DdBdB9248d4863b3Ba7",
        addressTo: "0x611b5752C064BA307Ef459ee96733a7A1815B160"
      },
      {
        txnHash: "0xa6b9deba6d4ded99e4d441eba2453f197be69d538830f570de1f48bd07283164",
        tokenQnt: 3,
        txnDate: "2020-09-03 22:12:33.841+00",
        addressFrom: "0x7e760d6A6d63304A46289DdBdB9248d4863b3Ba7",
        addressTo: "0x611b5752C064BA307Ef459ee96733a7A1815B160"
      },
      {
        txnHash: "0xa6b9deba6d4ded99e4d441eba2453f197be69d538830f570de1f48bd07283164",
        tokenQnt: 4,
        txnDate: "2020-09-03 22:12:33.841+00",
        addressFrom: "0x7e760d6A6d63304A46289DdBdB9248d4863b3Ba7",
        addressTo: "0x611b5752C064BA307Ef459ee96733a7A1815B160"
      },
      {
        txnHash: "0xa6b9deba6d4ded99e4d441eba2453f197be69d538830f570de1f48bd07283164",
        tokenQnt: 5,
        txnDate: "2020-09-03 22:12:33.841+00",
        addressFrom: "0x7e760d6A6d63304A46289DdBdB9248d4863b3Ba7",
        addressTo: "0x611b5752C064BA307Ef459ee96733a7A1815B160"
      }
    ]
  }
}
