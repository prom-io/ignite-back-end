import * as React from "react";
import {inject, observer} from "mobx-react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    withMobileDialog
} from "@material-ui/core";
import {IAppState} from "../../store";

interface AddFileMetaDataDialogMobxProps {
    metaDataKey?: string,
    metaDataValue?: string,
    errors: {
        key?: string,
        value?: string
    },
    open: boolean,
    setOpen: (open: boolean) => void,
    clear: () => void,
    isFormValid: () => boolean,
    setKey: (key: string) => void,
    setValue: (value: string) => void
}

interface AddFileMetaDataDialogInjectedPros {
    fullScreen: boolean
}

interface AddFileMetaDataDialogOwnProps {
    onAdd: (key: string, value: string) => void,
}

type AddFileMetaDataDialogProps = AddFileMetaDataDialogMobxProps
    & AddFileMetaDataDialogInjectedPros
    & AddFileMetaDataDialogOwnProps;

const _AddFileMetaDataDialog: React.FC<AddFileMetaDataDialogProps> = ({
    metaDataKey,
    metaDataValue,
    errors,
    fullScreen,
    open,
    isFormValid,
    onAdd,
    clear,
    setOpen,
    setKey,
    setValue
}) => {
    const handleAdd = () => {
        if (isFormValid()) {
            onAdd(metaDataKey!, metaDataValue!);
            setOpen(false);
            clear();
        }
    };

    const handleClose = () => {
        setOpen(false);
        clear();
    };

    return (
        <Dialog open={open}
                fullScreen={fullScreen}
                onClose={() => setOpen(false)}
        >
            <DialogTitle>
                Add metadata
            </DialogTitle>
            <DialogContent>
                <TextField label="Metadata key"
                           value={metaDataKey || ""}
                           onChange={event => setKey(event.target.value)}
                           fullWidth
                           margin="dense"
                           error={Boolean(errors.key)}
                           helperText={errors.key && errors.key}
                />
                <TextField label="Metadata value"
                           value={metaDataValue || ""}
                           onChange={event => setValue(event.target.value)}
                           fullWidth
                           margin="dense"
                           error={Boolean(errors.value)}
                           helperText={errors.value && errors.value}
                />
            </DialogContent>
            <DialogActions>
                <Button variant="contained"
                        color="primary"
                        onClick={handleAdd}
                >
                    Add metadata
                </Button>
                <Button variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                >
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
};

const mapMobxToProps = (state: IAppState): AddFileMetaDataDialogMobxProps => ({
    metaDataKey: state.metadataAdding.key,
    metaDataValue: state.metadataAdding.value,
    errors: state.metadataAdding.errors,
    open: state.metadataAdding.dialogOpen,
    setKey: state.metadataAdding.setKey,
    setValue: state.metadataAdding.setValue,
    setOpen: state.metadataAdding.setDialogOpen,
    clear: state.metadataAdding.clear,
    isFormValid: state.metadataAdding.isFormValid
});

export const AddFileMetadataDialog = withMobileDialog()(inject(mapMobxToProps)(observer(_AddFileMetaDataDialog))) as React.FC<AddFileMetaDataDialogOwnProps>;
