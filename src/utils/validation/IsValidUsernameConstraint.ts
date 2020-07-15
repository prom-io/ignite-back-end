import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({
    name: "isValidUsernameConstraint",
    async: false
})
export class IsValidUsernameConstraint implements ValidatorConstraintInterface {
    private static readonly USERNAME_REGEXP = /^[a-zA-Z0-9_\u1100-\u11FF\u3130-\u318F\uA960-\uA97F\uAC00-\uD7AF\uD7B0-\uD7FF\u4e00-\u9eff]+$/;

    public defaultMessage(validationArguments?: ValidationArguments): string {
        return "Username contains invalid characters";
    }

    public validate(value: any, validationArguments?: ValidationArguments): boolean {
        const username = value as string;
        return !username.includes("@") && IsValidUsernameConstraint.USERNAME_REGEXP.test(username);
    }

}
