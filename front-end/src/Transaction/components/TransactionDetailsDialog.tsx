import React, {Fragment, FunctionComponent} from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody
} from "@material-ui/core";
import withMobileDialog, {WithMobileDialog} from "@material-ui/core/withMobileDialog";
import {parse, format} from "date-fns";
import {FileMetadata, TransactionResponse} from "../../models";
import {getMetadataKeyLabel} from "../../utils";

interface TransactionDetailDialogOwnProps {
    transaction?: TransactionResponse,
    onClose: () => void
}

type TransactionDetailDialogProps = TransactionDetailDialogOwnProps & WithMobileDialog;

const _TransactionsDetailsDialog: FunctionComponent<TransactionDetailDialogProps> = ({
    transaction,
    fullScreen,
    onClose
}) => {
    if (transaction) {
        const storageDate = new Date(transaction.file.keepUntil);
        const storageExpired = new Date().getTime() - storageDate.getTime() > 0;

        return (
            <Dialog open={Boolean(transaction)}
                    fullScreen={fullScreen}
                    onClose={onClose}
                    fullWidth
                    maxWidth="lg"
            >
                <DialogTitle>
                    Data Point Sale Info
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Data Mart: {transaction?.dataMart}</Typography>
                    <Typography variant="body1">Sum: {transaction?.sum}</Typography>
                    <Typography variant="body1">Sale date: {format(parse(transaction?.createdAt, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}</Typography>
                    <Typography variant="body1">Trx Id: {transaction?.hash}</Typography>
                    <Typography variant="body1">Data owner: {transaction?.dataOwner.address}</Typography>
                    <Typography variant="body1">Private key: {transaction?.dataOwner.privateKey}</Typography>
                    <Typography variant="body1">Creation date: {format(new Date(transaction?.dataOwner.file.createdAt), "dd/MM/yyyy")}</Typography>
                    <Typography variant="body1">Must be stored until: <b>{format(storageDate , "dd/MM/yyyy")}</b></Typography>
                    {transaction?.dataOwner.file.fileMetadata && (
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
                                    {Object.keys(transaction.dataOwner?.file.fileMetadata).map(key => (
                                        <TableRow>
                                            <TableCell>{getMetadataKeyLabel(key)}</TableCell>
                                            <TableCell>{transaction?.dataOwner?.file.fileMetadata[key as keyof FileMetadata] as string}</TableCell>
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
                                onClick={onClose}
                        >
                            Prolong the term
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        )
    } else {
        return null;
    }
};

export const TransactionDetailsDialog = withMobileDialog()(_TransactionsDetailsDialog) as FunctionComponent<TransactionDetailDialogOwnProps>;
