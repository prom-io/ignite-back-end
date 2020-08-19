import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import { AccountWithBalance } from "./types";
import { config } from "../config";

@Injectable()
export class EtherscanService {
  private axios: AxiosInstance
  private apiToken: string

  constructor() {
    this.apiToken = config.ETHERSCAN_API_TOKEN
    this.axios = axios.create({
      baseURL: "https://api.etherscan.io/api"
    })
  }

  /**
   * Get ERC20-Token Account Balance for TokenContractAddress
   * @see https://etherscan.io/apis#tokens
   */
  async getERC20TokenAccountBalanceForTokenContractAddress(contractAddress: string, address: string): Promise<string> {
    const response = await this.axios.get(
      "",
      {
        params: {
          module: "account",
          action: "tokenbalance",
          contractaddress: contractAddress,
          address,
          tag: "latest",
          apikey: this.apiToken
        }
      }
    )

    if (response.data.status !== "1") {
      throw new Error(response.data.result)
    }

    return response.data.result as string
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

  async getBalance(address: string): Promise<string> {
    const response = await this.axios.get(
      "",
      {
        params: {
          module: "account",
          action: "balance",
          address,
          tag: "latest",
          apikey: this.apiToken
        }
      }
    )

    if (response.data.status !== "1") {
      throw new Error(response.data.result)
    }

    return response.data.result as string
  }
}
