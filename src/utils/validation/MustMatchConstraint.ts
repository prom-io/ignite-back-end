import {ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface} from "class-validator";

@ValidatorConstraint({
    name: "mustMatchConstraint",
    async: false
})
export class MustMatchConstraint implements ValidatorConstraintInterface {
    public defaultMessage(validationArguments?: ValidationArguments): string {
        return "Properties do not match";
    }

    public validate(value: any, validationArguments?: ValidationArguments): boolean {
        const [relatedPropertyName] = validationArguments.constraints;
        const relatedPropertyValue = (validationArguments.object as any)[relatedPropertyName];

        return value === relatedPropertyValue;
    }
}
