import {Injectable} from "@nestjs/common";
import uuid from "uuid/v4";
import {UserDevice} from "./entities";
import {UserDevicesRepository} from "./UserDevicesRepository";
import {CreateUserDeviceRequest} from "./types/request";
import {User} from "../users/entities";

@Injectable()
export class UserDevicesService {
    constructor(private readonly userDevicesRepository: UserDevicesRepository) {
    }

    public async createUserDevice(createUserDeviceRequest: CreateUserDeviceRequest, user: User): Promise<void> {
        const userDevice: UserDevice = {
            id: uuid(),
            fcmToken: createUserDeviceRequest.fcmToken,
            user,
            fcmTokenExpired: false
        };
        await this.userDevicesRepository.save(userDevice);
    }
}
