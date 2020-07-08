import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({
    name: "isValidUsernameConstraint",
    async: false
})
export class IsValidUsernameConstraint implements ValidatorConstraintInterface {
    private static readonly USERNAME_REGEXP = /^[a-zA-Z0-9\u3130-\u318F\uAC00-\uD7AF\u4E00-\u9FFF\u3400-\u4DBF\u20000-\u2A6DF\u2A700-\u2B73F\u2B740-\u2B81F\u2B820-\u2CEAF\uF900-\uFAFF\u2F800-\u2FA1F_]+$/;

    public defaultMessage(validationArguments?: ValidationArguments): string {
        return "Username contains invalid characters";
    }

    public validate(value: any, validationArguments?: ValidationArguments): boolean {
        const username = value as string;
        return !username.includes("@") && IsValidUsernameConstraint.USERNAME_REGEXP.test(username);
    }

}
