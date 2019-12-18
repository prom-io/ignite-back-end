import React, {Fragment, FunctionComponent} from "react";
import {InputLabel, MenuItem, Select} from "@material-ui/core";

interface DataValidatorAccountSelectProps {
    accounts: string[],
    onSelect: (address: string) => void,
    selectedAccount?: string
}

export const DataValidatorAccountSelect: FunctionComponent<DataValidatorAccountSelectProps> = ({
    accounts,
    onSelect,
    selectedAccount
}) => (
    <Fragment>
        <InputLabel htmlFor="dataValidatorSelect">
            Wallet
        </InputLabel>
        <Select value={selectedAccount}
                onChange={event => onSelect(event.target.value as string)}
        >
            {accounts.map(account => (
                <MenuItem key={account}
                          value={account}
                >
                    {account}
                </MenuItem>
            ))}
        </Select>
    </Fragment>
);
