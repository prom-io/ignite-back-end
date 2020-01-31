import {Injectable} from "@nestjs/common";
import DataStore from "nedb";
import {ServiceNodeTemporaryFile} from "./types/entity";
import {EntityType} from "../nedb/entity";

@Injectable()
export class ServiceNodeTemporaryFilesRepository {
    constructor(private readonly dataStore: DataStore) {
    }

    public save(serviceNodeTemporaryFile: ServiceNodeTemporaryFile): Promise<ServiceNodeTemporaryFile> {
        return new Promise<ServiceNodeTemporaryFile>(resolve => {
            this.dataStore.findOne<ServiceNodeTemporaryFile>(
                {_id: serviceNodeTemporaryFile._id, type: EntityType.SERVICE_NODE_TEMPORARY_FILE},
                (_, document) => {
                    if (document === null) {
                        this.dataStore.insert<ServiceNodeTemporaryFile>(serviceNodeTemporaryFile, (_, saved) => resolve(saved));
                    } else {
                        this.dataStore.update<ServiceNodeTemporaryFile>(
                            document,
                            serviceNodeTemporaryFile,
                            {},
                            () => resolve(serviceNodeTemporaryFile)
                        );
                    }
                })
        })
    }

    public findById(id: string): Promise<ServiceNodeTemporaryFile | null> {
        return new Promise<ServiceNodeTemporaryFile | null>(resolve => {
            this.dataStore.findOne<ServiceNodeTemporaryFile>(
                {id, type: EntityType.SERVICE_NODE_TEMPORARY_FILE},
                (_, document) => resolve(document)
            )
        })
    }
}
