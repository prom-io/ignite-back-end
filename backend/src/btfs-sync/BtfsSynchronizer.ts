import {Injectable} from "@nestjs/common";
import {Cron, NestSchedule} from "nest-schedule";
import {LoggerService} from "nest-logger";
import {validate} from "class-validator";
import fileSystem from "fs";
import path from "path";
import graphicsMagic from "gm";
import FileTypeExtractor from "file-type";
import {BtfsHashRepository} from "./BtfsHashRepository";
import {BtfsClient} from "./BtfsClient";
import {BtfsHash} from "./entities";
import {BtfsMediaAttachment, BtfsStatus, BtfsStatusLike, BtfsUser, BtfsUserSubscription} from "./types/btfs-entities";
import {BtfsStatusLikesResponse} from "./types/response";
import {asyncForEach} from "../utils/async-foreach";
import {User} from "../users/entities";
import {Status} from "../statuses/entities";
import {StatusesRepository, StatusLikesRepository} from "../statuses";
import {UsersRepository} from "../users";
import {UserSubscriptionsRepository} from "../user-subscriptions";
import {MediaAttachment} from "../media-attachments/entities";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {asyncMap} from "../utils/async-map";
import {UserSubscription} from "../user-subscriptions/entities";
import {config} from "../config";

@Injectable()
export class BtfsSynchronizer extends NestSchedule {
    constructor(private readonly btfsHashRepository: BtfsHashRepository,
                private readonly statusesRepository: StatusesRepository,
                private readonly statusLikesRepository: StatusLikesRepository,
                private readonly usersRepository: UsersRepository,
                private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly mediaAttachmentsRepository: MediaAttachmentsRepository,
                private readonly btfsClient: BtfsClient,
                private readonly log: LoggerService
                ) {
        super();
    }

    @Cron("* * * *", {waiting: true})
    public async synchronizeEntities(): Promise<void> {
        this.log.info("Started synchronization with BTFS");
        const unsyncedBtfsCids: BtfsHash[] = await this.btfsHashRepository.findAllNotSynced();

        await asyncForEach(unsyncedBtfsCids, async btfsHash => {
            try {
                this.log.info(`Synchronizing with BTFS cid ${btfsHash.btfsCid}`);
                const entities = (await this.btfsClient.getEntitiesByCid(btfsHash.btfsCid)).data;
                const images = entities.images || [];
                const statuses = entities.posts || [];
                const statusLikes = entities.likes || [];
                const subscriptions = entities.subscribes || [];

                console.log(entities);

                await this.synchronizeImages(btfsHash.btfsCid, images);
                await this.synchronizeStatusLikes(btfsHash.btfsCid, statusLikes);
                await this.synchronizeStatuses(btfsHash.btfsCid, statuses);
                await this.synchronizeSubscriptions(btfsHash.btfsCid, subscriptions);

                btfsHash.synced = true;
                await this.btfsHashRepository.save(btfsHash);
            } catch (error) {
                this.log.error(`Error occurred when tried to synchronize with BTFS cid ${btfsHash.btfsCid}`);
                console.log(error);
            }
        })
    }

