import {Expose} from "class-transformer";
import {ISignUpReferenceConfig} from "../ISignUpReferenceConfig";

export class SignUpReferenceConfigResponse implements ISignUpReferenceConfig {
    @Expose({name: "accounts_to_subscribe"})
    accountsToSubscribe: string[];

    @Expose({name: "accounts_to_recommend"})
    accountsToRecommend: string[]

    constructor(plainObject: ISignUpReferenceConfig) {
        Object.assign(this, plainObject);
    }
}
