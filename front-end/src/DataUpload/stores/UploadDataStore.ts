import {action, computed, observable, reaction} from "mobx";
import {addMonths} from "date-fns";
import {validateAttachedFile, validateFileName, validatePrice} from "../validation";
import {ApiError, DataUploadService} from "../../api";
import {
    FileMetadata,
    GenerateRsaKeyPairResponse,
    LocalFileRecordResponse,
    UploadDataRequest,
    UploadDataResponse
} from "../../models";
import {
    convertToBase64,
    FormErrors,
    getFileExtensionFromName,
    removeBase64Header,
    sleep,
    validateEthereumAddress
} from "../../utils";
import {SettingsStore} from "../../Settings";

const UPLOAD_DATA_FORM_INITIAL_STATE =  {
    data: "",
    additional: {},
    dataOwnerAddress: undefined,
    name: undefined,
    keepUntil: addMonths(new Date(), 1),
    price: 1
};

const UPLOAD_DATA_FORM_ERRORS_INITIAL_STATE = {
    data: undefined,
    additional: undefined,
    dataOwnerAddress: undefined,
    name: undefined,
    keepUntil: undefined,
    extension: undefined,
    mimeType: undefined,
    size: undefined,
    dataValidatorAddress: undefined,
    serviceNodeAddress: undefined,
    attachedFile: undefined,
    price: undefined
};

const CHUNK_SIZE = 5242878;

export class UploadDataStore {
    @observable
    uploadDataForm: Partial<UploadDataRequest> = UPLOAD_DATA_FORM_INITIAL_STATE;

    @observable
    attachedFileName?: string;

    @observable
    fileSize: number = 0;

    @observable
    extension: string = "";

    @observable
    mimeType: string = "";

    @observable
    errors: FormErrors<UploadDataRequest> & {attachedFile: string | undefined} = UPLOAD_DATA_FORM_ERRORS_INITIAL_STATE;

    @observable
    attachedFile?: File;

    @observable
    response?: UploadDataResponse;

    @observable
    pending: boolean = false;

    @observable
    submissionError?: ApiError;

    @observable
    generatedKeyPair?: GenerateRsaKeyPairResponse;

    @observable
    settingsStore: SettingsStore;

    @computed
    get dataValidatorAccount(): string | undefined {
        return this.settingsStore.selectedDataValidatorAccount;
    }

    constructor(settingsStore: SettingsStore) {
        this.settingsStore = settingsStore;

        reaction(
            () => this.uploadDataForm.name,
            name => this.errors.name = validateFileName(name)
        );

        reaction(
            () => this.uploadDataForm.dataOwnerAddress,
            address => this.errors.dataOwnerAddress = validateEthereumAddress(address)
        );

        reaction(
            () => this.uploadDataForm.price,
            price => this.errors.price = validatePrice(price)
        )
    }

    @action
    setField = (key: keyof UploadDataRequest, value: string | number | FileMetadata | Date): void => {
        this.uploadDataForm = {
            ...this.uploadDataForm,
            [key]: value
        }
    };

    @action
    setAdditionalField = (additionalFieldName: keyof FileMetadata, value: string | string[]): void => {
        this.uploadDataForm.additional = {
            ...this.uploadDataForm.additional,
            [additionalFieldName]: value
        };
    };

    @action
    removeAdditionalField = (additionalFieldName: keyof FileMetadata): void => {
        delete this.uploadDataForm.additional![additionalFieldName];
    };

    @action
    setAttachedFileName = (fileName: string): void => {
        this.attachedFileName = fileName;
    };

    @action
    setAttachedFile = (file: File): void => {
        this.attachedFile = file;
        this.uploadDataForm.name = file.name;
    };

