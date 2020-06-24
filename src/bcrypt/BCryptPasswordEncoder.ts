import {Injectable} from "@nestjs/common";
import {hashSync, compareSync, getRounds} from "bcrypt";
import has = Reflect.has;

@Injectable()
export class BCryptPasswordEncoder {

    public encode(data: string, rounds: number | undefined = 12): string {
        return hashSync(data, rounds);
    }

    public matches(data: string, hashToCompare: string): boolean {
        return compareSync(data, hashToCompare);
    }

    public isHashValid(hash: string): boolean {
        try {
            getRounds(hash);
            return true;
        } catch (error) {
            return false;
        }
    }
}
