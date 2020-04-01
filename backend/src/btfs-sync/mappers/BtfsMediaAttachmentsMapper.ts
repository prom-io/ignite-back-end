import {Injectable} from "@nestjs/common";
import {MediaAttachment} from "../../media-attachments/entities";
import {BtfsMediaAttachment} from "../types/btfs-entities";

@Injectable()
export class BtfsMediaAttachmentsMapper {

    public fromMediaAttachment(mediaAttachment: MediaAttachment): BtfsMediaAttachment {
        return {
            ...mediaAttachment
        }
    }
}
