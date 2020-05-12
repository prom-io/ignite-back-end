import {IsNotEmpty, IsString} from "class-validator";

export class CreateBtfsCidRequest {
    @IsNotEmpty({message: "btfsCid must not be empty"})
    @IsString({message: "btfsCid must be string"})
    btfsCid: string;

    peerIp?: string;

    peerWallet?: string;
}
