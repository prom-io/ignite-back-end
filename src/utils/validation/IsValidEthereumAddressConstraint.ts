import {ValidationArguments, ValidatorConstraintInterface} from "class-validator";

export class IsValidEthereumAddressConstraint implements ValidatorConstraintInterface {
    public defaultMessage(validationArguments?: ValidationArguments): string {
        return "Invalid Ethereum address";
    }

    public validate(value: any, validationArguments?: ValidationArguments): boolean {
        let address = value as string;

        if (!address.startsWith("0x")) {
            address = `0x${address}`;
        }

        const regExp = new RegExp("^0x[a-fA-F0-9]{40}$");

        return regExp.test(address);
    }

}
