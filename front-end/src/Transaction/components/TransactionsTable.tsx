import React, { Fragment, FunctionComponent, ReactNode, useState } from "react";
import {
  Button,
  CircularProgress,
  createStyles,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { format, parse } from "date-fns";
import { DataSaleDetailsDialog } from "./DataSaleDetailsDialog";
import { DataOwnerDetailsDialog } from "../../Account";
import { TransactionResponse } from "../../models";
import { makePreciseNumberString, shortenString } from "../../utils";

interface TransactionsTableProps {
  transactions: TransactionResponse[];
  pending: boolean;
  onFetchMoreRequest: () => void;
}
const useStyles = makeStyles(() =>
  createStyles({
    centered: {
      marginLeft: "auto",
      marginRight: "auto",
      display: "table",
    },
    linkLike: {
      cursor: "pointer",
      textDecoration: "underline",
    },
  })
);

export const TransactionsTable: FunctionComponent<TransactionsTableProps> = ({
  transactions,
  pending,
  onFetchMoreRequest,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<
    TransactionResponse | undefined
  >(undefined);
  const classes = useStyles();
  let transactionDetailsDialog: ReactNode | null = null;
  if (selectedTransaction) {
    if (selectedTransaction.type === "dataUpload") {
      transactionDetailsDialog = (
        <DataOwnerDetailsDialog
          onClose={() => setSelectedTransaction(undefined)}
          dataOwner={selectedTransaction?.dataOwner}
        />
      );
    } else {
      transactionDetailsDialog = (
        <DataSaleDetailsDialog
          onClose={() => setSelectedTransaction(undefined)}
          transaction={selectedTransaction}
        />
      );
    }
  }

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>Txn Hash</b>
                </TableCell>
                <TableCell>
                  <b>Date</b>
                </TableCell>
                <TableCell>
                  <b>Value</b>
                </TableCell>
                <TableCell>
                  <b>Data owner</b>
                </TableCell>
                {/* <TableCell>
                  <b>Service node</b>
                </TableCell> */}
                <TableCell>
                  <b>Data mart</b>
                </TableCell>
                <TableCell>
                  <b>Type</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow>
                  <TableCell>
                    <Tooltip title="View details">
                      <Typography
                        variant="body1"
                        className={classes.linkLike}
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        {shortenString(transaction.hash, 16)}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {format(
                      parse(transaction.createdAt, "yyyy-MM-dd", new Date()),
                      "dd/MM/yyyy"
                    )}
                  </TableCell>
                  <TableCell>
                    {makePreciseNumberString(transaction.sum)}
                  </TableCell>
                  <TableCell>
                    {shortenString(transaction.dataOwner.address, 16)}
                  </TableCell>
                  {/* <TableCell>
                    {shortenString(transaction.serviceNode, 16)}
                  </TableCell> */}
                  <TableCell>
                    {shortenString(transaction.dataMart, 16)}
                  </TableCell>
                  <TableCell>
                    {transaction.type === "dataPurchase"
                      ? "Data sale"
                      : "Data upload"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {pending && (
            <CircularProgress
              color="primary"
              size={25}
              className={classes.centered}
            />
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="outlined"
            color="primary"
            onClick={onFetchMoreRequest}
            disabled={pending}
          >
            Load more
          </Button>
        </Grid>
      </Grid>
      {transactionDetailsDialog}
    </Fragment>
  );
};
