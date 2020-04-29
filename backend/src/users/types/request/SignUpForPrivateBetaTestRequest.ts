import {IsEmail, IsNotEmpty} from "class-validator";

export class SignUpForPrivateBetaTestRequest {

    @IsNotEmpty({message: "Email must be present"})
    @IsEmail({}, {message: "Email must be valid"})
    public email: string;
}
