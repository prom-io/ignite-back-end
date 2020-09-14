import {EntityRepository, Repository} from "typeorm";
import {SignUpReference} from "./entities/SignUpReference";

@EntityRepository(SignUpReference)
export class SignUpReferencesRepository extends Repository<SignUpReference> {
    public async findById(id: string): Promise<SignUpReference | undefined> {
        return await this.findOne({
            where: {
                id
            }
        })
    }

    public async findAll(): Promise<SignUpReference[]> {
        return await this.find();
    }
}
