import React, {FunctionComponent} from "react";
import {createAccountRegistrationForm} from "./createAccountRegistrationForm";

export const DataValidatorAccountRegistrationForm: FunctionComponent<{}> = createAccountRegistrationForm({
    label: "Register data validator",
    storeName: "dataValidatorRegistration"
});
