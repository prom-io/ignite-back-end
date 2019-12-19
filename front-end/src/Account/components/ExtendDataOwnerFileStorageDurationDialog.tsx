import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {FileInfoResponse} from "../../models";
import {ApiError} from "../../api";
import {IAppState} from "../../store";

interface ExtendDataOwnerFileStorageDurationDialogMobxProps {
    file?: FileInfoResponse,
    setKeepUntil: (keepUntil: Date) => void,
    pending: boolean,
    showSnackbar: boolean,
    setShowSnackbar: (showSnackbar: boolean) => void,
    error?: ApiError,
    response?: {success: boolean},
    extendFileStorageDuration: () => void,
    newStorageDurationDate?: Date
}

interface ExtendDataOwnerFileStorageDurationDialogOwnProps {
    onClose: () => void
}

type ExtendDataOwnerFileStorageDurationDialogProps = ExtendDataOwnerFileStorageDurationDialogMobxProps
    & ExtendDataOwnerFileStorageDurationDialogOwnProps
    & WithSnackbarProps;

const _ExtendDataOwnerFileStorageDurationDialog: FunctionComponent<ExtendDataOwnerFileStorageDurationDialogProps> = ({
    file,
    error,
    response,
    showSnackbar,
    pending,
    setShowSnackbar,
    extendFileStorageDuration,
    onClose,
    setKeepUntil,
    newStorageDurationDate,
    enqueueSnackbar
}) => {
    if (showSnackbar) {
        if (response) {
            enqueueSnackbar("Storage duration has been extended");
        } else if (error) {
            enqueueSnackbar("Error occurred when tried to extend storage duration", {variant: "error"});
        }
        setShowSnackbar(false);
    }

    if (file) {

        return (
            <Dialog open={Boolean(file)}
                    onClose={onClose}
            >
                <DialogTitle>
                    Prolong the term
                </DialogTitle>
                <DialogContent style={{marginBottom: 30}}>
                    <KeyboardDatePicker value={newStorageDurationDate!}
                                        onChange={date => setKeepUntil(date as Date)}
                                        disablePast
                                        autoOk
                                        format="dd/MM/yyyy"
                                        label="Must be stored until"
                                        fullWidth
                                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined"
                            color="secondary"
                            onClick={onClose}
                    >
                        Close
                    </Button>
                    <Button variant="contained"
                            color="primary"
                            onClick={extendFileStorageDuration}
                            disabled={pending}
                    >
                        Prolong the term
                    </Button>
                    {pending && <CircularProgress size={15} color="primary"/>}
                </DialogActions>
            </Dialog>
        )
    } else {
        return null;
    }
};

const mapMobxToProps = (state: IAppState): ExtendDataOwnerFileStorageDurationDialogMobxProps => ({
    file: state.fileStorageDurationExtension.file,
    showSnackbar: state.fileStorageDurationExtension.showSnackbar,
    error: state.fileStorageDurationExtension.error,
    newStorageDurationDate: state.fileStorageDurationExtension.keepUntil,
    response: state.fileStorageDurationExtension.response,
    pending: state.fileStorageDurationExtension.pending,
    extendFileStorageDuration: state.fileStorageDurationExtension.extendFileStorageDuration,
    setShowSnackbar: state.fileStorageDurationExtension.setShowSnackBar,
    setKeepUntil: state.fileStorageDurationExtension.setKeepUntil
});

export const ExtendDataOwnerFileStorageDurationDialog = withSnackbar(
    inject(mapMobxToProps)(observer(_ExtendDataOwnerFileStorageDurationDialog)) as FunctionComponent<any>
);