    private async synchronizeImages(cid: string, imagesIds: string[]): Promise<void> {
        await asyncForEach(imagesIds, async imageId => {
            const temporaryFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${imageId}.temporary`);
            await this.btfsClient.downloadFile({
                cid,
                id: imageId,
                path: temporaryFilePath
            });

            const file = await FileTypeExtractor.fromBuffer(fileSystem.readFileSync(temporaryFilePath));
            if (file.mime.startsWith("image")) {
                graphicsMagic(temporaryFilePath)
                    .size(async (error, size) => {
                        if (error) {
                            console.log(error);
                            throw error;
                        }

                        const permanentFilePath = path.join(config.MEDIA_ATTACHMENTS_DIRECTORY, `${imageId}.${file.ext}`);
                        fileSystem.renameSync(temporaryFilePath, permanentFilePath);
                        const mediaAttachment: MediaAttachment = {
                            id: imageId,
                            format: file.ext,
                            mimeType: file.mime,
                            height: size.height,
                            width: size.width,
                            name: `${imageId}.${file.ext}`,
                            btfsCid: cid
                        };
                        await this.mediaAttachmentsRepository.save(mediaAttachment);
                    })
            }
        })
    }

    private async synchronizeStatuses(cid: string, statusesIds: string[]): Promise<void> {
        await asyncForEach(statusesIds, async statusId => {
            const status = new BtfsStatus((await this.btfsClient.getStatusByCid({cid, statusId})).data);
            const errors = await validate(status);

            if (errors.length > 0) {
                console.log(errors);
                return ;
            }

            await this.mergeStatus(
                await this.statusesRepository.findById(status.id),
                status,
                cid
            );
        });
    }

    private async synchronizeStatusLikes(cid: string, likes: Array<{commentId: string, id: string}>): Promise<void> {
       await asyncForEach(likes, async likeData => {
           const btfsLikes: BtfsStatusLikesResponse = (await this.btfsClient.getStatusLikesByCid({commentId: likeData.commentId, cid})).data;
           const likesIds = Object.keys(btfsLikes);

           await asyncForEach(likesIds, async likeId => {
               const btfsLike: BtfsStatusLike = new BtfsStatusLike(btfsLikes[likeId]);
               const errors = await validate(btfsLike);

               if (errors.length > 0) {
                   console.log(errors);
                   return ;
               }

               await this.saveBtfsStatusLike(btfsLike, cid);
           })
       })
    }

    private async saveBtfsStatusLike(btfsStatusLike: BtfsStatusLike, btfsCid: string): Promise<void> {
        let statusLike = await this.statusLikesRepository.findById(btfsStatusLike.id);

        if (!statusLike) {
            const user = await this.mergeUser(await this.usersRepository.findById(btfsStatusLike.user.id), btfsStatusLike.user);
            const status = await this.mergeStatus(
                await this.statusesRepository.findById(btfsStatusLike.status.id),
                btfsStatusLike.status,
                btfsCid
            );
            statusLike = {
                id: btfsStatusLike.id,
                user,
                status,
                createdAt: new Date(btfsStatusLike.createdAt),
                btfsHash: btfsCid
            };

            const existingLike = await this.statusLikesRepository.findByStatusAndUser(status, user);

            if (existingLike) {
                this.log.info("Deleting existing status like");
                await this.statusLikesRepository.delete(existingLike);
            }

            await this.statusLikesRepository.save(statusLike);
        } else if (!statusLike.btfsHash) {
            statusLike.btfsHash = btfsCid;
            await this.statusLikesRepository.save(statusLike);
        }
    }

    private async synchronizeSubscriptions(cid: string, subscriptions: Array<{id: string, userId: string}>): Promise<void> {
        await asyncForEach(subscriptions, async subscriptionData => {
            const subscriptionsMap = (await this.btfsClient.getUserSubscriptionsByCid({cid, userId: subscriptionData.userId})).data;
            const subscriptionIds = Object.keys(subscriptionsMap);

            await asyncForEach(subscriptionIds, async subscriptionId => {
                const btfsUserSubscription = new BtfsUserSubscription(subscriptionsMap[subscriptionId]);
                const errors = await validate(btfsUserSubscription);

                if (errors.length > 0) {
                    console.log(errors);
                    return;
                }

                await this.mergeSubscription(
                    await this.userSubscriptionsRepository.findById(btfsUserSubscription.id),
                    btfsUserSubscription,
                    cid
                )
            })
        })
    }

    private async mergeStatus(status: Status | undefined, btfsStatus: BtfsStatus, btfsCid: string): Promise<Status> {
        if (!status) {
            const mediaAttachments = await asyncMap(
                btfsStatus.mediaAttachments,
                async btfsMediaAttachment => {
                    return await this.mergeMediaAttachment(
                        await this.mediaAttachmentsRepository.findById(btfsMediaAttachment.id),
                        btfsMediaAttachment
                    );
                }
            );
            const author = await this.mergeUser(await this.usersRepository.findById(btfsStatus.author.id), btfsStatus.author);
            status = {
                ...btfsStatus,
                author,
                mediaAttachments,
                createdAt: new Date(btfsStatus.createdAt),
                updatedAt: undefined,
                remote: true,
                btfsHash: btfsCid
            };
            status = await this.statusesRepository.save(status);
        } else {
            if (!status.btfsHash) {
                status.btfsHash = btfsCid;
                status = await this.statusesRepository.save(status);
            }
        }

        return status;
    }

    private async mergeUser(user: User | undefined, btfsUser: BtfsUser): Promise<User> {
        if (!user) {
            user = {
                ...btfsUser,
                remote: true,
                ethereumAddress: btfsUser.address,
                createdAt: new Date(btfsUser.createdAt)
            };
            user = await this.usersRepository.save(user);
        }

        return user;
    }

    private async mergeMediaAttachment(
        mediaAttachment: MediaAttachment | undefined,
        btfsMediaAttachment: BtfsMediaAttachment
    ): Promise<MediaAttachment> {
        if (mediaAttachment) {
            return mediaAttachment;
        } else {
            mediaAttachment = {
                ...btfsMediaAttachment,
                name: btfsMediaAttachment.id,
                siaLink: undefined
            };
            mediaAttachment = await this.mediaAttachmentsRepository.save(mediaAttachment);
            return mediaAttachment;
        }
    }

    private async mergeSubscription(
        userSubscription: UserSubscription | undefined,
        btfsUserSubscription: BtfsUserSubscription,
        btfsCid: string
    ): Promise<UserSubscription> {
        if (userSubscription) {
            if (!userSubscription.btfsHash) {
                userSubscription.btfsHash = btfsCid;
                userSubscription = await this.userSubscriptionsRepository.save(userSubscription);
            }

            return userSubscription;
        } else {
            const subscribedUser = await this.mergeUser(
                await this.usersRepository.findById(btfsUserSubscription.subscribedUser.id),
                btfsUserSubscription.subscribedUser
            );
            const subscribedTo = await this.mergeUser(
                await this.usersRepository.findById(btfsUserSubscription.subscribedTo.id),
                btfsUserSubscription.subscribedTo
            );
            userSubscription = {
                id: btfsUserSubscription.id,
                subscribedUser,
                subscribedTo,
                btfsHash: btfsCid,
                createdAt: new Date(btfsUserSubscription.createdAt)
            };

            const existingSubscription = await this.userSubscriptionsRepository.findBySubscribedUserAndSubscribedTo(subscribedUser, subscribedTo);

            if (existingSubscription) {
                this.log.info("Deleting existing subscription");
                await this.userSubscriptionsRepository.delete(existingSubscription);
            }

            userSubscription = await this.userSubscriptionsRepository.save(userSubscription);
            return userSubscription;
        }
    }
}
