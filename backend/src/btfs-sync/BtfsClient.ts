import {Injectable, Inject} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import {BtfsEntitiesResponse, BtfsStatusLikesResponse, BtfsUserSubscriptionsResponse} from "./types/response";
import {SaveStatusLikeRequest, SaveStatusRequest, SaveUserSubscriptionRequest} from "./types/request";
import {BtfsStatus} from "./types/btfs-entities";

interface GetUserSubscriptionsOptions {
    userId: string,
    cid: string
}

interface GetStatusLikesOptions {
    statusLikeId: string,
    cid: string
}

interface GetStatusOptions {
    cid: string,
    statusId: string
}

@Injectable()
export class BtfsClient {
    constructor(@Inject("btfsAxios") private readonly axios: AxiosInstance) {
    }

    public getEntitiesByCid(cid: string): AxiosPromise<BtfsEntitiesResponse> {
        return this.axios.get(`/api/v1/soter/entities/${cid}`);
    }

    public saveUserSubscription(saveUserSubscriptionRequest: SaveUserSubscriptionRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/subscribe", saveUserSubscriptionRequest);
    }

    public getUserSubscriptionsByCid(options: GetUserSubscriptionsOptions): AxiosPromise<BtfsUserSubscriptionsResponse> {
        return this.axios.get(`/api/v1/subscribe/${options.cid}/${options.userId}`);
    }

    public saveStatusLike(saveStatusLikeRequest: SaveStatusLikeRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/like", saveStatusLikeRequest);
    }

    public getStatusLikesByCid(options: GetStatusLikesOptions): AxiosPromise<BtfsStatusLikesResponse> {
        return this.axios.get(`/api/v1/like/${options.cid}/${options.statusLikeId}`);
    }

    public saveStatus(saveStatusRequest: SaveStatusRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/status", saveStatusRequest);
    }

    public getStatusByCid(options: GetStatusOptions): AxiosPromise<BtfsStatus> {
        return this.axios.get(`/api/v1/status/${options.cid}/${options.statusId}`);
    }
}
