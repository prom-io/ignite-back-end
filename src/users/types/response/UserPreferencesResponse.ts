import {Language} from "../../entities";

export class UserPreferencesResponse {
    language: Language;

    constructor(plainObject: UserPreferencesResponse) {
        Object.assign(this, plainObject);
    }
}
