import {Injectable} from "@nestjs/common";
import Skynet from "@nebulous/skynet";
import {Response} from "express";
import {PathLike} from "fs";
import axios, {AxiosResponse} from "axios";

@Injectable()
export class SkynetClient {
    public async uploadFile(path: PathLike): Promise<string> {
        return await Skynet.UploadFile(path, Skynet.DefaultUploadOptions);
    }

    public async downloadFile(path: PathLike, skylink: string): Promise<void> {
        return await Skynet.DownloadFile(path, skylink, Skynet.DefaultDownloadOptions);
    }

    public async downloadFileToHttpResponse(siaLink: string, httpResponse: Response): Promise<void> {
        const skynetPortal = "https://siasky.net";

        if (siaLink.startsWith("sia://")) {
            siaLink = siaLink.substring("sia://".length, siaLink.length);
        }

        const skynetResponse: AxiosResponse = await axios.get(`${skynetPortal}/${siaLink}`, {responseType: "stream"});

        httpResponse.setHeader("Content-Type", skynetResponse.headers["content-type"]);
        httpResponse.setHeader("Content-Disposition", skynetResponse.headers["content-disposition"]);

        skynetResponse.data.pipe(httpResponse);
    }
}
