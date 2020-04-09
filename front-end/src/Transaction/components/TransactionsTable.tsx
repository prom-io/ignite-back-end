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
    headingCell: {
      fontSize: 18,
      color: "#131315",
    },
    bodyCell: {
      color: "#7A7A81",
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
                <TableCell className={classes.headingCell}>Txn Hash</TableCell>
                <TableCell className={classes.headingCell}>Date</TableCell>
                <TableCell className={classes.headingCell}>Value</TableCell>
                <TableCell className={classes.headingCell}>
                  Data owner
                </TableCell>
                {/* <TableCell>
                  Service node
                </TableCell> */}
                <TableCell className={classes.headingCell}>Data mart</TableCell>
                <TableCell className={classes.headingCell}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow>
                  <TableCell className={classes.bodyCell}>
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
                  <TableCell className={classes.bodyCell}>
                    {format(
                      parse(transaction.createdAt, "yyyy-MM-dd", new Date()),
                      "dd/MM/yyyy"
                    )}
                  </TableCell>
                  <TableCell className={classes.bodyCell}>
                    {makePreciseNumberString(transaction.sum)}
                  </TableCell>
                  <TableCell className={classes.bodyCell}>
                    {shortenString(transaction.dataOwner.address, 16)}
                  </TableCell>
                  {/* <TableCell>
                    {shortenString(transaction.serviceNode, 16)}
                  </TableCell> */}
                  <TableCell className={classes.bodyCell}>
                    {shortenString(transaction.dataMart, 16)}
                  </TableCell>
                  <TableCell className={classes.bodyCell}>
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
