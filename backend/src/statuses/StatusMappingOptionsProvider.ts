import {Injectable} from "@nestjs/common";
import {Status} from "./entities";
import {ToStatusResponseOptions} from "./StatusesMapper";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {UserStatisticsRepository} from "../users/UserStatisticsRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {User} from "../users/entities";

@Injectable()
export class StatusMappingOptionsProvider {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
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
        const userStatistics  = await this.userStatisticsRepository.findByUser(status.author);
        const repostsCount = await this.statusesRepository.countByRepostedStatus(status);

        return {
            status,
            favouritesCount: likesCount,
            favourited: likedByCurrentUser,
            followedByAuthor,
            followingAuthor,
            mapRepostedStatus: Boolean(mapRepostedStatusOptions),
            repostedStatusOptions: mapRepostedStatusOptions,
            userStatistics,
            repostsCount
        }
    }
}
