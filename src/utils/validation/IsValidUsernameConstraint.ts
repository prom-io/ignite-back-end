import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";
import {User} from "../../users/entities";
import {UpdateUserRequest} from "../../users/types/request";

@ValidatorConstraint({
    name: "isValidUsernameConstraint",
    async: true
})
export class IsValidUsernameConstraint implements ValidatorConstraintInterface {
    private static readonly USERNAME_REGEXP = /^[a-zA-Z0-9_\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF\u4e00-\u9eff]+$/;

    public defaultMessage(validationArguments?: ValidationArguments): string {
        return "Username contains invalid characters";
    }

    public async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const username = value as string;
        const object = validationArguments.object;

        let currentUser: User | null;

        if (object instanceof UpdateUserRequest && object.getCurrentUser()) {
            currentUser = object.getCurrentUser();
        }

        if (currentUser && currentUser.username === username) {
            return true;
        }

        return !username.includes("@") && IsValidUsernameConstraint.USERNAME_REGEXP.test(username);
    }
}
