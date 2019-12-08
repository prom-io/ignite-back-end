import * as React from "react";
import {inject, observer} from "mobx-react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputLabel,
    withMobileDialog,
} from "@material-ui/core";
import {HashTagsInput} from "./HashTagsInput";
import {MetadataKeySelect} from "./MetadataKeySelect";
import {IAppState} from "../../store";
import {FileMetadata} from "../../models";

interface AddFileMetaDataDialogMobxProps {
    metaDataKey?: keyof FileMetadata,
    metaDataValue?: string | string[],
    errors: {
        key?: string,
        value?: string
    },
    open: boolean,
    setOpen: (open: boolean) => void,
    clear: () => void,
    isFormValid: () => boolean,
    setKey: (key: keyof FileMetadata) => void,
    setValue: (value: string | string[]) => void
}

interface AddFileMetaDataDialogInjectedPros {
    fullScreen: boolean
}

interface AddFileMetaDataDialogOwnProps {
    onAdd: (key: keyof FileMetadata, value: string | string[]) => void,
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
                <MetadataKeySelect selectedKey={metaDataKey}
                                   onSelect={setKey}
                />
                {metaDataKey === "hashTags"
                    ? (
                        <HashTagsInput tags={
                            typeof metaDataValue === "string"
                                ? []
                                : metaDataValue as string[]
                        }
                                       onHashTagAdded={hashTag => {
                                           if (metaDataValue === undefined) {
                                               setValue([hashTag]);
                                           } else {
                                               setValue([...metaDataValue as string[], hashTag])
                                           }
                                       }}
                                       onHashTagRemoved={index => {
                                           const newValue = metaDataValue as string[];
                                           setValue(newValue.filter((_, itemIndex) => index !== itemIndex));
                                       }}
                        />
                    )
                    : (
                        <TextField label="Metadata value"
                                   value={metaDataValue || ""}
                                   onChange={event => setValue(event.target.value)}
                                   fullWidth
                                   margin="dense"
                                   error={Boolean(errors.value)}
                                   helperText={errors.value && errors.value}
                        />
                    )
                }
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
