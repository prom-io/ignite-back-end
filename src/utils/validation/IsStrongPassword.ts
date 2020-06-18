import {registerDecorator, ValidationOptions} from "class-validator";
import {IsStrongPasswordConstraint} from "./IsStrongPasswordConstraint";

export const IsStrongPassword = (
    options?: ValidationOptions
) => (
    object: object,
    propertyName: string
) => registerDecorator({
    name: "IsStrongPassword",
    target: object.constructor,
    propertyName,
    options,
    validator: IsStrongPasswordConstraint,
    async: false,
    constraints: [false]
});
