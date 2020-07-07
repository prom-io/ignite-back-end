import {Injectable} from "@nestjs/common";
import Skynet from "@nebulous/skynet";
import {PathLike} from "fs";

@Injectable()
export class SkynetClient {
    public async uploadFile(path: PathLike): Promise<string> {
        return await Skynet.UploadFile(path, Skynet.DefaultUploadOptions);
    }
}
