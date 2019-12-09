import * as React from "react";
import {Grid, Typography} from "@material-ui/core";
import {DataValidatorAccountCard} from "./DataValidatorAccountCard";
import {AccountBalanceMapping, AccountResponse, DataOwnerResponse} from "../../models";

interface DataValidatorAccountsListProps {
    accounts: AccountResponse[],
    balances: AccountBalanceMapping,
    dataOwners: {[dataValidatorAddress: string]: DataOwnerResponse[]}
    defaultAccount?: string,
    onDefaultAccountSelected: (address: string) => void,
}

export const DataValidatorAccountsList: React.FC<DataValidatorAccountsListProps> = ({
    balances,
    accounts,
    defaultAccount,
    onDefaultAccountSelected,
    dataOwners
}) => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Typography variant="subtitle1">
                Your accounts
            </Typography>
        </Grid>
        {accounts.map(account => (
            <Grid item xs={12} key={account.address}>
                <DataValidatorAccountCard address={account.address}
                                          dataOwners={dataOwners[account.address] || []}
                                          balance={balances[account.address]}
                                          selectedAsDefault={defaultAccount === account.address}
                                          onSelect={onDefaultAccountSelected}
                />
            </Grid>
        ))}
    </Grid>
);
