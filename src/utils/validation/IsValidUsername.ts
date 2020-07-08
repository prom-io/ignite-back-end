import {registerDecorator, ValidationOptions} from "class-validator";
import {IsValidUsernameConstraint} from "./IsValidUsernameConstraint";
import {IsStrongPasswordConstraint} from "./IsStrongPasswordConstraint";

export const IsValidUsername = (
    options?: ValidationOptions
) => (
    object: object,
    propertyName: string
) => registerDecorator({
    name: "IsValidUsername",
    target: object.constructor,
    propertyName,
    options,
    validator: IsValidUsernameConstraint,
    async: false,
});
