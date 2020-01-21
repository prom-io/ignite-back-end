import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Typography
} from "@material-ui/core";
import withMobileDialog, {WithMobileDialog} from "@material-ui/core/withMobileDialog";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {RegisterAccountRequest} from "../../models";
import {FormErrors} from "../../utils";
import {ApiError} from "../../api";
import {IAppState} from "../../store";

interface RegisterAccountFormMobxProps {
    registrationForm: Partial<RegisterAccountRequest>,
    errors: FormErrors<RegisterAccountRequest>,
    submissionError?: ApiError,
    pending: boolean,
    registrationDialogOpen: boolean,
    showSnackbar: boolean,
    setFormValue: (key: keyof RegisterAccountRequest, value: string) => void,
    setRegistrationDialogOpen: (registrationDialogOpen: boolean) => void,
    setShowSnackbar: (showSnackbar: boolean) => void,
    registerAccount: () => void
}

type RegisterAccountDialogInjectedProps = WithMobileDialog & WithSnackbarProps;

type RegisterAccountDialogProps = RegisterAccountFormMobxProps & RegisterAccountDialogInjectedProps;

const _RegisterAccountDialog: FunctionComponent<RegisterAccountDialogProps> = ({
    registrationDialogOpen,
    pending,
    fullScreen,
    errors,
    registrationForm,
    submissionError,
    showSnackbar,
    enqueueSnackbar,
    setShowSnackbar,
    setRegistrationDialogOpen,
    setFormValue,
    registerAccount
}) => {
    if (showSnackbar) {
        enqueueSnackbar("Account has been created");
        setShowSnackbar(false);
        setRegistrationDialogOpen(false);
    }

    return (
        <Dialog open={registrationDialogOpen}
                fullScreen={fullScreen}
                onClose={() => setRegistrationDialogOpen(false)}
                fullWidth
                maxWidth="md"
        >
            <DialogTitle>Register new Account</DialogTitle>
            <DialogContent>
                <TextField label="Address"
                           value={registrationForm.address}
                           onChange={event => setFormValue("address", event.target.value)}
                           fullWidth
                           margin="dense"
                           error={Boolean(errors.address)}
                           helperText={errors.address && errors.address}
                />
                <TextField label="Private key"
                           value={registrationForm.privateKey}
                           onChange={event => setFormValue("privateKey", event.target.value)}
                           fullWidth
                           margin="dense"
                           error={Boolean(errors.privateKey)}
                           helperText={errors.privateKey && errors.privateKey}
                           multiline
                />
            </DialogContent>
            <DialogActions>
                <Button variant="outlined"
                        color="secondary"
                        onClick={() => setRegistrationDialogOpen(false)}
                >
                    Cancel
                </Button>
                <Button variant="contained"
                        color="primary"
                        onClick={registerAccount}
                        disabled={pending}
                >
                    Register
                </Button>
                {pending && <CircularProgress color="primary" size={15}/>}
                {submissionError && (
                    <Typography variant="body1" style={{color: "red"}}>
                        Error occurred when tried to register account. Server responded with {submissionError?.status} status
                    </Typography>
                )}
            </DialogActions>
        </Dialog>
    )
};

const mapMobxToProps = (state: IAppState): RegisterAccountFormMobxProps => ({
    registrationForm: state.registration.registrationForm,
    errors: state.registration.formErrors,
    submissionError: state.registration.submissionError,
    showSnackbar: state.registration.showSnackbar,
    pending: state.registration.pending,
    registrationDialogOpen: state.registration.registrationDialogOpen,
    registerAccount: state.registration.registerAccount,
    setRegistrationDialogOpen: state.registration.setRegistrationDialogOpen,
    setFormValue: state.registration.setField,
    setShowSnackbar: state.registration.setShowSnackbar
});

export const RegisterAccountDialog = withMobileDialog()(
    withSnackbar(
        inject(mapMobxToProps)(observer(_RegisterAccountDialog) as FunctionComponent)
    )
);
