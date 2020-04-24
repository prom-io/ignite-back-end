import {Injectable, Inject} from "@nestjs/common";
import {AxiosInstance, AxiosPromise} from "axios";
import fileSystem, {PathLike} from "fs";
import FormData from "form-data";
import {BtfsCommentsResponse, BtfsEntitiesResponse, BtfsStatusLikesResponse, BtfsUserSubscriptionsResponse} from "./types/response";
import {SaveCommentRequest, SaveStatusLikeRequest, SaveStatusRequest, SaveUserSubscriptionRequest} from "./types/request";
import {BtfsStatus} from "./types/btfs-entities";
import {SaveUserUnsubscriptionRequest} from "./types/request/SaveUserUnsubscriptionRequest";

interface GetUserSubscriptionsOptions {
    userId: string,
    cid: string
}

interface GetStatusLikesOptions {
    commentId: string,
    cid: string
}

interface GetStatusOptions {
    cid: string,
    statusId: string
}

interface GetCommentsOptions {
    cid: string,
    statusId: string
}

interface DownloadFileOptions {
    path: PathLike,
    id: string,
    cid: string
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

    public saveUserUnsubscription(saveUserUnsubscriptionRequest: SaveUserUnsubscriptionRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/unsubscribe", saveUserUnsubscriptionRequest);
    }

    public getUserSubscriptionsByCid(options: GetUserSubscriptionsOptions): AxiosPromise<BtfsUserSubscriptionsResponse> {
        return this.axios.get(`/api/v1/subscribe/${options.cid}/${options.userId}`);
    }

    public getUserUnsubscriptionsByCid(options: GetUserSubscriptionsOptions): AxiosPromise<BtfsUserSubscriptionsResponse> {
        return this.axios.get(`/api/v1/unsubscribe/${options.cid}/${options.userId}`);
    }

    public saveStatusLike(saveStatusLikeRequest: SaveStatusLikeRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/like", saveStatusLikeRequest);
    }

    public saveStatusUnlike(saveStatusUnlikeRequest: SaveStatusLikeRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/unlike", saveStatusUnlikeRequest);
    }

    public getStatusLikesByCid(options: GetStatusLikesOptions): AxiosPromise<BtfsStatusLikesResponse> {
        return this.axios.get(`/api/v1/like/${options.cid}/${options.commentId}`);
    }

    public getStatusUnlikesByCid(options: GetStatusLikesOptions): AxiosPromise<BtfsStatusLikesResponse> {
        return this.axios.get(`/api/v1/unlike/${options.cid}/${options.commentId}`);
    }

    public saveStatus(saveStatusRequest: SaveStatusRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/post", saveStatusRequest);
    }

    public getStatusByCid(options: GetStatusOptions): AxiosPromise<BtfsStatus> {
        return this.axios.get(`/api/v1/post/${options.cid}/${options.statusId}`);
    }

    public saveComment(saveCommentRequest: SaveCommentRequest): AxiosPromise<void> {
        return this.axios.post("/api/v1/comment", saveCommentRequest);
    }

    public getCommentsByCid(options: GetCommentsOptions): AxiosPromise<BtfsCommentsResponse> {
        return this.axios.get(`/api/v1/comment/${options.cid}/${options.statusId}`);
    }

    public uploadFile(fileId: string, path: PathLike): AxiosPromise<void> {
        const formData = new FormData();
        formData.append("id", fileId);
        formData.append("file", fileSystem.createReadStream(path));

        return this.axios.post("/api/v1/file/upload", formData, {headers: formData.getHeaders()});
    }

    public downloadFile(options: DownloadFileOptions): Promise<void> {
        const writer = fileSystem.createWriteStream(options.path);

        return new Promise<void>((resolve, reject) => {
            this.axios.get(`/api/v1/file/${options.cid}/${options.id}`, {responseType: "stream"})
                .then(response => {
                    response.data.pipe(writer);
                    writer.on("finish", resolve);
                    writer.on("error", reject);
                })
                .catch(error => {
                    reject(error);
                })
        })
    }

    public getAllJson(cid: string): AxiosPromise<any[]> {
        return this.axios.get(`/api/v1/soter/all/${cid}`);
    }
}
