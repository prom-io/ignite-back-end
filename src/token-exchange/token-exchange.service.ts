import { Injectable, Inject } from "@nestjs/common";
import { AxiosInstance } from "axios";
import { config } from "../config";
import { TransactionStatus } from "../transactions/types/TransactionStatus.enum";
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
      /*
      {
        txnHash: "0x91d6eafc9379073aafe312c52f86aa5063e69541c9b84d25faef4d5fdbc117c7",
        tokenQnt: '3',
        txnDate: "2020-09-29 19:04:01.904+03",
        addressFrom: "0x7e760d6A6d63304A46289DdBdB9248d4863b3Ba7",
        addressTo: "0x33C8C365B4E7AB3FC476868625688BC7Efc6A2EB",
        txnStatus: TransactionStatus.PERFORMED
      },
      */
      {
        txnHash: "0xa6b9deba6d4ded99e4d441eba2453f197be69r530030f570de1f48bd07283164",
        tokenQnt: '3',
        txnDate: "2020-09-03 22:12:33.841+00",
        addressFrom: "0xbda67d4e7B9edC26830354683f29146C670628c7",
        addressTo: "0x611b5752C064BA307Ef459ee96733a7A1815B160",
        txnStatus: TransactionStatus.PERFORMING
      },
      {
        txnHash: "0xa6b9dert6d4ded11e4d441eba2453f197be69d538830f570de1f48bd07283164",
        tokenQnt: '4',
        txnDate: "2020-09-03 22:12:33.841+00",
        addressFrom: "0xbda67d4e7B9edC26830354683f29146C670628c7",
        addressTo: "0x611b5752C064BA307Ef459ee96733a7A1815B160",
        txnStatus: TransactionStatus.PERFORMING
      },
      {
        txnHash: "0xa6b9d00a6d4ded99e4d441eba24530097be69d538830f570de1f48bd07283164",
        tokenQnt: '5',
        txnDate: "2020-09-03 22:12:33.841+00",
        addressFrom: "0xbda67d4e7B9edC26830354683f29146C670628c7",
        addressTo: "0x611b5752C064BA307Ef459ee96733a7A1815B160",
        txnStatus: TransactionStatus.PERFORMING
      }
      /*,
      {
        txnHash: "0xa6b9d00a6d4ded99e4d441eba24530097be69d538830f570de1f48bd07283164",
        tokenQnt: '5',
        txnDate: "2020-09-03 22:12:33.841+00",
        addressFrom: "0x7e760d6A6d63304A46289DdBdB9248d4863b3Ba7",
        addressTo: "0x33C8C365B4E7AB3FC476868625688BC7Efc6A2EB",
        txnStatus: TransactionStatus.PERFORMING
      }
      */
    ]
  }
}
