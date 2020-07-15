import {CurrentUserHolder} from "./CurrentUserHolder";
import {User} from "../../users/entities";

export abstract class ValidatedObjectWithCurrentUser implements CurrentUserHolder {
    private currentUser?: User;

    public getCurrentUser(): User | undefined | null {
        return this.currentUser;
    }

    public setCurrentUser(user?: User): void {
        this.currentUser = user;
    }
}
