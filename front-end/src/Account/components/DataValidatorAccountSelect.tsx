import React, { FunctionComponent } from "react";
import { InputLabel, MenuItem, Select } from "@material-ui/core";

interface DataValidatorAccountSelectProps {
  accounts: string[];
  onSelect: (address: string) => void;
  selectedAccount?: string;
}

export const DataValidatorAccountSelect: FunctionComponent<DataValidatorAccountSelectProps> = ({
  accounts,
  onSelect,
  selectedAccount,
}) => (
  <div
    style={{
      maxWidth: "100%",
      marginRight: 20,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    }}
  >
    <InputLabel htmlFor="dataValidatorSelect">Wallet</InputLabel>
    <Select
      value={selectedAccount || ""}
      onChange={(event) => onSelect(event.target.value as string)}
      style={{ maxWidth: 400 }}
    >
      {accounts.map((account) => (
        <MenuItem key={account} value={account}>
          {account}
        </MenuItem>
      ))}
    </Select>
  </div>
);
