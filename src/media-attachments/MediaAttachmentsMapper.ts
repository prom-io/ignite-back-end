import {Injectable} from "@nestjs/common";
import {MediaAttachment} from "./entities";
import {MediaAttachmentResponse} from "./types";
import {config} from "../config";

@Injectable()
export class MediaAttachmentsMapper {
    public toMediaAttachmentResponse(mediaAttachment: MediaAttachment): MediaAttachmentResponse {
        return new MediaAttachmentResponse({
            ...this.toMediaAttachmentResponseWithoutPreviews(mediaAttachment),
            preview128: mediaAttachment.preview128 && this.toMediaAttachmentResponseWithoutPreviews(mediaAttachment.preview128),
            preview256: mediaAttachment.preview256 && this.toMediaAttachmentResponseWithoutPreviews(mediaAttachment.preview256),
            preview512: mediaAttachment.preview512 && this.toMediaAttachmentResponseWithoutPreviews(mediaAttachment.preview512),
            preview1024: mediaAttachment.preview1024 && this.toMediaAttachmentResponseWithoutPreviews(mediaAttachment.preview1024),
        })
    }

    private toMediaAttachmentResponseWithoutPreviews(mediaAttachment: MediaAttachment): MediaAttachmentResponse {
        return new MediaAttachmentResponse({
            id: mediaAttachment.id,
            url: `${config.HOST}/api/v1/media/${mediaAttachment.name}`,
            type: "image",
            meta: {
                width: mediaAttachment.width,
                height: mediaAttachment.height
            }
        })
    }
}
