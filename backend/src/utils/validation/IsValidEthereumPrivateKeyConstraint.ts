import {ValidatorConstraintInterface, ValidationArguments, ValidatorConstraint} from "class-validator";
import Web3 from "web3";

@ValidatorConstraint({
    name: "isValidEthereumPrivateKey",
    async: false
})
export class IsValidEthereumPrivateKeyConstraint implements ValidatorConstraintInterface {
    public defaultMessage(validationArguments?: ValidationArguments): string {
        return "Invalid Ethereum private key";
    }

    public validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> | boolean {
        try {
            const web3 = new Web3();
            const [address] = validationArguments.constraints;
            const wallet = web3.eth.accounts.privateKeyToAccount(value);
            return wallet.address === address;
        } catch (error) {
            return false;
        }
    }

}
