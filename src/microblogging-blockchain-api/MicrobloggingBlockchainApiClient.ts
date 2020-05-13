import {Injectable, Inject} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios"
import {
    LogLikeRequest,
    LogStatusRequest,
    LogSubscriptionRequest,
    LogUnlikeRequest,
    LogUnsubscriptionRequest
} from "./types/request";

@Injectable()
export class MicrobloggingBlockchainApiClient {
    constructor(@Inject("microbloggingBlockchainApiAxiosInstance") private readonly axios: AxiosInstance) {
    }

    public logStatus(logStatusRequest: LogStatusRequest): AxiosPromise<void> {
        return this.axios.post("/message/push", logStatusRequest);
    }

    public logStatusLike(logStatusLikeRequest: LogLikeRequest): AxiosPromise<void> {
        return this.axios.post("/like", logStatusLikeRequest);
    }

    public logSubscription(logSubscriptionRequest: LogSubscriptionRequest): AxiosPromise<void> {
        return this.axios.post("/subscribe", logSubscriptionRequest)
    }

    public logStatusUnlike(logStatusUnlikeRequest: LogUnlikeRequest): AxiosPromise<void> {
        return this.axios.post("/unlike", logStatusUnlikeRequest);
    }

    public logUnsubscription(logUnsubscriptionRequest: LogUnsubscriptionRequest): AxiosPromise<void> {
        return this.axios.post("/unsubscribe", logUnsubscriptionRequest);
    }
}
