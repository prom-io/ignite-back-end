import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import uuid from "uuid";
import {UserSubscription} from "./entities";
import {UserSubscriptionsRepository} from "./UserSubscriptionsRepository";
import {UserSubscriptionsMapper} from "./UserSubscriptionsMapper";
import {RelationshipsResponse, UserSubscriptionResponse} from "./types/response";
import {UsersRepository} from "../users/UsersRepository";
import {UserStatisticsRepository} from "../users/UserStatisticsRepository";
import {User, UserStatistics} from "../users/entities";
import {PaginationRequest} from "../utils/pagination";
import {UserResponse} from "../users/types/response";
import {UsersMapper} from "../users/UsersMapper";

@Injectable()
export class UserSubscriptionsService {
    constructor(private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly usersRepository: UsersRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly userSubscriptionsMapper: UserSubscriptionsMapper,
                private readonly usersMapper: UsersMapper) {
    }

    public async followUser(address: string,
                            currentUser: User): Promise<UserResponse> {
        let targetUser = await this.usersRepository.findByEthereumAddress(address);

        if (!targetUser) {
            targetUser = await this.usersRepository.findByUsername(address);
        }

        if (!targetUser) {
            throw new HttpException(
                `Could not find user with address or username ${address}`,
                HttpStatus.NOT_FOUND
            );
        }

        if (targetUser.id === currentUser.id) {
            throw new HttpException(
                "Users cannot follow themselves",
                HttpStatus.FORBIDDEN
            )
        }

        if (await this.userSubscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(currentUser, targetUser)) {
            throw new HttpException(
                `Current user is already subscribed to ${targetUser.ethereumAddress}`,
                HttpStatus.CONFLICT
            );
        }

        const subscription: UserSubscription = {
            id: uuid(),
            subscribedUser: currentUser,
            subscribedTo: targetUser,
            createdAt: new Date(),
            reverted: false,
            revertedAt: null
        };
        await this.userSubscriptionsRepository.save(subscription);

        const targetUserSubscription = await this.userSubscriptionsRepository
            .findBySubscribedUserAndSubscribedToNotReverted(targetUser, currentUser);
        const userStatistics = await this.userStatisticsRepository.findByUser(targetUser);

        return this.usersMapper.toUserResponse(targetUser, userStatistics, true, Boolean(targetUserSubscription));
    }

    public async unfollowUser(address: string, currentUser: User): Promise<UserResponse> {
        let targetUser = await this.usersRepository.findByEthereumAddress(address);

        if (!targetUser) {
            targetUser = await this.usersRepository.findByUsername(address);
        }

        if (!targetUser) {
            throw new HttpException(`Could not find user with address or username ${address}`, HttpStatus.NOT_FOUND);
        }

        const subscription = await this.userSubscriptionsRepository.findBySubscribedUserAndSubscribedToNotReverted(currentUser, targetUser);

        if (!subscription) {
            throw new HttpException(`Current user is not subscribed to ${address}`, HttpStatus.FORBIDDEN);
        }

        subscription.reverted = true;
        subscription.revertedAt = new Date();
        subscription.saveUnsubscriptionToBtfs = true;

        await this.userSubscriptionsRepository.save(subscription);

        const targetUserSubscription = await this.userSubscriptionsRepository
            .findBySubscribedUserAndSubscribedToNotReverted(targetUser, currentUser);
        const userStatistics = await this.userStatisticsRepository.findByUser(targetUser);

        return this.usersMapper.toUserResponse(targetUser, userStatistics, false, Boolean(targetUserSubscription));
    }

    public async getSubscriptionsOfCurrentUser(currentUser: User, paginationRequest: PaginationRequest): Promise<UserSubscriptionResponse[]> {
        const subscriptions = await this.userSubscriptionsRepository.findBySubscribedUserNotReverted(currentUser, paginationRequest);
        return subscriptions.map(subscription => this.userSubscriptionsMapper.toUserSubscriptionResponse(subscription));
    }

