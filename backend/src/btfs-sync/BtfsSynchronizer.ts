import {Injectable} from "@nestjs/common";
import {NestSchedule, Cron} from "nest-schedule";
import {StatusesRepository, StatusLikesRepository} from "../statuses";
import {UsersRepository} from "../users";
import {UserSubscriptionsRepository} from "../user-subscriptions";
import {BtfsHashRepository} from "./BtfsHashRepository";
import {BtfsClient} from "./BtfsClient";
import {BtfsHash} from "./entities";
import {BtfsStatus, BtfsStatusLike, BtfsUser} from "./types/btfs-entities";
import {asyncForEach} from "../utils/async-foreach";
import {User} from "../users/entities";
import {Status} from "../statuses/entities";

@Injectable()
export class BtfsSynchronizer extends NestSchedule {
    constructor(private readonly btfsHashRepository: BtfsHashRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly usersRepository: UsersRepository,
                private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly btfsClient: BtfsClient
                ) {
        super();
    }

    public async synchronizeEntities(): Promise<void> {
        const unsyncedBtfsCids: BtfsHash[] = await this.btfsHashRepository.findAllNotSynced();

        await asyncForEach(unsyncedBtfsCids, async btfsHash => {
            const entities = (await this.btfsClient.getEntitiesByCid(btfsHash.btfsCid)).data;
            const statuses = entities.posts;
            const statusLikes = entities.likes;
            const subscriptions = entities.subscribes;

            await this.synchronizeStatuses(btfsHash.btfsCid, statuses);
        })
    }

    private async synchronizeStatuses(cid: string, statusesIds: string[]): Promise<void> {
        await asyncForEach(statusesIds, async statusId => {
            const status: BtfsStatus = (await this.btfsClient.getStatusByCid({cid, statusId})).data;
            const statusAuthor: BtfsUser = status.author;
            let user: User | undefined = await this.usersRepository.findByEthereumAddress(statusAuthor.address);

            if (!user) {
                user = await this.createAndSaveNewUser(statusAuthor, cid);
            }

            this.saveStatus(status, user, cid);
        });
    }

    private async createAndSaveNewUser(btfsUser: BtfsUser, cid: string): Promise<User> {
        let user: User = {
            id: btfsUser.id,
            createdAt: new Date(btfsUser.createdAt),
            btfsHash: cid,
            displayedName: btfsUser.displayedName,
            remote: true,
            ethereumAddress: btfsUser.address,
            privateKey: undefined,
            username: btfsUser.username,
            avatarUri: btfsUser.avatarUri
        };
        user = await this.usersRepository.save(user);
        return user;
    }

    private async saveStatus(btfsStatus: BtfsStatus, user: User, cid: string): Promise<Status> {
        let status: Status = {
            id: btfsStatus.id,
            author: user,
            createdAt: new Date(btfsStatus.createdAt),
            text: btfsStatus.text,
            remote: true,
            updatedAt: undefined,
            btfsHash: cid,
            mediaAttachments: []
        };
        status = await this.statusesRepository.save(status);
        return status;
    }
}