    @action
    uploadData = (): Promise<void> => {
        if (this.isFormValid()) {
            this.submissionError = undefined;
            this.response = undefined;
            this.pending = true;
            return new Promise<void>(async resolve => {
                try {
                    const localFileRecord = await this.createLocalFileRecord();
                    await this.uploadFileByChunks(localFileRecord.id);
                    await DataUploadService.uploadLocalFileToDds(localFileRecord.id);

                    let fileFullyUploaded = false;
                    let failed = false;
                    let price: number | undefined;
                    let ddsFileId: string | undefined;
                    let storagePrice: number | undefined;
                    let dataOwner: string | undefined;
                    let privateKey: string | undefined;

                    while (!fileFullyUploaded && !failed) {
                        await sleep(5000);
                        const fileUploadingCheckingResponse = await DataUploadService.checkIfLocalFileUploadToDds(localFileRecord.id);
                        failed = fileUploadingCheckingResponse.data.failed;
                        fileFullyUploaded = fileUploadingCheckingResponse.data.fullyUploaded;
                        price = fileUploadingCheckingResponse.data.price;
                        ddsFileId = fileUploadingCheckingResponse.data.ddsFileId;
                        storagePrice = fileUploadingCheckingResponse.data.storagePrice;
                        dataOwner = fileUploadingCheckingResponse.data.dataOwner;
                        privateKey = fileUploadingCheckingResponse.data.privateKey;
                    }

                    this.pending = false;

                    if (failed) {
                        this.submissionError = {
                            status: 500,
                            message: "Error occurred while uploading file, please try again"
                        }
                    } else if (fileFullyUploaded) {
                        this.response = {
                            additional: {},
                            duration: 0,
                            id: ddsFileId!,
                            price: price!,
                            storagePrice: storagePrice!,
                            dataOwner: dataOwner!
                        }
                    }

                    await DataUploadService.deleteLocalFile(localFileRecord.id);
                    resolve();
                } catch (error) {
                    console.log(error);
                    this.submissionError = {
                        message: "Something went wrong",
                        status: 500
                    };
                    this.pending = false;
                    resolve();
                }
            })
        } else return new Promise<void>(resolve => resolve());
    };

    private createLocalFileRecord = async (): Promise<LocalFileRecordResponse> => {
        const mimeType = this.attachedFile!.type && this.attachedFile!.type.length !== 0
            ? this.attachedFile!.type
            : "application/octet-stream";
        return (await DataUploadService.createLocalFileRecord({
            additional: this.uploadDataForm.additional!,
            dataOwnerAddress: this.uploadDataForm.dataOwnerAddress!,
            name: this.uploadDataForm.name!,
            keepUntil: this.uploadDataForm.keepUntil!,
            size: this.attachedFile!.size,
            mimeType,
            extension: getFileExtensionFromName(this.attachedFile!.name),
            dataValidatorAddress: this.dataValidatorAccount!,
            price: this.uploadDataForm.price!
        })).data;
    };

    private uploadFileByChunks = async (localFileId: string): Promise<void> => {
        let targetPosition = this.attachedFile!.size;
        let chunk: string;
        const fileId = localFileId;
        const totalChunks = Math.ceil(targetPosition / CHUNK_SIZE);
        let currentChunk = 0;

        while (currentChunk < totalChunks) {
            const offset = currentChunk * CHUNK_SIZE;
            chunk = removeBase64Header(await convertToBase64(this.attachedFile!.slice(offset, offset + CHUNK_SIZE)));
            if (offset + CHUNK_SIZE < targetPosition) {
                if (chunk.endsWith("=")) {
                    chunk = chunk.substring(0, chunk.indexOf("="));
                } else if (chunk.endsWith("==")) {
                    chunk = chunk.substring(0, chunk.indexOf("=="));
                }
            }
            currentChunk++;
            await DataUploadService.sendFileChunk(fileId, {chunkData: chunk});
        }
    };

    @action
    isFormValid = (): boolean => {
        const {dataOwnerAddress, name, price} = this.uploadDataForm;
        this.errors = {
            name: validateFileName(name),
            dataOwnerAddress: undefined,
            price: validatePrice(price),
            additional: undefined,
            keepUntil: undefined,
            extension: undefined,
            mimeType: undefined,
            size: undefined,
            dataValidatorAddress: undefined,
            attachedFile: validateAttachedFile(this.attachedFile)
        };

        return !Boolean(this.errors.name || this.errors.dataOwnerAddress || this.errors.attachedFile);
    };

    @action
    reset = (): void => {
        this.uploadDataForm = UPLOAD_DATA_FORM_INITIAL_STATE;
        this.response = undefined;
        this.pending = false;
        this.attachedFileName = undefined;
        this.fileSize = 0;
        this.extension = "";
        this.mimeType = "";
        this.submissionError = undefined;
        this.attachedFile = undefined;

        setTimeout(() => this.errors = UPLOAD_DATA_FORM_ERRORS_INITIAL_STATE, 1);
    }
}
