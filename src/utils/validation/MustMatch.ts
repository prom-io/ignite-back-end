import {registerDecorator, ValidationOptions} from "class-validator";
import {MustMatchConstraint} from "./MustMatchConstraint";

export const MustMatch = (
    relatedProperty: string,
    options?: ValidationOptions
) => (
    object: object,
    propertyName: string
) => registerDecorator({
    name: "mustMatch",
    async: false,
    target: object.constructor,
    propertyName,
    options,
    validator: MustMatchConstraint,
    constraints: [relatedProperty]
});
