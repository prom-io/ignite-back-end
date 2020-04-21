import {Injectable} from "@nestjs/common";
import {Status} from "./entities";
import {ToStatusResponseOptions} from "./StatusesMapper";
import {StatusesRepository} from "./StatusesRepository";
import {StatusLikesRepository} from "./StatusLikesRepository";
import {CommentsRepository} from "./CommentsRepository";
import {ToCommentResponseOptions} from "./CommentsMapper";
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
                private readonly btfsHashRepository: BtfsHashRepository,
                private readonly commentsRepository: CommentsRepository) {

    }

    public async getStatusMappingOptions(
        status: Status,
        mapRepostedStatusOptions?: ToStatusResponseOptions,
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
        const repostsCount = await this.statusesRepository.countByRepostedStatus(status);
        const commentsCount = await this.commentsRepository.countByStatus(status);
        const btfsHash = status.btfsHash && await this.btfsHashRepository.findByBtfsCid(status.btfsHash);

        let repostedCommentOptions: ToCommentResponseOptions | undefined;

        if (status.repostedComment) {
            repostedCommentOptions = {
                comment: status.repostedComment,
                repostsCount: await this.statusesRepository.countByRepostedComment(status.repostedComment)
            }
        }

        return {
            status,
            favouritesCount: likesCount,
            favourited: likedByCurrentUser,
            followedByAuthor,
            followingAuthor,
            mapRepostedStatus: Boolean(mapRepostedStatusOptions),
            repostedStatusOptions: mapRepostedStatusOptions,
            userStatistics,
            repostsCount,
            btfsHash,
            commentsCount,
            repostedCommentOptions
        }
    }
}
