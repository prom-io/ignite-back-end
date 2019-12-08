import {Injectable} from "@nestjs/common";
import DataStore from "nedb";
import {PrivateKey, EntityType} from "../model/entity";

@Injectable()
export class PrivateKeyRepository {
    constructor(private readonly dataStore: DataStore) {}

    public save(privateKey: PrivateKey): Promise<PrivateKey> {
        return new Promise<PrivateKey>(resolve => {
            this.dataStore.insert<PrivateKey>(privateKey, (error, saved) => resolve(saved));
        })
    }

    public findByDataOwnerAddress(dataOwnerAddress: string): Promise<PrivateKey | undefined> {
        return new Promise<PrivateKey | undefined>(resolve => {
            this.dataStore.findOne({
                _type: EntityType.PRIVATE_KEY,
                dataOwnerAddress
            }, (_, document) => resolve(document));
        })
    }
}
