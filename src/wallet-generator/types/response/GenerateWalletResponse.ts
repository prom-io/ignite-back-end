import {Expose} from "class-transformer";

export interface IGenerateWalletResponse {
    address: string,
    publicKey: string,
    privateKey: string
}

export class GenerateWalletResponse implements IGenerateWalletResponse {
    address: string;

    @Expose({name: "public_key"})
    publicKey: string;

    @Expose({name: "private_key"})
    privateKey: string;

    constructor(plainObject: IGenerateWalletResponse) {
        Object.assign(this, plainObject);
    }
}
