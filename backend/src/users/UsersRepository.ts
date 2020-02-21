import {Repository, EntityRepository, In} from "typeorm";
import {User} from "./entities";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    public findByEthereumAddress(ethereumAddress: string): Promise<User | undefined> {
        return this.findOne({
            where: {
                ethereumAddress
            }
        })
    }

    public findAllByEthereumAddresses(addresses: string[]): Promise<User[]> {
        return this.find({
            where: {
                ethereumAddress: In(addresses)
            }
        })
    }
}
