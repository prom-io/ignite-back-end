import {Injectable} from "@nestjs/common";
import DataStore from "nedb";
import {DataOwner, EntityType} from "../model/entity";

@Injectable()
export class DataOwnersRepository {
    constructor(private readonly dataStore: DataStore) {}

    public save(dataOwner: DataOwner): Promise<DataOwner> {
        return new Promise<DataOwner>(resolve => {
            if (dataOwner._id) {
                this.dataStore.update({_id: dataOwner._id}, dataOwner, {}, (_) => resolve(dataOwner));
            } else {
                this.dataStore.insert(dataOwner, (_, saved) => resolve(saved));
            }
        });
    }

    public findByAddress(address: string): Promise<DataOwner | null> {
        return new Promise<DataOwner>(resolve => {
            this.dataStore.findOne<DataOwner>({
                _type: EntityType.DATA_OWNER,
                address
            }, (_, document) => resolve(document));
        })
    }

    public findByDataValidatorAddress(dataValidatorAddress: string): Promise<DataOwner[]> {
        return new Promise<DataOwner[]>(resolve => {
            this.dataStore.find<DataOwner>({
                _type: EntityType.DATA_OWNER,
                dataValidatorAddress
            }, (_, documents) => resolve(documents))
        })
    }

    public findAll(): Promise<DataOwner[]> {
        return new Promise<DataOwner[]>(resolve => this.dataStore.find<DataOwner>(
            {_type: EntityType.DATA_OWNER},
            (_, documents) => resolve(documents))
        );
    }

    public findByFileId(fileId: string): Promise<DataOwner | undefined> {
        return new Promise<DataOwner | undefined>(resolve => {
            this.dataStore.findOne<DataOwner>({
                "_type": EntityType.DATA_OWNER,
                "file.id": fileId
            }, (_, document) => resolve(document))
        })
    }
}
