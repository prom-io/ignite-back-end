import {registerDecorator, ValidationOptions} from "class-validator";
import {IsValidEthereumPrivateKeyConstraint} from "./IsValidEthereumPrivateKeyConstraint";

export const IsValidEthereumPrivateKey = (
    addressProperty: string,
    options?: ValidationOptions
) => (
    object: object,
    propertyName: string
) => registerDecorator({
    name: "isValidEthereumPrivateKey",
    target: object.constructor,
    propertyName,
    options,
    constraints: [addressProperty],
    validator: IsValidEthereumPrivateKeyConstraint,
    async: false
});
