import React, {Fragment, FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
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
import {ExtendDataOwnerFileStorageDurationDialog} from "../../Account";
import {FileInfoResponse, FileMetadata, TransactionResponse} from "../../models";
import {getMetadataKeyLabel, makePreciseNumberString} from "../../utils";
import {IAppState} from "../../store";

interface TransactionDetailDialogOwnProps {
    transaction?: TransactionResponse,
    onClose: () => void
}

interface TransactionDetailsDialogMobxProps {
    setExtendFileStorageDurationFile: (file?: FileInfoResponse) => void
}

type TransactionDetailDialogProps = TransactionDetailDialogOwnProps & TransactionDetailsDialogMobxProps & WithMobileDialog;

const _TransactionsDetailsDialog: FunctionComponent<TransactionDetailDialogProps> = ({
    transaction,
    fullScreen,
    onClose,
    setExtendFileStorageDurationFile
}) => {
    if (transaction) {
        const storageDate = new Date(transaction.file.keepUntil);
        const storageExpired = new Date().getTime() - storageDate.getTime() > 0;

        return (
            <Fragment>
                <Dialog open={Boolean(transaction)}
                        fullScreen={fullScreen}
                        onClose={onClose}
                        fullWidth
                        maxWidth="md"
                >
                    <DialogTitle>
                        Data Point Sale Info
                    </DialogTitle>
                    <DialogContent style={{marginBottom: 30}}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Data mart</TableCell>
                                    <TableCell>{transaction?.dataMart}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Sum</TableCell>
                                    <TableCell>{makePreciseNumberString(transaction?.sum)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Sale date</TableCell>
                                    <TableCell>{format(parse(transaction?.createdAt, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Txn Hash</TableCell>
                                    <TableCell>{transaction?.hash}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Data owner</TableCell>
                                    <TableCell>{transaction?.dataOwner.address}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Private key</TableCell>
                                    <TableCell>{transaction?.dataOwner.privateKey}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Creation date</TableCell>
                                    <TableCell>{format(new Date(transaction?.dataOwner.file.createdAt), "dd/MM/yyyy")}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Must be stored until</TableCell>
                                    <TableCell><b>{format(storageDate , "dd/MM/yyyy")}</b></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {transaction?.dataOwner.file.fileMetadata && (
                            <Fragment>
                                <br/>
                                <Typography variant="body1">
                                    File metadata
                                </Typography>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Metadata key</b></TableCell>
                                            <TableCell><b>Metadata value</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(transaction.file.fileMetadata).map((key) => (
                                            <TableRow>
                                                <TableCell>{getMetadataKeyLabel(key)}</TableCell>
                                                <TableCell>
                                                    {
                                                        typeof transaction?.file.fileMetadata[key as keyof FileMetadata] === "string"
                                                            ? transaction?.file.fileMetadata[key as keyof FileMetadata] as string
                                                            : (transaction?.file.fileMetadata[key as keyof FileMetadata] as string[]).map(tag => `${tag}; `)
                                                    }
                                                </TableCell>
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
                                    onClick={() => setExtendFileStorageDurationFile(transaction?.file)}
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

const mapMobxToProps = (state: IAppState): TransactionDetailsDialogMobxProps => ({
    setExtendFileStorageDurationFile: state.fileStorageDurationExtension.setFile
});

export const TransactionDetailsDialog = withMobileDialog()(inject(mapMobxToProps)(observer(_TransactionsDetailsDialog))) as FunctionComponent<TransactionDetailDialogOwnProps>;
