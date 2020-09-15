import {EntityRepository, Repository} from "typeorm";
import {SignUpReference} from "./entities/SignUpReference";

@EntityRepository(SignUpReference)
export class SignUpReferencesRepository extends Repository<SignUpReference> {
    public findById(id: string): Promise<SignUpReference | undefined> {
        return this.findOne({
            where: {
                id
            }
        })
    }

    public findAll(): Promise<SignUpReference[]> {
        return this.find();
    }
}
