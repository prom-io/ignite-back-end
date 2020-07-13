import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {SignUpReferencesRepository} from "./SignUpReferencesRepository";
import {UsersRepository} from "./UsersRepository";
import {SignUpReferencesMapper} from "./SignUpReferencesMapper";
import {CreateSignUpReferenceRequest} from "./types/request";
import {SignUpReferenceResponse, UserResponse} from "./types/response";
import {User} from "./entities";
import {SignUpReference} from "./entities/SignUpReference";
import {asyncMap} from "../utils/async-map";
import {config} from "../config";
import {AccountsToSubscribe} from "./types/AccountsToSubscribe";
import {UsersMapper} from "./UsersMapper";

@Injectable()
export class SignUpReferencesService {
    constructor(private readonly signUpReferenceRepository: SignUpReferencesRepository,
                private readonly usersRepository: UsersRepository,
                private readonly signUpReferencesMapper: SignUpReferencesMapper,
                private readonly usersMapper: UsersMapper) {
    }

    public async createSignUpReference(createSignUpReferenceRequest: CreateSignUpReferenceRequest,
                                       currentUser: User): Promise<SignUpReferenceResponse> {
        if (createSignUpReferenceRequest.config.accountsToSubscribe && createSignUpReferenceRequest.config.accountsToSubscribe.length !== 0) {
            if (config.ENABLE_ACCOUNTS_SUBSCRIPTION_UPON_SIGN_UP) {
                const configuredAccountsToSubscribe: AccountsToSubscribe = require("../../accounts-to-subscribe.json");
                createSignUpReferenceRequest.config.accountsToSubscribe = createSignUpReferenceRequest.config.accountsToSubscribe
                    .filter(address => !configuredAccountsToSubscribe.english.includes(address)
                        && !configuredAccountsToSubscribe.korean.includes(address));
            }
        }

        let signUpReference: SignUpReference = {
            id: uuid(),
            registeredUsersCount: 0,
            maxUses: createSignUpReferenceRequest.maxUses,
            createdBy: currentUser,
            expiresAt: createSignUpReferenceRequest.expiresAt,
            createdAt: new Date(),
            config: createSignUpReferenceRequest.config
        };
        signUpReference = await this.signUpReferenceRepository.save(signUpReference);

        return await this.signUpReferencesMapper.toSignUpReferenceResponse(signUpReference, currentUser);
    }

    public async findAllSignUpReferences(currentUser: User): Promise<SignUpReferenceResponse[]> {
        const signUpReferences = await this.signUpReferenceRepository.findAll();

        return asyncMap(
            signUpReferences,
            async signUpReference => await this.signUpReferencesMapper.toSignUpReferenceResponse(signUpReference, currentUser)
        );
    }

    public async findUsersBySignUpReference(signUpReferenceId: string, currentUser: User): Promise<UserResponse[]> {
        const signUpReference = await this.signUpReferenceRepository.findById(signUpReferenceId);

        if (!signUpReference) {
            throw new HttpException(
                `Could not find sign up reference with id ${signUpReferenceId}`,
                HttpStatus.NOT_FOUND
            );
        }

        const users = await this.usersRepository.findBySignUpReference(signUpReference);

        return await asyncMap(users, user => this.usersMapper.toUserResponseAsync(user, currentUser));
    }

    public async findSignUpReferenceById(id: string, currentUser: User): Promise<SignUpReferenceResponse> {
        const signUpReference = await this.signUpReferenceRepository.findById(id);

        if (!signUpReference) {
            throw new HttpException(
                `Could not find sign up reference with id ${id}`,
                HttpStatus.NOT_FOUND
            );
        }

        return this.signUpReferencesMapper.toSignUpReferenceResponse(signUpReference, currentUser);
    }
}
