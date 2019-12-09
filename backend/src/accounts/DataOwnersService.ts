import {Injectable} from "@nestjs/common";
import {DataOwnersRepository} from "./DataOwnersRepository";
import {createDataOwnerRequestToDataOwner, dataOwnerToDataOwnerResponse} from "./account-mappers";
import {DataOwnerResponse} from "../model/api/response";
import {CreateDataOwnerRequest} from "../model/api/request";
import {DataOwner} from "../model/entity";

@Injectable()
export class DataOwnersService {
    constructor(private readonly dataOwnersRepository: DataOwnersRepository) {}

    public async findAllDataOwners(): Promise<DataOwnerResponse[]> {
        return (await this.dataOwnersRepository.findAll()).map(dataOwner => dataOwnerToDataOwnerResponse(dataOwner));
    }

    public async findAllDataOwnersByDataValidator(dataValidatorAddress: string): Promise<DataOwnerResponse[]> {
        return (await this.dataOwnersRepository.findByDataValidatorAddress(dataValidatorAddress))
            .map(dataOwner => dataOwnerToDataOwnerResponse(dataOwner));
    }

    public async createDataOwner(createDataOwnerRequest: CreateDataOwnerRequest): Promise<DataOwnerResponse> {
        const dataOwner: DataOwner = createDataOwnerRequestToDataOwner(createDataOwnerRequest);
        return dataOwnerToDataOwnerResponse((await this.dataOwnersRepository.save(dataOwner)));
    }
}
