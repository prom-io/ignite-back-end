import React, {FunctionComponent} from "react";
import {Hidden} from "@material-ui/core";
import Typography, {TypographyProps} from "@material-ui/core/Typography";
import {makePreciseNumberString} from "../../utils";

export type AccountBalanceProps = TypographyProps & {balance: number, address: string};

export const AccountBalance: FunctionComponent<AccountBalanceProps> = ({balance, address, ...rest}) => (
    <Typography {...rest}>
        <Hidden smDown><span style={{paddingRight: 30}}>Wallet ID {address}</span></Hidden> {makePreciseNumberString(balance)} PROM
    </Typography>
);
