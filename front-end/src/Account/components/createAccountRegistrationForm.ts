import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {GenericAccountRegistrationForm, GenericAccountRegistrationFormOwnProps} from "./GenericAccountRegistrationForm";
import {IAppState} from "../../store";

interface CreateAccountRegistrationFormOptions {
    label: string,
    storeName: 'dataValidatorRegistration'
}

export const createAccountRegistrationForm = (options: CreateAccountRegistrationFormOptions) => {
    const storeName = options.storeName;

    const mapMobxToProps = (state: IAppState): GenericAccountRegistrationFormOwnProps => ({
        response: state[storeName].response,
        label: options.label,
        address: state[storeName].registrationForm.address || '',
        addressError: state[storeName].formErrors.address,
        pending: state[storeName].pending,
        submissionError: state[storeName].submissionError,
        showSnackbar: state[storeName].showSnackbar,
        setShowSnackbar: state[storeName].setShowSnackbar,
        onAddressChange: address => state[storeName].setField("address", address),
        onSubmit: state[storeName].registerAccount
    });

    return inject(mapMobxToProps)(observer(GenericAccountRegistrationForm)) as FunctionComponent<any>;
};
