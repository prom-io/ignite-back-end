import React, {Fragment, FunctionComponent} from "react";
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
import {DataOwnerResponse, FileMetadata} from "../../models";
import {getMetadataKeyLabel} from "../../utils";

interface DataOwnerDetailsDialogOwnProps {
    dataOwner?: DataOwnerResponse,
    onClose: () => void
}

type DataOwnerDetailsDialogProps = DataOwnerDetailsDialogOwnProps & WithMobileDialog;

const _DataOwnerDetailsDialog: FunctionComponent<DataOwnerDetailsDialogProps> = ({
    dataOwner,
    onClose,
    fullScreen
}) => {
    if (dataOwner) {
        return (
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
                    {dataOwner?.file && <Typography variant="body1">Store until: {format(new Date(dataOwner?.file.keepUntil), "dd/MM/yyyy")}</Typography>}
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
                    <Button variant="contained"
                            color="primary"
                    >
                        Prolong the term
                    </Button>
                </DialogActions>
            </Dialog>
        )
    } else {
        return null;
    }
};

export const DataOwnerDetailsDialog = withMobileDialog()(_DataOwnerDetailsDialog) as FunctionComponent<DataOwnerDetailsDialogOwnProps>;
