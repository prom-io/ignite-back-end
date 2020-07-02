import {ValidationArguments, ValidatorConstraintInterface} from "class-validator";
import Web3 from "web3";

export class IsStrongPasswordConstraint implements ValidatorConstraintInterface {
    public defaultMessage(validationArguments?: ValidationArguments): string {
        return "Password is not strong enough";
    }

    public validate(value: any, validationArguments?: ValidationArguments): boolean {
        const password = value as string;
        const strongPasswordRegexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#\$%\^&\*])(?=.{8,})");

        let result = strongPasswordRegexp.test(password);

        if (!result) {
            if (validationArguments.object && (validationArguments.object as any).walletAddress) {
                const walletAddress = (validationArguments.object as any).walletAddress as string;
                const web3 = new Web3();
                let potentialPrivateKey = value;

                if (!potentialPrivateKey.startsWith("0x")) {
                    potentialPrivateKey = `0x${potentialPrivateKey}`;
                }

                try {
                    const wallet = web3.eth.accounts.privateKeyToAccount(potentialPrivateKey);
                    result = wallet.address === walletAddress;
                } catch (error) {
                    result = false;
                }
            }
        }

        return result;
    }
}
