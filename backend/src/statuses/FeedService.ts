import {Injectable} from "@nestjs/common";
import {UserSubscriptionsRepository} from "../user-subscriptions";
import {StatusesRepository} from "./StatusesRepository";
import {StatusesMapper} from "./StatusesMapper";
import {User} from "../users/entities";
import {PaginationRequest} from "../utils/pagination";
import {StatusResponse} from "./types/response";
import {StatusLikesRepository} from "./StatusLikesRepository";

@Injectable()
export class FeedService {
    constructor(private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly statusesMapper: StatusesMapper) {
    }

    public async getFeedOfCurrentUser(currentUser: User, paginationRequest: PaginationRequest): Promise<StatusResponse[]> {
        const subscriptions = await this.subscriptionsRepository.findAllBySubscribedUser(currentUser);
        const authors = subscriptions.map(subscription => subscription.subscribedTo);
        const statuses = await this.statusesRepository.findByAuthorIn(authors, paginationRequest);
        const likesMap: {[statusId: string]: {
                numberOfLikes: number,
                likedByCurrentUser: boolean
            }} = {};

        for (const status of statuses) {
            likesMap[status.id] = {
                numberOfLikes: await this.statusLikesRepository.countByStatus(status),
                likedByCurrentUser: currentUser && await this.statusLikesRepository.existByStatusAndUser(
                    status,
                    currentUser
                )
            };
        }

        return statuses.map(status => this.statusesMapper.toStatusResponse(
            status,
            likesMap[status.id].numberOfLikes,
            likesMap[status.id].likedByCurrentUser
        ))
    }
}
