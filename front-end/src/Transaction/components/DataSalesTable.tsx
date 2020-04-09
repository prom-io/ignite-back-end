import React, { Fragment, FunctionComponent, useState } from "react";
import {
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { format, parse } from "date-fns";
import { DataSaleDetailsDialog } from "./DataSaleDetailsDialog";
import { TransactionResponse } from "../../models";
import { makePreciseNumberString, shortenString } from "../../utils";

interface DataSalesTableProps {
  pending: boolean;
  transactions: TransactionResponse[];
  onFetchMoreRequest: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    centered: {
      marginLeft: "auto",
      marginRight: "auto",
      display: "table",
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

export const DataSalesTable: FunctionComponent<DataSalesTableProps> = ({
  transactions,
  pending,
  onFetchMoreRequest,
}) => {
  const [selectedTransaction, setSelectedTransaction] = useState<
    TransactionResponse | undefined
  >(undefined);
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className={classes.headingCell}>
                  Data Mart (Wallet ID)
                </TableCell>
                <TableCell className={classes.headingCell}>Sum</TableCell>
                <TableCell className={classes.headingCell}>Date</TableCell>
                <TableCell className={classes.headingCell}>
                  Data owner
                </TableCell>
                <TableCell className={classes.headingCell}>Txn Hash</TableCell>
                <TableCell className={classes.headingCell}>File ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(
                (transaction) =>
                  transaction && (
                    <TableRow key={transaction.hash}>
                      <TableCell className={classes.bodyCell}>
                        {shortenString(transaction.dataMart, 16)}
                      </TableCell>
                      <TableCell className={classes.bodyCell}>
                        {makePreciseNumberString(transaction.sum)}
                      </TableCell>
                      <TableCell className={classes.bodyCell}>
                        {format(
                          parse(
                            transaction?.createdAt,
                            "yyyy-MM-dd",
                            new Date()
                          ),
                          "dd/MM/yyyy"
                        )}
                      </TableCell>
                      <TableCell className={classes.bodyCell}>
                        {shortenString(transaction.dataOwner.address, 16)}
                      </TableCell>
                      <TableCell className={classes.bodyCell}>
                        <Typography
                          variant="body1"
                          className={classes.bodyCell}
                          style={{ cursor: "pointer" }}
                          onClick={() => setSelectedTransaction(transaction)}
                        >
                          <u>{shortenString(transaction.hash, 16)}</u>
                        </Typography>
                      </TableCell>
                      <TableCell className={classes.bodyCell}>
                        {shortenString(transaction.dataOwner.file.id, 16)}
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
          {pending && (
            <CircularProgress
              size={25}
              color="primary"
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
      <DataSaleDetailsDialog
        transaction={selectedTransaction}
        onClose={() => setSelectedTransaction(undefined)}
      />
    </Fragment>
  );
};
