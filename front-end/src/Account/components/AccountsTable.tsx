import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {
    Card,
    CardContent,
    CardHeader,
    Checkbox,
    createStyles,
    makeStyles,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from "@material-ui/core";
import {AccountBalanceMapping, AccountResponse} from "../../models";
import {makePreciseNumberString} from "../../utils";
import {IAppState} from "../../store";

interface AccountsTableMobxProps {
    accounts: AccountResponse[],
    balances: AccountBalanceMapping,
    defaultAccountAddress?: string,
    setDefaultAccount: (address: string) => void
}

const useStyles = makeStyles(() => createStyles({
    accountsTableCard: {
        overflowX: "auto"
    }
}));

const _AccountsTable: FunctionComponent<AccountsTableMobxProps> = ({
    accounts,
    balances,
    defaultAccountAddress,
    setDefaultAccount
}) => {
    const classes = useStyles();

    return (
        <Card className={classes.accountsTableCard}>
            <CardHeader title="Your wallets"/>
            <CardContent>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><b>Address</b></TableCell>
                            <TableCell><b>Balance</b></TableCell>
                            <TableCell><b>Is default</b></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {accounts.map(account => (
                            <TableRow>
                                <TableCell>{account.address}</TableCell>
                                <TableCell>{makePreciseNumberString(balances[account.address], 8)}</TableCell>
                                <TableCell>
                                    <Checkbox checked={account.address === defaultAccountAddress}
                                              onChange={() => setDefaultAccount(account.address)}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
};

const mapMobxToProps = (state: IAppState): AccountsTableMobxProps => ({
    accounts: state.accounts.accounts,
    balances: state.balances.accountsBalances,
    defaultAccountAddress: state.settings.selectedDataValidatorAccount,
    setDefaultAccount: state.settings.selectDataValidatorAccount
});

export const AccountsTable = inject(mapMobxToProps)(observer(_AccountsTable as FunctionComponent));
