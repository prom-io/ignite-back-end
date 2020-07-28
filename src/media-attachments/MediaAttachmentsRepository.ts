import {EntityRepository, In, Repository} from "typeorm";
import {MediaAttachment} from "./entities";

@EntityRepository(MediaAttachment)
export class MediaAttachmentsRepository extends Repository<MediaAttachment> {

    public findById(id: string): Promise<MediaAttachment | undefined> {
        return this.findOne({
            where: {
                id
            }
        });
    }

    public findByName(name: string): Promise<MediaAttachment | undefined> {
        return this.findOne({
            where: {
                name
            }
        })
    }

    public findPreviewByOriginalIdAndSize(originalId: string, size: number): Promise<MediaAttachment | undefined> {
        return this.findOne({
            where: { originalId, previewSize: size }
        })
    }

    public findAllByIds(ids: string[]): Promise<MediaAttachment[]> {
        return this.find({
            where: {
                id: In(ids)
            }
        })
    }
}
