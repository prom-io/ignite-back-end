import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Card, CardContent, CardHeader, createStyles, Grid, makeStyles} from "@material-ui/core";
import {TransactionsTable} from "./TransactionsTable";
import {DataValidatorAccountSelect} from "../../Account";
import {TransactionResponse} from "../../models";
import {ApiError} from "../../api";
import {IAppState} from "../../store";

interface TransactionsHistoryContainerMobxProps {
    transactions: TransactionResponse[],
    pending: boolean,
    error?: ApiError,
    selectedAccount?: string,
    accounts: string[],
    fetchTransactions: () => void,
    selectAccount: (address: string) => void
}

interface TransactionsHistoryContainerOwnProps {
    hideAccountSelect: boolean
}

type TransactionsHistoryContainerProps = TransactionsHistoryContainerMobxProps & TransactionsHistoryContainerOwnProps;

const useStyles = makeStyles(() => createStyles({
    transactionsHistoryCard: {
        overflowX: "auto"
    }
}));

const _TransactionsHistoryContainer: FunctionComponent<TransactionsHistoryContainerProps> = ({
    transactions,
    pending,
    error,
    selectedAccount,
    accounts,
    fetchTransactions,
    selectAccount,
    hideAccountSelect = false
}) => {
    const classes = useStyles();

    return (
        <Grid container spacing={2}>
            {!hideAccountSelect && (
                <Grid item xs={12}>
                    <DataValidatorAccountSelect accounts={accounts}
                                                selectedAccount={selectedAccount}
                                                onSelect={selectAccount}
                    />
                </Grid>
            )}
            <Grid item xs={12}>
                <Card className={classes.transactionsHistoryCard}>
                    <CardHeader title={selectedAccount ? `Transactions history of ${selectedAccount}` : "Transactions history"}/>
                    <CardContent>
                        <TransactionsTable transactions={transactions}
                                           pending={pending}
                                           onFetchMoreRequest={fetchTransactions}
                        />
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    )
};

const mapMobxToProps = (state: IAppState): TransactionsHistoryContainerMobxProps => ({
    accounts: state.accounts.accounts.map(account => account.address),
    selectAccount: state.transactions.setSelectedAccount,
    selectedAccount: state.transactions.selectedAccount,
    error: state.transactions.error,
    fetchTransactions: state.transactions.fetchTransactions,
    pending: state.transactions.pending,
    transactions: state.transactions.transactions
});

export const TransactionsHistoryContainer = inject(mapMobxToProps)(observer(_TransactionsHistoryContainer) as FunctionComponent<TransactionsHistoryContainerOwnProps>);
