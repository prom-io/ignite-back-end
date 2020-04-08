import React, { FunctionComponent } from "react";
import { Hidden } from "@material-ui/core";
import Typography, { TypographyProps } from "@material-ui/core/Typography";
import { makePreciseNumberString } from "../../utils";

export type AccountBalanceProps = TypographyProps & {
  balance: number;
  address: string;
};

export const AccountBalance: FunctionComponent<AccountBalanceProps> = ({
  balance,
  address,
  ...rest
}) => (
  <Typography
    {...rest}
    style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end" }}
  >
    <Hidden smDown>
      <span
        style={{ display: "inline-block", color: "#7A7A81", paddingLeft: 30 }}
      >
        Default Wallet ID {address}
      </span>
    </Hidden>
    <span
      style={{ display: "inline-block", color: "#FB6C1C", paddingLeft: 30 }}
    >
      {" "}
      {makePreciseNumberString(balance)} PROM
    </span>
  </Typography>
);
