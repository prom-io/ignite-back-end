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
            const [relatedPropertyName] = validationArguments.constraints;
            const address = (validationArguments.object as any)[relatedPropertyName];
            let privateKey = value;

            if (!privateKey.startsWith("0x")) {
                privateKey = `0x${privateKey}`;
            }

            const wallet = web3.eth.accounts.privateKeyToAccount(privateKey);
            return wallet.address === address;
        } catch (error) {
            return false;
        }
    }

}
