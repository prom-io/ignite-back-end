import React, {Fragment, FunctionComponent, useState} from "react";
import {Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress} from "@material-ui/core";
import {format, parse} from "date-fns";
import {TransactionDetailsDialog} from "./TransactionDetailsDialog";
import {TransactionResponse} from "../../models";
import {makePreciseNumberString, shortenString} from "../../utils";

interface TransactionsTableProps {
    pending: boolean,
    transactions: TransactionResponse[],
    onFetchMoreRequest: () => void
}

export const TransactionsTable: FunctionComponent<TransactionsTableProps> = ({
    transactions,
    pending,
    onFetchMoreRequest
}) => {
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | undefined>(undefined);

    return (
        <Fragment>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>Data Mart (Wallet ID)</b></TableCell>
                                <TableCell><b>Sum</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                                <TableCell><b>Data owner</b></TableCell>
                                <TableCell><b>Txn Hash</b></TableCell>
                                <TableCell><b>File ID</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map(transaction => (
                                transaction && <TableRow key={transaction.hash}>
                                    <TableCell>{shortenString(transaction.dataMart, 16)}</TableCell>
                                    <TableCell>{makePreciseNumberString(transaction.sum)}</TableCell>
                                    <TableCell>{format(parse(transaction?.createdAt, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>{shortenString(transaction.dataOwner.address, 16)}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1"
                                                    style={{cursor: 'pointer'}}
                                                    onClick={() => setSelectedTransaction(transaction)}
                                        >
                                            <u>{shortenString(transaction.hash, 16)}</u>
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{shortenString(transaction.dataOwner.file.id, 16)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item xs={12}>
                    {pending && <CircularProgress size={15} color="primary"/>}
                    <Button variant="outlined"
                            color="primary"
                            onClick={onFetchMoreRequest}
                    >
                        Load more
                    </Button>
                </Grid>
            </Grid>
            <TransactionDetailsDialog transaction={selectedTransaction}
                                       onClose={() => setSelectedTransaction(undefined)}
            />
        </Fragment>
    )
};
