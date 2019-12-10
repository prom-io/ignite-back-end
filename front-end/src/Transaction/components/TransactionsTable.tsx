import React, {FunctionComponent, Fragment, useState} from "react";
import {observer, inject} from "mobx-react";
import {toJS} from "mobx";
import {Table, TableHead, TableBody, TableRow, TableCell, CircularProgress, Typography} from "@material-ui/core";
import {TransactionDetailsDialog} from "./TransactionDetailsDialog";
import {TransactionResponse} from "../../models";
import {ApiError} from "../../api";
import {IAppState} from "../../store";
import {shortenString} from "../../utils";

interface TransactionsTableMobxProps {
    pending: boolean,
    transactions: TransactionResponse[],
    error?: ApiError
}

const _TransactionsTable: FunctionComponent<TransactionsTableMobxProps> = ({
    transactions,
    error,
    pending
}) => {
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionResponse | undefined>(undefined);
    console.log(toJS(transactions));

    return (
        <Fragment>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Data Mart (Wallet ID)</TableCell>
                        <TableCell>Sum</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Data owner</TableCell>
                        <TableCell>Trx</TableCell>
                        <TableCell>File ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {transactions.map(transaction => (
                        <TableRow key={transaction.hash}>
                            <TableCell>{transaction.dataMart}</TableCell>
                            <TableCell>{transaction.sum}</TableCell>
                            <TableCell>{transaction.createdAt}</TableCell>
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
            <TransactionDetailsDialog transaction={selectedTransaction}
                                       onClose={() => setSelectedTransaction(undefined)}
            />
        </Fragment>
    )
};

const mapMobxToProps = (state: IAppState): TransactionsTableMobxProps => ({
    transactions: state.transactions.transactions,
    pending: state.transactions.pending,
    error: state.transactions.error
});

export const TransactionsTable = inject(mapMobxToProps)(observer(_TransactionsTable) as FunctionComponent<{}>);
