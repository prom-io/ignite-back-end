import {Injectable} from "@nestjs/common";
import {DataOwnersRepository} from "./DataOwnersRepository";
import {createDataOwnerRequestToDataOwner, dataOwnerToDataOwnerResponse} from "./account-mappers";
import {DataOwnerResponse} from "./types/response";
import {CreateDataOwnerRequest} from "./types/request";
import {DataOwner} from "./types/entity";
import {ServiceNodeApiClient} from "../service-node-api";

@Injectable()
export class DataOwnersService {
    constructor(private readonly serviceNodeApiClient: ServiceNodeApiClient,
                private readonly dataOwnersRepository: DataOwnersRepository) {}

    public async findAllDataOwners(): Promise<DataOwnerResponse[]> {
        return (await this.dataOwnersRepository.findAll()).map(dataOwner => dataOwnerToDataOwnerResponse(dataOwner));
    }

    public async findAllDataOwnersByDataValidator(dataValidatorAddress: string): Promise<DataOwnerResponse[]> {
        return (await this.dataOwnersRepository.findByDataValidatorAddress(dataValidatorAddress))
            .map(dataOwner => dataOwnerToDataOwnerResponse(dataOwner))
            .filter(dataOwner => dataOwner.file !== undefined)
            .sort((first, second) => new Date(second.file.createdAt).getTime() - new Date(first.file.createdAt).getTime());
    }

    public async createDataOwner(createDataOwnerRequest: CreateDataOwnerRequest): Promise<DataOwnerResponse> {
        const dataOwner: DataOwner = createDataOwnerRequestToDataOwner(createDataOwnerRequest);
        try {
            await this.serviceNodeApiClient.registerDataOwner({
                address: createDataOwnerRequest.address,
                dataValidatorAddress: createDataOwnerRequest.dataValidatorAddress
            });
            return dataOwnerToDataOwnerResponse((await this.dataOwnersRepository.save(dataOwner)));
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    public async findByAddress(dataOwnerAddress: string): Promise<DataOwnerResponse> {
        return dataOwnerToDataOwnerResponse((await this.dataOwnersRepository.findByAddress(dataOwnerAddress))!);
    }

    public async existsByAddress(dataOwnerAddress: string): Promise<boolean> {
        const dataOwner = await this.dataOwnersRepository.findByAddress(dataOwnerAddress);
        return dataOwner !== null;
    }
}
