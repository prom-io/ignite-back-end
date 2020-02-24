import {Injectable} from "@nestjs/common";
import {MediaAttachment} from "./entities";
import {MediaAttachmentResponse} from "./types";
import {config} from "../config";

@Injectable()
export class MediaAttachmentsMapper {
    public toMediaAttachmentResponse(mediaAttachment: MediaAttachment): MediaAttachmentResponse {
        return new MediaAttachmentResponse({
            id: mediaAttachment.id,
            previewUrl: `${config.HOST}/api/v1/media/${mediaAttachment.name}`,
            url: `${config.HOST}/api/v1/media/${mediaAttachment.name}`,
            type: "image",
            meta: {
                original: {
                    width: mediaAttachment.width,
                    height: mediaAttachment.height
                },
                small: {
                    width: mediaAttachment.width,
                    height: mediaAttachment.height
                }
            }
        })
    }
}
