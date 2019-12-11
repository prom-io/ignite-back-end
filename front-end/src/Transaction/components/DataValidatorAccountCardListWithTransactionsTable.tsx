import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Grid} from "@material-ui/core";
import {DataValidatorAccountCard} from "../../Account";
import {IAppState} from "../../store";
import {AccountBalanceMapping, AccountResponse, DataOwnerResponse, TransactionsByAddresses} from "../../models";
import {TransactionsTable} from "./TransactionsTable";
import {toJS} from "mobx";

interface DataValidatorAccountCardListWithTransactionsTableMobxProps {
    accounts: AccountResponse[],
    dataOwners: {[dataValidatorAddress: string]: DataOwnerResponse[]}
    balances: AccountBalanceMapping,
    transactions: TransactionsByAddresses,
    fetchTransactions: (address: string) => void,
    selectAsDefault: (address: string) => void,
    defaultAccount?: string
}

const _DataValdiatorAccountCardListWithTransactionsTable: FunctionComponent<DataValidatorAccountCardListWithTransactionsTableMobxProps> = ({
    accounts,
    balances,
    transactions,
    fetchTransactions,
    selectAsDefault,
    dataOwners,
    defaultAccount
}) => {
    const handleFetchTransactionsRequest = (address: string) => {
        fetchTransactions(address);
    };

    const handleSelect = (address: string): void => {
        selectAsDefault(address)
    };

    return (
        <Grid container spacing={2}>
            {accounts.map(account => (
                <Grid item xs={12}>
                    <DataValidatorAccountCard address={account.address}
                                              balance={balances[account.address]}
                                              selectedAsDefault={defaultAccount === account.address}
                                              onSelect={handleSelect}
                                              numberOfDataOwners={dataOwners[account.address].length}
                                              onExpand={() => handleFetchTransactionsRequest(account.address)}
                                              hideDataOwnerCreationButton
                    >
                        {transactions[account.address].pending
                            ? <div>Loading...</div>
                            :  <TransactionsTable pending={transactions[account.address].pending}
                                                  transactions={transactions[account.address].transactions}
                                                  onFetchMoreRequest={() => handleFetchTransactionsRequest(account.address)}
                            />
                        }
                    </DataValidatorAccountCard>
                </Grid>
            ))}
        </Grid>
    )
};

const mapMobxToProps = (state: IAppState): DataValidatorAccountCardListWithTransactionsTableMobxProps => ({
    transactions: state.transactions.transactions,
    dataOwners: state.dataOwners.dataOwners,
    defaultAccount: state.settings.selectedDataValidatorAccount,
    balances: state.balances.accountsBalances,
    accounts: state.accounts.accounts,
    selectAsDefault: state.settings.selectDataValidatorAccount,
    fetchTransactions: state.transactions.fetchTransactions
});

export const DataValidatorAccountCardListWithTransactionsTable = inject(mapMobxToProps)(observer(_DataValdiatorAccountCardListWithTransactionsTable as FunctionComponent<{}>));
