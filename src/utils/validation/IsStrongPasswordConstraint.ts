import {ValidationArguments, ValidatorConstraintInterface} from "class-validator";

export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
    public defaultMessage(validationArguments?: ValidationArguments): string {
        return "Password is not strong enough";
    }

    public validate(value: any, validationArguments?: ValidationArguments): boolean {
        const password = value as string;
        const strongPasswordRegexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#\$%\^&\*])(?=.{8,})");
        return strongPasswordRegexp.test(password);
    }
}
