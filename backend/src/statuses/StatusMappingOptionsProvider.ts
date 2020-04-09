import {Injectable} from "@nestjs/common";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions";
import {Status} from "./entities";
import {ToStatusResponseOptions} from "./StatusesMapper";
import {User} from "../users/entities";
import {UserStatisticsRepository} from "../users";

@Injectable()
export class StatusMappingOptionsProvider {
    constructor(private readonly statusLikesRepository: StatusLikesRepository,
                private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository) {

    }

    public async getStatusMappingOptions(
        status: Status,
        mapRepostedStatusOptions?: ToStatusResponseOptions,
        currentUser?: User,
    ): Promise<ToStatusResponseOptions> {
        const likesCount = await this.statusLikesRepository.countByStatus(status);
        let likedByCurrentUser = false;

        if (likesCount !== 0 && currentUser) {
            likedByCurrentUser = await this.statusLikesRepository.existByStatusAndUser(status, currentUser);
        }

        const followingAuthor = currentUser && await this.userSubscriptionsRepository.existsBySubscribedUserAndSubscribedTo(
            currentUser, status.author
        );
        const followedByAuthor = currentUser && await this.userSubscriptionsRepository.existsBySubscribedUserAndSubscribedTo(
            status.author, currentUser
        );
        const userStatistics  = await this.userStatisticsRepository.findByUser(status.author)

        return {
            status,
            favouritesCount: likesCount,
            favourited: likedByCurrentUser,
            followedByAuthor,
            followingAuthor,
            mapRepostedStatus: Boolean(mapRepostedStatusOptions),
            repostedStatusOptions: mapRepostedStatusOptions,
            userStatistics
        }
    }
}
