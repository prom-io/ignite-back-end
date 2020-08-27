import { Module } from "@nestjs/common";
import { TokenExchangeService } from "./token-exchange.service";
import { IGNITE_TOKEN_EXCHANGE_API_AXIOS } from "./constants";
import axios from "axios";
import { config } from "../config";

@Module({
  providers: [
    {
      provide: IGNITE_TOKEN_EXCHANGE_API_AXIOS,
      useFactory() {
        return axios.create({
          baseURL: config.IGNITE_TOKEN_EXCHANGE_API_BASE_URL,
        })
      }
    },
    TokenExchangeService,
  ],
  exports: [TokenExchangeService],
})
export class TokenExchangeModule {}
