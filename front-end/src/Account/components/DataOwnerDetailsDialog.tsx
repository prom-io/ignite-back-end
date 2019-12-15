import React, {Fragment, FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@material-ui/core";
import withMobileDialog, {WithMobileDialog} from "@material-ui/core/withMobileDialog";
import {format} from "date-fns";
import {ExtendDataOwnerFileStorageDurationDialog} from "./ExtendDataOwnerFileStorageDurationDialog";
import {DataOwnerResponse, FileInfoResponse, FileMetadata} from "../../models";
import {getMetadataKeyLabel} from "../../utils";
import {IAppState} from "../../store";

interface DataOwnerDetailsDialogOwnProps {
    dataOwner?: DataOwnerResponse,
    onClose: () => void,
}

interface DataOwnerDetailsDialogMobxProps {
    setExtendFileStorageDurationFile: (file: FileInfoResponse | undefined) => void
}

type DataOwnerDetailsDialogProps = DataOwnerDetailsDialogOwnProps & DataOwnerDetailsDialogMobxProps & WithMobileDialog;

const _DataOwnerDetailsDialog: FunctionComponent<DataOwnerDetailsDialogProps> = ({
    dataOwner,
    onClose,
    fullScreen,
    setExtendFileStorageDurationFile
}) => {
    if (dataOwner) {
        const storageDate = dataOwner.file ? new Date(dataOwner.file.keepUntil) : undefined;
        const storageExpired = storageDate ? new Date().getTime() - storageDate.getTime() > 0 : true;

        return (
            <Fragment>
                <Dialog open
                        fullScreen={fullScreen}
                        onClose={onClose}
                        fullWidth
                        maxWidth="lg"
                >
                    <DialogTitle>Data owner</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1">Wallet ID: {dataOwner.address}</Typography>
                        <Typography variant="body1">Private key: {dataOwner.privateKey}</Typography>
                        {dataOwner.file && <Typography variant="body1">Creation date: {format(new Date(dataOwner.file.createdAt), "dd/MM/yyyy")}</Typography>}
                        {dataOwner?.file && storageDate && <Typography variant="body1">Must be stored until: <b>{format(new Date(storageDate), "dd/MM/yyyy")}</b></Typography>}
                        {dataOwner?.file && dataOwner.file.fileMetadata && (
                            <Fragment>
                                <Typography variant="body1">
                                    File metadata
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Metadata key</TableCell>
                                            <TableCell>Metadata value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(dataOwner?.file.fileMetadata).map(key => (
                                            <TableRow>
                                                <TableCell>{getMetadataKeyLabel(key)}</TableCell>
                                                <TableCell>{dataOwner?.file.fileMetadata[key as keyof FileMetadata] as string}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Fragment>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button variant="outlined"
                                color="secondary"
                                onClick={onClose}
                        >
                            Close
                        </Button>
                        {!storageExpired && (
                            <Button variant="contained"
                                    color="primary"
                                    onClick={() => setExtendFileStorageDurationFile(dataOwner?.file)}
                            >
                                Prolong the term
                            </Button>
                        )}
                    </DialogActions>
                </Dialog>
                <ExtendDataOwnerFileStorageDurationDialog onClose={() => setExtendFileStorageDurationFile(undefined)}/>
            </Fragment>
        )
    } else {
        return null;
    }
};

const mapMobxToProps = (state: IAppState): DataOwnerDetailsDialogMobxProps => ({
    setExtendFileStorageDurationFile: state.fileStorageDurationExtension.setFile
});

export const DataOwnerDetailsDialog = withMobileDialog()(
    inject(mapMobxToProps)(observer(_DataOwnerDetailsDialog))
) as FunctionComponent<DataOwnerDetailsDialogOwnProps>;
