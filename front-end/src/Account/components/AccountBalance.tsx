import React, {FunctionComponent} from "react";
import Typography, {TypographyProps} from "@material-ui/core/Typography";

export type AccountBalanceProps = TypographyProps & {balance: number};

export const AccountBalance: FunctionComponent<AccountBalanceProps> = ({balance, ...rest}) => (
    <Typography {...rest}>
        {balance} PROM
    </Typography>
);
