import {User} from "../../users/entities";

export interface CurrentUserHolder {
    getCurrentUser(): User | undefined | null;
    setCurrentUser(user?: User): void;
}
