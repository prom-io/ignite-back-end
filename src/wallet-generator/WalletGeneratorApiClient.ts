import {Injectable, Inject, HttpException, HttpStatus, OnApplicationBootstrap} from "@nestjs/common";
import {AxiosInstance} from "axios";
import {GenerateWalletResponse, GetAccessTokenResponse, IGenerateWalletResponse} from "./types/response";
import {GetAccessTokenRequest} from "./types/request";
import {config} from "../config";

@Injectable()
export class WalletGeneratorApiClient implements OnApplicationBootstrap {
    private accessToken: string | undefined = undefined;

    constructor(@Inject("walletGeneratorAxiosInstance") private readonly axios: AxiosInstance) {
    }

    public async generateWallet(): Promise<GenerateWalletResponse> {
        try {
            const response: IGenerateWalletResponse = (await this.axios.get("/wallet/generate")).data;
            return new GenerateWalletResponse(response);
        } catch (error) {
            console.log(error);
            if (error.response) {
                throw new HttpException(
                    `Could not generate wallet, wallet generator responded with ${error.response.status} status`,
                    HttpStatus.INTERNAL_SERVER_ERROR
                );
            } else {
                throw new HttpException(
                    `Could not get any response from wallet generator`,
                    HttpStatus.SERVICE_UNAVAILABLE
                );
            }
        }
    }

    public async onApplicationBootstrap(): Promise<void> {
        await this.getAccessToken();
        this.axios.interceptors.request.use(axiosRequestConfig => {
            axiosRequestConfig.headers.Authorization = `Bearer ${this.accessToken}`;
            return axiosRequestConfig;
        });

        this.axios.interceptors.response.use(undefined, error => {
            if (error.response && error.response.status === 401) {
                return new Promise(async resolve => {
                    await this.getAccessToken();
                    error.response.config.headers.Authorization = `Bearer ${this.accessToken}`;
                    resolve(this.axios(error.response.config));
                })
            }

            return Promise.reject(error);
        })
    }

    private async getAccessToken(): Promise<void> {
        try {
            const getAccessTokenRequest: GetAccessTokenRequest = {
                username: config.PROMETEUS_WALLET_GENERATOR_API_USERNAME,
                password: config.PROMETEUS_WALLET_GENERATOR_API_PASSWORD
            };
            const getAccessTokenResponse: GetAccessTokenResponse = (await this.axios.post("/auth/login", getAccessTokenRequest)).data;
            this.accessToken = getAccessTokenResponse.access_token
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