    public async getSubscriptionsByUser(userAddress: string, paginationRequest: PaginationRequest): Promise<UserSubscriptionResponse[]> {
        let user = await this.usersRepository.findByUsername(userAddress);

        if (!user) {
            user = await this.usersRepository.findByEthereumAddress(userAddress);
        }

        if (!user) {
            throw new HttpException(
                `User with ${userAddress} was not found`,
                HttpStatus.NOT_FOUND
            );
        }

        const subscriptions = await this.userSubscriptionsRepository.findBySubscribedUserNotReverted(user, paginationRequest);
        return subscriptions.map(subscription => this.userSubscriptionsMapper.toUserSubscriptionResponse(subscription));
    }

    public async deleteSubscription(subscriptionId: string, currentUser: User): Promise<void> {
        const subscription = await this.userSubscriptionsRepository.findById(subscriptionId);

        if (!subscription) {
            throw new HttpException(
                `Could not find subscription with id ${subscriptionId}`,
                HttpStatus.NOT_FOUND
            );
        }

        if (subscription.subscribedUser.ethereumAddress !== currentUser.ethereumAddress) {
            throw new HttpException(
                `This subscription was not created by current user`,
                HttpStatus.FORBIDDEN
            );
        }

        await this.userSubscriptionsRepository.remove(subscription);
    }

    public async getUserRelationships(addresses: string[], currentUser: User): Promise<RelationshipsResponse[]> {
        const users = await this.usersRepository.findAllByEthereumAddresses(addresses);
        const relationships: RelationshipsResponse[] = [];

        for (const user of users) {
            const currentUserSubscription = await this.userSubscriptionsRepository.findBySubscribedUserAndSubscribedToNotReverted(currentUser, user);
            const backwardsSubscription = await this.userSubscriptionsRepository.findBySubscribedUserAndSubscribedToNotReverted(user, currentUser);

            relationships.push(new RelationshipsResponse({
                id: user.ethereumAddress,
                following: Boolean(currentUserSubscription),
                followedBy: Boolean(backwardsSubscription),
                showingReblogs: false,
                blockedBy: false,
                blocking: false,
                muting: false,
                requested: false,
                domainBlocking: false,
                endorsed: false,
                mutingNotifications: false
            }))
        }

        return relationships;
    }

    public async getFollowersOfUser(address: string): Promise<UserResponse[]> {
        const subscribedTo = await this.findUserByAddressOrUsername(address);

        const subscriptions = await this.userSubscriptionsRepository.findAllBySubscribedToNotReverted(subscribedTo);

        const userStatisticsMap: {
            [userId: string]: UserStatistics
        } = {};

        for (const subscription of subscriptions) {
            userStatisticsMap[subscription.subscribedUser.id] = await this.userStatisticsRepository.findByUser(subscription.subscribedUser);
        }

        return subscriptions.map(subscription => subscription.subscribedUser)
            .map(user => this.usersMapper.toUserResponse(
                user,
                userStatisticsMap[user.id]
            ));
    }

    public async getFollowingOfUser(address: string): Promise<UserResponse[]> {
        const subscribedUser = await this.findUserByAddressOrUsername(address);
        const subscriptions = await this.userSubscriptionsRepository.findAllBySubscribedUserNotReverted(subscribedUser);

        const userStatisticsMap: {
            [userId: string]: UserStatistics
        } = {};

        for (const subscription of subscriptions) {
            userStatisticsMap[subscription.subscribedUser.id] = await this.userStatisticsRepository.findByUser(subscription.subscribedTo);
        }

        return subscriptions.map(subscription => subscription.subscribedTo)
            .map(user => this.usersMapper.toUserResponse(
                user,
                userStatisticsMap[user.id]
            ));
    }

    private async findUserByAddressOrUsername(addressOrUsername: string): Promise<User> {
        let user = await this.usersRepository.findByEthereumAddress(addressOrUsername);

        if (!user) {
            user = await this.usersRepository.findByUsername(addressOrUsername);
        }

        if (!user) {
            throw new HttpException(`Could not find user with address or username ${addressOrUsername}`, HttpStatus.NOT_FOUND);
        }

        return user;
    }
}
