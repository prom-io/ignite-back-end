import {Injectable} from "@nestjs/common";
import {Status} from "./entities";
import {ToStatusResponseOptions} from "./StatusesMapper";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {UserStatisticsRepository} from "../users/UserStatisticsRepository";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {User} from "../users/entities";
import {BtfsHashRepository} from "../btfs-sync/BtfsHashRepository";

@Injectable()
export class StatusMappingOptionsProvider {
    constructor(private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly btfsHashRepository: BtfsHashRepository) {

    }

    public async getStatusMappingOptions(
        status: Status,
        mapReferredStatusOptions?: ToStatusResponseOptions,
        currentUser?: User,
    ): Promise<ToStatusResponseOptions> {
        const likesCount = await this.statusLikesRepository.countByStatus(status);
        let likedByCurrentUser = false;

        if (likesCount !== 0 && currentUser) {
            likedByCurrentUser = await this.statusLikesRepository.existByStatusAndUserNotReverted(status, currentUser);
        }

        const followingAuthor = currentUser && await this.userSubscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(
            currentUser, status.author
        );
        const followedByAuthor = currentUser && await this.userSubscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(
            status.author, currentUser
        );
        const userStatistics  = await this.userStatisticsRepository.findByUser(status.author);
        const repostsCount = await this.statusesRepository.countReposts(status);
        const commentsCount = await this.statusesRepository.countComments(status);
        const btfsHash = status.btfsHash && await this.btfsHashRepository.findByBtfsCid(status.btfsHash);

        return {
            status,
            favouritesCount: likesCount,
            favourited: likedByCurrentUser,
            followedByAuthor,
            followingAuthor,
            mapReferredStatus: Boolean(mapReferredStatusOptions),
            referredStatusOptions: mapReferredStatusOptions,
            userStatistics,
            repostsCount,
            commentsCount,
            btfsHash: btfsHash && btfsHash.peerIp && btfsHash.peerWallet ? btfsHash : null
        }
    }
}
