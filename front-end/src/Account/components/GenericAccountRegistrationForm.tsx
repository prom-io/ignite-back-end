import React, {FunctionComponent} from "react";
import {Button, Card, CardContent, CardHeader, CircularProgress, TextField, Typography} from "@material-ui/core";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {ApiError, SERVICE_NODE_API_UNREACHABLE_CODE} from "../../api";
import {RegisterAccountResponse} from "../../models";

export interface GenericAccountRegistrationFormOwnProps {
    address: string,
    addressError?: string,
    submissionError?: ApiError,
    response?: RegisterAccountResponse,
    pending: boolean,
    label: string,
    showSnackbar: boolean,
    onSubmit: () => void,
    setShowSnackbar: (showSnackBar: boolean) => void,
    onAddressChange: (address: string) => void
}

type GenericAccountRegistrationFormProps = GenericAccountRegistrationFormOwnProps & WithSnackbarProps;

const getMessageFromError = (apiError: ApiError): string => {
    if (apiError.status === 400) {
        return "Account with such address has already been registered.";
    } else if (apiError.status === 500) {
        return "Internal server error occurred."
    } else if (apiError.status === SERVICE_NODE_API_UNREACHABLE_CODE) {
        return "Service node is unreachable. Please make sure that it's running."
    } else {
        return "Unknown error occurred when tried to register account."
    }
};

const _GenericAccountRegistrationForm: FunctionComponent<GenericAccountRegistrationFormProps> = ({
    response,
    submissionError,
    pending,
    addressError,
    address,
    label,
    enqueueSnackbar,
    showSnackbar,
    setShowSnackbar,
    onSubmit,
    onAddressChange
}) => {
    if (showSnackbar && response) {
        enqueueSnackbar("Account has been created");
        setShowSnackbar(false);
    }

    return (
        <Card>
            <CardHeader title={label}/>
            <CardContent>
                <TextField value={address}
                           error={Boolean(addressError)}
                           helperText={addressError && addressError}
                           onChange={event => onAddressChange(event.target.value as string)}
                           fullWidth
                           margin="dense"
                           label="Address"
                />
                <Button variant="contained"
                        disabled={pending}
                        onClick={onSubmit}
                        color="primary"
                >
                    Register account
                </Button>
                {pending && <CircularProgress size={15} color="primary"/>}
                {submissionError && (
                    <Typography variant="body1"
                                style={{color: 'red'}}
                    >
                        {getMessageFromError(submissionError)}
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
};

export const GenericAccountRegistrationForm = withSnackbar(_GenericAccountRegistrationForm) as unknown as FunctionComponent<GenericAccountRegistrationFormOwnProps>;
