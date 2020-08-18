import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { AccountWithBalance } from "./types";

@Injectable()
export class EtherscanService {
  private axios: AxiosInstance
  private apiToken: string

  constructor(apiToken: string) {
    this.apiToken = apiToken
    this.axios = axios.create({
      baseURL: "https://api.etherscan.io/api"
    })
  }
  
  async getBalancesOnMultipleAccounts(addresses: string[]): Promise<AccountWithBalance[]> {
    const response = await this.axios.get(
      "",
      {
        params: {
          module: "account",
          action: "balancemulti",
          address: addresses.join(","),
          tag: "latest",
          apikey: this.apiToken
        }
      }
    )

    if (response.data.status !== "1") {
      throw new Error(response.data.result)
    }

    return response.data.result as AccountWithBalance[]
  }
}
