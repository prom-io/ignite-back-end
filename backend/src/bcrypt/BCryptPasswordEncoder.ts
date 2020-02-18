import {Injectable} from "@nestjs/common";
import {hashSync, compareSync} from "bcrypt";

@Injectable()
export class BCryptPasswordEncoder {

    public encode(data: string, rounds: number | undefined = 12): string {
        return hashSync(data, rounds);
    }

    public matches(data: string, hashToCompare: string): boolean {
        return compareSync(data, hashToCompare);
    }
}
