import React, { FunctionComponent } from "react";
import { inject, observer } from "mobx-react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { DataSalesTable } from "./DataSalesTable";
import { DataValidatorAccountSelect } from "../../Account";
import { ApiError } from "../../api";
import { TransactionResponse } from "../../models";
import { IAppState } from "../../store";

interface DataSalesHistoryContainerMobxProps {
  selectedAccount?: string;
  accounts: string[];
  pending: boolean;
  error?: ApiError;
  transactions: TransactionResponse[];
  selectAccount: (address: string) => void;
  fetchTransactions: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    dataSalesCard: {
      overflowX: "auto",
    },
  })
);

const _DataSalesHistoryContainer: FunctionComponent<DataSalesHistoryContainerMobxProps> = ({
  selectedAccount,
  accounts,
  pending,
  error,
  transactions,
  selectAccount,
  fetchTransactions,
}) => {
  const classes = useStyles();

  return (
    <Grid container spacing={2} style={{ display: "flex" }}>
      <Grid item xs={12} style={{ marginBottom: 20 }}>
        <DataValidatorAccountSelect
          accounts={accounts}
          onSelect={selectAccount}
          selectedAccount={selectedAccount}
        />
      </Grid>
      <Grid item xs={12}>
        {transactions.length === 0 && error && (
          <Typography variant="body1">
            Error occurred when tried to fetch transactions
          </Typography>
        )}
        <Card className={classes.dataSalesCard}>
          <CardHeader title="Data Sales" />
          <CardContent>
            <DataSalesTable
              transactions={transactions}
              pending={pending}
              onFetchMoreRequest={fetchTransactions}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const mapMobxToProps = (
  state: IAppState
): DataSalesHistoryContainerMobxProps => ({
  accounts: state.accounts.accounts.map((account) => account.address),
  selectAccount: state.transactions.setSelectedAccount,
  selectedAccount: state.transactions.selectedAccount,
  error: state.transactions.error,
  fetchTransactions: state.transactions.fetchTransactions,
  pending: state.transactions.pending,
  transactions: state.transactions.transactions,
});

export const DataSalesHistoryContainer = inject(mapMobxToProps)(
  observer(_DataSalesHistoryContainer) as FunctionComponent<{}>
);
