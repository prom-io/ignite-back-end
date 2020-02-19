import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {UserSubscriptionsRepository} from "./UserSubscriptionsRepository";
import {UserSubscriptionsMapper} from "./UserSubscriptionsMapper";
import {CreateUserSubscriptionRequest} from "./types/request";
import {UserSubscriptionResponse} from "./types/response";
import {UsersRepository} from "../users/UsersRepository";
import {User} from "../users/entities";
import {PaginationRequest} from "../utils/pagination";

@Injectable()
export class UserSubscriptionsService {
    constructor(private readonly userSubscriptionsRepository: UserSubscriptionsRepository,
                private readonly usersRepository: UsersRepository,
                private readonly userSubscriptionsMapper: UserSubscriptionsMapper) {
    }

    public async createUserSubscription(createUserSubscriptionRequest: CreateUserSubscriptionRequest,
                                        currentUser: User): Promise<UserSubscriptionResponse> {
        const subscribedToUser = await this.usersRepository.findByEthereumAddress(createUserSubscriptionRequest.subscribeToAddress);

        if (!subscribedToUser) {
            throw new HttpException(
                `Could not find user with address ${createUserSubscriptionRequest.subscribeToAddress}`,
                HttpStatus.NOT_FOUND
            );
        }

        if (await this.userSubscriptionsRepository.existsBySubscribedUserAndSubscribedTo(currentUser, subscribedToUser)) {
            throw new HttpException(
                `Current user is already subscribed to ${subscribedToUser.ethereumAddress}`,
                HttpStatus.CONFLICT
            );
        }

        let subscription = this.userSubscriptionsMapper.fromCreateUserSubscriptionRequest(
            createUserSubscriptionRequest,
            currentUser,
            subscribedToUser
        );
        subscription = await this.userSubscriptionsRepository.save(subscription);

        return this.userSubscriptionsMapper.toUserSubscriptionResponse(subscription);
    }

    public async getSubscriptionsOfCurrentUser(currentUser: User, paginationRequest: PaginationRequest): Promise<UserSubscriptionResponse[]> {
        const subscriptions = await this.userSubscriptionsRepository.findBySubscribedUser(currentUser, paginationRequest);
        return subscriptions.map(subscription => this.userSubscriptionsMapper.toUserSubscriptionResponse(subscription));
    }

    public async getSubscriptionsByUser(userAddress: string, paginationRequest: PaginationRequest): Promise<UserSubscriptionResponse[]> {
        const user = await this.usersRepository.findByEthereumAddress(userAddress);

        if (!user) {
            throw new HttpException(
                `User with ${userAddress} was not found`,
                HttpStatus.NOT_FOUND
            );
        }

        const subscriptions = await this.userSubscriptionsRepository.findBySubscribedUser(user, paginationRequest);
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
}
