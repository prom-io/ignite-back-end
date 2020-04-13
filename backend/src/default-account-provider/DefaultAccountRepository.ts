import {Injectable} from "@nestjs/common";
import DataStore from "nedb";
import {Account} from "../accounts/types/entity";
import {EntityType} from "../nedb/entity";

@Injectable()
export class DefaultAccountRepository {
    constructor(private readonly dataStore: DataStore) {
        console.log("Creating DefaultProviderRepository")
    }

    public getDefaultAccount(): Promise<Account | undefined> {
        return new Promise<Account | undefined>(resolve => {
            this.dataStore.findOne<Account>({
                _type: EntityType.ACCOUNT,
                default: true
            }, (_, document) => {
                resolve(document);
            })
        })
    }

    public findAll(): Promise<Account[]> {
        return new Promise<Account[]>(resolve => {
            this.dataStore.find<Account>({
                _type: EntityType.ACCOUNT
            }, (_, documents) => resolve(documents));
        })
    }

    public save(account: Account): Promise<Account> {
        return new Promise<Account>(resolve => {
            this.dataStore.findOne<Account>({_id: account._id, _type: EntityType.ACCOUNT}, (_, document) => {
                if (document === null) {
                    this.dataStore.insert<Account>(account, (error, saved) => resolve(saved));
                } else {
                    this.dataStore.update<Account>(document, account, {}, () => resolve(account));
                }
            })
        })
    }
}
