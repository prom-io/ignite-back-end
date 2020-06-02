import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {Language, User, UserPreferences} from "./entities";
import {UsersRepository} from "./UsersRepository";
import {UserStatisticsRepository} from "./UserStatisticsRepository";
import {UserPreferencesRepository} from "./UserPreferencesRepository";
import {UsersMapper} from "./UsersMapper";
import {
    CreateUserRequest,
    SignUpForPrivateBetaTestRequest,
    SignUpRequest,
    UpdatePreferencesRequest,
    UpdateUserRequest,
    UsernameAvailabilityResponse
} from "./types/request";
import {UserPreferencesResponse, UserResponse} from "./types/response";
import {UserSubscriptionsRepository} from "../user-subscriptions/UserSubscriptionsRepository";
import {MailerService} from "@nestjs-modules/mailer";
import {LoggerService} from "nest-logger";
import {config} from "../config";
import {MediaAttachmentsRepository} from "../media-attachments/MediaAttachmentsRepository";
import {MediaAttachment} from "../media-attachments/entities";
import {BCryptPasswordEncoder} from "../bcrypt";
import {PaginationRequest} from "../utils/pagination";
import {asyncMap} from "../utils/async-map";
import {PasswordHashApiClient} from "../password-hash-api";

@Injectable()
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository,
                private readonly userStatisticsRepository: UserStatisticsRepository,
                private readonly userPreferencesRepository: UserPreferencesRepository,
                private readonly subscriptionsRepository: UserSubscriptionsRepository,
                private readonly mediaAttachmentsRepository: MediaAttachmentsRepository,
                private readonly mailerService: MailerService,
                private readonly usersMapper: UsersMapper,
                private readonly passwordEncoder: BCryptPasswordEncoder,
                private readonly passwordHashApiClient: PasswordHashApiClient,
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

    public async signUp(signUpRequest: SignUpRequest): Promise<void> {
        if (!signUpRequest.transactionId) {
            await this.registerUserWithGeneratedWallet(
                signUpRequest.walletAddress!,
                signUpRequest.privateKey!,
                signUpRequest.password!,
                signUpRequest.language
            )
        } else {
            await this.registerUserByTransactionId(signUpRequest.transactionId!, signUpRequest.language);
        }
    }

    private async registerUserWithGeneratedWallet(ethereumAddress: string, privateKey: string, password: string, language?: Language) {
        let user = await this.usersRepository.findByEthereumAddress(ethereumAddress);
        if (user) {
            user.privateKey = this.passwordEncoder.encode(password, 12);
            user = await this.usersRepository.save(user);

            if (!user.preferences) {
                const userPreferences: UserPreferences = {
                    id: uuid(),
                    language: language || Language.ENGLISH,
                    user
                };
                await this.userPreferencesRepository.save(userPreferences)
            }

        } else {
            user = {
                id: uuid(),
                ethereumAddress,
                username: ethereumAddress,
                displayedName: ethereumAddress,
                privateKey: this.passwordEncoder.encode(password, 12),
                remote: false,
                createdAt: new Date()
            };
            await this.usersRepository.save(user);

            const userPreferences: UserPreferences = {
                id: uuid(),
                user,
                language: language || Language.ENGLISH
            };
            await this.userPreferencesRepository.save(userPreferences);
        }

        try {
            await this.passwordHashApiClient.setPasswordHash({
                address: user.ethereumAddress,
                passwordHash: user.privateKey, // this is actually a password hash
                privateKey
            })
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    private async registerUserByTransactionId(transactionId: string, language?: Language): Promise<void> {
        try {
            const passwordHashResponse = (await this.passwordHashApiClient.getPasswordHashByTransaction(transactionId)).data;
            const {hash, address: ethereumAddress} = passwordHashResponse;

            let user = await this.usersRepository.findByEthereumAddress(ethereumAddress);

            if (!this.passwordEncoder.isHashValid(hash)) {
                throw new HttpException(
                    `Provided password hash ${hash} is not a valid BCrypt hash`,
                    HttpStatus.BAD_REQUEST
                )
            }

            if (user) {
                user.privateKey = hash;
                user = await this.usersRepository.save(user);

                if (!user.preferences) {
                    const userPreferences: UserPreferences = {
                        id: uuid(),
                        language: language || Language.ENGLISH,
                        user
                    };
                    await this.userPreferencesRepository.save(userPreferences)
                }
            } else {
                user = {
                    id: uuid(),
                    ethereumAddress,
                    username: ethereumAddress,
                    displayedName: ethereumAddress,
                    privateKey: hash,
                    remote: false,
                    createdAt: new Date()
                };
                await this.usersRepository.save(user);

                const userPreferences: UserPreferences = {
                    id: uuid(),
                    user,
                    language: language || Language.ENGLISH
                };
                await this.userPreferencesRepository.save(userPreferences);
            }
        } catch (error) {
            if (!(error instanceof HttpException)) {
                console.log(error);
            }

            throw error;
        }
    }

    public async getPreferencesOfCurrentUser(currentUser: User): Promise<UserPreferencesResponse> {
        const preferences = await this.userPreferencesRepository.findByUser(currentUser);
        return new UserPreferencesResponse({
            language: preferences ? preferences.language : Language.ENGLISH
        });
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
        const existsByUsername = await this.usersRepository.existsByUsername(username);

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

        if (updateUserRequest.preferences) {
            let preferences: UserPreferences;

            if (user.preferences) {
                preferences = user.preferences;
                preferences.language = updateUserRequest.preferences.language;
                preferences = await this.userPreferencesRepository.save(preferences);
            } else {
                preferences = {
                    id: uuid(),
                    language: updateUserRequest.preferences.language,
                    user
                };
                preferences = await this.userPreferencesRepository.save(preferences);
            }

            user.preferences = preferences;
        }

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

    public async updateUserPreferences(updatePreferencesRequest: UpdatePreferencesRequest, currentUser: User): Promise<UserPreferencesResponse> {
        let preferences = currentUser.preferences;

        if (preferences) {
            preferences.language = updatePreferencesRequest.language;
        } else {
            preferences = {
                id: uuid(),
                user: currentUser,
                language: updatePreferencesRequest.language
            };
        }

        preferences = await this.userPreferencesRepository.save(preferences);
        return new UserPreferencesResponse({language: preferences.language});
    }

    public async findUserByEthereumAddress(address: string, currentUser?: User): Promise<UserResponse> {
        const user = await this.findUserEntityByEthereumAddress(address);

        return this.usersMapper.toUserResponseAsync(user, currentUser);
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

        return await this.usersMapper.toUserResponseAsync(user, currentUser);
    }

    public async getCurrentUserProfile(currentUser: User): Promise<UserResponse> {
        const userStatistics = await this.userStatisticsRepository.findByUser(currentUser);
        return this.usersMapper.toUserResponse(currentUser, userStatistics);
    }

    public async getFollowRecommendations(paginationRequest: PaginationRequest, currentUser: User, language?: Language): Promise<UserResponse[]> {
        const subscriptions = await this.subscriptionsRepository.findAllBySubscribedUserNotReverted(currentUser);
        const users = subscriptions.map(subscription => subscription.subscribedTo);

        let whoToFollow: User[];

        if (users.length === 0) {
            whoToFollow = await this.usersRepository.findMostPopular(paginationRequest);
        } else {
            whoToFollow = await this.usersRepository.findMostPopularNotIn(users, paginationRequest);
        }

        return asyncMap(whoToFollow, async user => await this.usersMapper.toUserResponseAsync(user, currentUser));
    }
}
