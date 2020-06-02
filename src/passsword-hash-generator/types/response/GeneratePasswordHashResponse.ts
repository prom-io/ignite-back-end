import {Expose} from "class-transformer";

export class GeneratePasswordHashResponse {
    @Expose({name: "password_hash"})
    passwordHash: string;

    constructor(plainObject: GeneratePasswordHashResponse) {
        Object.assign(this, plainObject);
    }
}
