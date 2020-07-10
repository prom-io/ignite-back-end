import {Injectable} from "@nestjs/common";
import {SignUpReference} from "./entities/SignUpReference";
import {SignUpReferenceConfigResponse, SignUpReferenceResponse} from "./types/response";
import {UsersMapper} from "./UsersMapper";
import {User} from "./entities";
import {config} from "../config";

@Injectable()
export class SignUpReferencesMapper {
    constructor(private readonly usersMapper: UsersMapper) {
    }

    public async toSignUpReferenceResponse(signUpReference: SignUpReference, currentUser?: User): Promise<SignUpReferenceResponse> {
        return new SignUpReferenceResponse({
            id: signUpReference.id,
            config: new SignUpReferenceConfigResponse(signUpReference.config),
            createdAt: signUpReference.createdAt,
            expiresAt: signUpReference.expiresAt,
            createdBy: await this.usersMapper.toUserResponseAsync(signUpReference.createdBy, currentUser),
            maxUses: signUpReference.maxUses,
            registeredUsersCount: signUpReference.registeredUsersCount,
            url: `${config.HOST}/sign-up?reference_id=${signUpReference.id}`
        });
    }
}
