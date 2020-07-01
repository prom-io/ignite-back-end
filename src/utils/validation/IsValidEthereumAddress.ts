import {registerDecorator, ValidationOptions} from "class-validator";
import {IsValidEthereumAddressConstraint} from "./IsValidEthereumAddressConstraint";

export const IsValidEthereumAddress = (
    options?: ValidationOptions
) => (
    object: object,
    propertyName: string
) => registerDecorator({
    name: "isValidEthereumAddress",
    target: object.constructor,
    propertyName,
    options,
    validator: IsValidEthereumAddressConstraint,
    async: false,
    constraints: [propertyName]
});
