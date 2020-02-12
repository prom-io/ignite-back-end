import {IsBase64, IsNotEmpty, IsString} from "class-validator";
import {EthereumSignature} from "../../../service-node-api/types/request";

export class PurchaseFileRequestSignature implements EthereumSignature {
    @IsNotEmpty({message: "Signed message must be present"})
    @IsString({message: "Signed message must be string"})
    @IsBase64({message: "Signed message must be encoded in base 64"})
    public message: string;

    @IsNotEmpty({message: "Message hash must be present"})
    @IsString({message: "Message hash must be string"})
    public messageHash: string;

    @IsNotEmpty({message: "'r' parameter must be present"})
    @IsString({message: "'r' parameter must be string"})
    public r: string;

    @IsNotEmpty({message: "'s' parameter must be present"})
    @IsString({message: "'s' parameter must be string"})
    public s: string;

    @IsNotEmpty({message: "Signature must be present"})
    @IsString({message: "Signature must be string"})
    public signature: string;

    @IsNotEmpty({message: "'v' parameter must be present"})
    @IsString({message: "'v' parameter must be string"})
    public v: string;

    @IsString()
    @IsNotEmpty()
    public address: string;

    constructor(message: string, messageHash: string, r: string, s: string, signature: string, v: string, address: string) {
        this.message = message;
        this.messageHash = messageHash;
        this.r = r;
        this.s = s;
        this.signature = signature;
        this.v = v;
        this.address = address;
    }
}
