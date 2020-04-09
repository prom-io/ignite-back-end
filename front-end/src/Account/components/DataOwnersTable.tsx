import React, { FunctionComponent, Fragment, useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
  createStyles,
} from "@material-ui/core";
import { DataOwnerDetailsDialog } from "./DataOwnerDetailsDialog";
import { DataOwnerResponse } from "../../models";
import { makePreciseNumberString, shortenString } from "../../utils";

interface DataOwnersTableProps {
  dataOwners: DataOwnerResponse[];
}
const useStyles = makeStyles(() =>
  createStyles({
    headingCell: {
      fontSize: 18,
      color: "#131315",
    },
    bodyCell: {
      color: "#7A7A81",
    },
  })
);
export const DataOwnersTable: FunctionComponent<DataOwnersTableProps> = ({
  dataOwners,
}) => {
  const [selectedDataOwner, setSelectedDataOwner] = useState<
    DataOwnerResponse | undefined
  >(undefined);
  const classes = useStyles();
  return (
    <Fragment>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography className={classes.headingCell} variant="body1">
                Data owner
              </Typography>
              <Typography className={classes.headingCell} variant="body1">
                (Wallet ID)
              </Typography>
            </TableCell>
            <TableCell className={classes.headingCell}>Created</TableCell>
            <TableCell className={classes.headingCell}>Storing until</TableCell>
            <TableCell className={classes.headingCell}>Price (PROM)</TableCell>
            <TableCell className={classes.headingCell}>File ID</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {dataOwners.map((dataOwner) => (
            <TableRow>
              <TableCell className={classes.bodyCell}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedDataOwner(dataOwner)}
                >
                  <u>{shortenString(dataOwner.address, 16)}</u>
                </div>
              </TableCell>
              <TableCell className={classes.bodyCell}>
                {dataOwner.file &&
                  format(new Date(dataOwner.file.createdAt), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className={classes.bodyCell}>
                {dataOwner.file &&
                  format(new Date(dataOwner.file.keepUntil), "dd/MM/yyyy")}
              </TableCell>
              <TableCell className={classes.bodyCell}>
                {dataOwner.file &&
                  makePreciseNumberString(dataOwner.file.price)}
              </TableCell>
              <TableCell className={classes.bodyCell}>
                {dataOwner.file && shortenString(dataOwner.file.id, 16)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <DataOwnerDetailsDialog
        onClose={() => setSelectedDataOwner(undefined)}
        dataOwner={selectedDataOwner}
      />
    </Fragment>
  );
};
