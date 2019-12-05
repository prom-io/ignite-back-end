import {observable, action} from "mobx";
import {FormErrors} from "../../utils";
import {validateMetaDataKey, validateMetaDataValue} from "../validation";

export class AddMetadataDialogStore {
    @observable
    dialogOpen: boolean = false;

    @observable
    key?: string = undefined;

    @observable
    value?: string = undefined;

    @observable
    errors: FormErrors<{key: string, value: string}> = {
        key: undefined,
        value: undefined
    };

    @action
    setDialogOpen = (dialogOpen: boolean): void => {
        this.dialogOpen = dialogOpen;
    };

    @action
    setKey = (key: string): void => {
        this.key = key;
    };

    @action
    setValue = (value: string): void => {
        this.value = value;
    };

    @action
    clear = (): void => {
        this.key = undefined;
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
