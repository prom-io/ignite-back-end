import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {User} from "./entities";
import {UsersRepository} from "./UsersRepository";
import {UserStatisticsRepository} from "./UserStatisticsRepository";
import {UsersMapper} from "./UsersMapper";
import {CreateUserRequest, SignUpForPrivateBetaTestRequest, UpdateUserRequest, UsernameAvailabilityResponse} from "./types/request";
import {UserResponse} from "./types/response";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {MailerService} from "@nestjs-modules/mailer";
import {LoggerService} from "nest-logger";
import {config} from "../config";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {MediaAttachment} from "../media-attachments/entities";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly mediaAttachmentsRepository: MediaAttachmentsRepository,
                private readonly mailerService: MailerService,
                private readonly usersMapper: UsersMapper,
                private readonly log: LoggerService) {
    }

    public async signUpForPrivateBeta(signUpForPrivateBetaTestRequest: SignUpForPrivateBetaTestRequest): Promise<void> {
        this.mailerService.sendMail({
            from: config.EMAIL_USERNAME,
            to: config.EMAIL_ADDRESS_TO_SEND,
            text: signUpForPrivateBetaTestRequest.email
        })
            .then(() => this.log.info(`Email address ${signUpForPrivateBetaTestRequest.email} has been sent`))
            .catch(error => {
                this.log.error(`Error occurred when tried send address ${signUpForPrivateBetaTestRequest.email}`);
                console.log(error);
            })
    }

    public async saveUser(createUserRequest: CreateUserRequest): Promise<UserResponse> {
        if (!createUserRequest.privateKey.startsWith("0x")) {
            createUserRequest.privateKey = `0x${createUserRequest.privateKey}`;
        }

        const existingUser = await this.usersRepository.findByEthereumAddress(createUserRequest.address);

        if (createUserRequest.username && createUserRequest.username !== createUserRequest.address) {
            if (await this.usersRepository.existsByUsername(createUserRequest.username)) {
                throw new HttpException(
                    `User with ${createUserRequest.username} has already been registered`,
                    HttpStatus.CONFLICT
                )
            }
        }

        if (existingUser) {
            if (existingUser.username !== createUserRequest.username) {
                existingUser.username = createUserRequest.username && createUserRequest.username.length !== 0
                    ? createUserRequest.username
                    : createUserRequest.address;
                await this.usersRepository.save(existingUser);
                return this.usersMapper.toUserResponse(existingUser);
            }

            return this.usersMapper.toUserResponse(existingUser);
        }

        const user = await this.usersRepository.save(this.usersMapper.fromCreateUserRequest(createUserRequest));

        return this.usersMapper.toUserResponse(
            user, {
                followsCount: 0,
                followersCount: 0,
                statusesCount: 0,
                user,
                id: ""
            }
        );
    }

    public async isUsernameAvailable(username: string): Promise<UsernameAvailabilityResponse> {
        const existsByUsername  = await this.usersRepository.existsByUsername(username);

        if (existsByUsername) {
            return {available: false};
        }

        const existsByEthereumAddress = await this.usersRepository.existsByEthereumAddress(username);

        if (existsByEthereumAddress) {
            return {available: false};
        }

        return {available: true};
    }

    public async getCurrentUser(user: User): Promise<UserResponse> {
        return this.usersMapper.toUserResponse(user, await this.userStatisticsRepository.findByUser(user))
    }

    public async updateUser(ethereumAddress: string, updateUserRequest: UpdateUserRequest, currentUser: User): Promise<UserResponse> {
        let user = await this.findUserEntityByEthereumAddress(ethereumAddress);

        if (user.id !== currentUser.id) {
            throw new HttpException(
                `Users can only update themselves`,
                HttpStatus.FORBIDDEN
            )
        }

        if (updateUserRequest.username && user.username !== updateUserRequest.username && user.ethereumAddress !== updateUserRequest.username) {
            if (await this.usersRepository.existsByUsername(updateUserRequest.username)
                || await this.usersRepository.existsByEthereumAddress(updateUserRequest.username)) {
                throw new HttpException(
                    `Username ${updateUserRequest.username} has already been taken`,
                    HttpStatus.CONFLICT
                )
            }
        }

        const avatar = updateUserRequest.avatarId && await this.findMediaAttachmentById(updateUserRequest.avatarId);

        user.username = updateUserRequest.username;
        user.bio = updateUserRequest.bio;
        user.displayedName = updateUserRequest.displayName;
        user.avatar = avatar;

        user = await this.usersRepository.save(user);

        const userStatistics = await this.userStatisticsRepository.findByUser(user);
        const following = currentUser && await this.subscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(
            currentUser,
            user
        );
        const followed = currentUser && await this.subscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(
            user,
            currentUser
        );

        return this.usersMapper.toUserResponse(user, userStatistics, following, followed);
    }

    private async findMediaAttachmentById(id: string): Promise<MediaAttachment> {
        const mediaAttachment = await this.mediaAttachmentsRepository.findById(id);

        if (!mediaAttachment) {
            throw new HttpException(
                `Could not find media attachment with id ${id}`,
                HttpStatus.NOT_FOUND
            )
        }

        return mediaAttachment;
    }

    public async findUserByEthereumAddress(address: string): Promise<UserResponse> {
        const user = await this.findUserEntityByEthereumAddress(address);
        const userStatistics = await this.userStatisticsRepository.findByUser(user);

        return this.usersMapper.toUserResponse(user, userStatistics);
    }

    public async findUserEntityByEthereumAddress(address: string): Promise<User> {
        const user = await this.usersRepository.findByEthereumAddress(address);

        if (user === undefined) {
            throw new HttpException(`Could not find user with address ${address}`, HttpStatus.NOT_FOUND);
        }

        return user;
    }

    public async getUserProfile(address: string, currentUser?: User): Promise<UserResponse> {
        let user = await this.usersRepository.findByUsername(address);

        if (!user) {
            user = await this.usersRepository.findByEthereumAddress(address);
        }

        if (!user) {
            throw new HttpException(`Could not find user with address or username ${address}`, HttpStatus.NOT_FOUND);
        }

        const userStatistics = await this.userStatisticsRepository.findByUser(user);
        const following = currentUser && await this.subscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(
            currentUser,
            user
        );
        const followed = currentUser && await this.subscriptionsRepository.existsBySubscribedUserAndSubscribedToNotReverted(
            user,
            currentUser
        );

        return this.usersMapper.toUserResponse(user, userStatistics, following, followed);
    }

    public async getCurrentUserProfile(currentUser: User): Promise<UserResponse> {
        const userStatistics = await this.userStatisticsRepository.findByUser(currentUser);
        return this.usersMapper.toUserResponse(currentUser, userStatistics);
    }
}
