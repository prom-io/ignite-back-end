import React, {Fragment, FunctionComponent, useState} from "react";
import {Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography, CircularProgress} from "@material-ui/core";
import {format, parse} from "date-fns";
import {TransactionDetailsDialog} from "./TransactionDetailsDialog";
import {TransactionResponse} from "../../models";
import {shortenString} from "../../utils";

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
                                <TableCell>Data Mart (Wallet ID)</TableCell>
                                <TableCell>Sum</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Data owner</TableCell>
                                <TableCell>Txn Hash</TableCell>
                                <TableCell>File ID</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.map(transaction => (
                                transaction && <TableRow key={transaction.hash}>
                                    <TableCell>{transaction.dataMart}</TableCell>
                                    <TableCell>{transaction.sum}</TableCell>
                                    <TableCell>{format(parse(transaction?.createdAt, "yyyy-MM-dd", new Date()), "dd/MM/yyyy")}</TableCell>
                                    <TableCell>{transaction.dataOwner.address}</TableCell>
                                    <TableCell>
                                        <Typography variant="body1"
                                                    style={{cursor: 'pointer'}}
                                                    onClick={() => setSelectedTransaction(transaction)}
                                        >
                                            <u>{shortenString(transaction.hash, 16)}</u>
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{transaction.dataOwner.file.id}</TableCell>
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
