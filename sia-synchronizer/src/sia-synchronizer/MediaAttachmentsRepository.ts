import {EntityRepository, Repository} from "typeorm";
import {MediaAttachment} from "./entities";

@EntityRepository(MediaAttachment)
export class MediaAttachmentsRepository extends Repository<MediaAttachment>{
    public findNotUploadedToSia(): Promise<MediaAttachment[]> {
        return this.find({
            where: {
                siaLink: null
            }
        })
    }
}
