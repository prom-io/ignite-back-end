import {Injectable} from "@nestjs/common";
import DataStore from "nedb";
import {File, EntityType} from "../model/entity";

@Injectable()
export class FilesRepository {
    constructor(private readonly dataStore: DataStore) {}

    public save(file: File): Promise<File> {
        return new Promise<File>(resolve => {
            this.dataStore.findOne<File>({_id: file._id, _type: EntityType.FILE}, (_, document) => {
                if (document === null) {
                    this.dataStore.insert<File>(file, (error, saved) => resolve(saved));
                } else {
                    this.dataStore.update<File>(document, file, {}, () => resolve(file));
                }
            })
        })
    }

    public findAll(): Promise<File[]> {
        return new Promise<File[]>(resolve => {
            this.dataStore.find<File>({_type: EntityType.ACCOUNT}, (_, documents) => resolve(documents));
        })
    }
}
