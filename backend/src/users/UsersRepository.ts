import {Repository, EntityRepository, In} from "typeorm";
import {User} from "./entities";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    public findByUsername(username: string): Promise<User | undefined> {
        return this.findOne({
            where: {
                username
            }
        })
    }

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

    public findById(id: string): Promise<User | undefined> {
        return this.findOne({
            where: {
                id
            }
        })
    }

    public async existsByUsername(username: string): Promise<boolean> {
        return (await this.count({
            where: {
                username
            }
        })) !== 0;
    }
}
