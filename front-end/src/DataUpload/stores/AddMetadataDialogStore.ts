import {observable, action, reaction} from "mobx";
import {FormErrors} from "../../utils";
import {validateMetaDataKey, validateMetaDataValue} from "../validation";
import {FileMetadata} from "../../models";

export class AddMetadataDialogStore {
    @observable
    dialogOpen: boolean = false;

    @observable
    key: keyof FileMetadata = "briefDescription";

    @observable
    value?: string | string[];

    @observable
    errors: FormErrors<{key: string, value: string}> = {
        key: undefined,
        value: undefined
    };

    constructor() {
        reaction(
            () => this.key,
            () => this.value = undefined
        )
    }

    @action
    setDialogOpen = (dialogOpen: boolean): void => {
        this.dialogOpen = dialogOpen;
    };

    @action
    setKey = (key: keyof FileMetadata): void => {
        this.key = key;
    };

    @action
    setValue = (value: string | string[]): void => {
        this.value = value;
    };

    @action
    clear = (): void => {
        this.key = "briefDescription";
        this.value = undefined;
    };

    @action
    isFormValid = (): boolean => {
        this.errors = {
            key: validateMetaDataKey(this.key),
            value: validateMetaDataValue(this.value)
        };

        return !Boolean(this.errors.key || this.errors.value);
    }
}
