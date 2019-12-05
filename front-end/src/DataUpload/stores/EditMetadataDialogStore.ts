import {action, observable} from "mobx";
import {FormErrors} from "../../utils";
import {validateMetaDataKey, validateMetaDataValue} from "../validation";

export class EditMetadataDialogStore {
    @observable
    editedMetadataKey?: string;

    @observable
    key?: string;

    @observable
    value?: string;

    @observable
    errors: FormErrors<{key: string, value: string}> = {
        key: undefined,
        value: undefined
    };

    @action
    setEditedMetadataKey = (key?: string): void => {
        this.editedMetadataKey = key;
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
        this.errors = {
            key: undefined,
            value: undefined
        }
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
