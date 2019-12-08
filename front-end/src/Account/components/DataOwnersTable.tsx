import React, {FunctionComponent} from "react";
import {Table, TableHead, TableCell, TableBody, TableRow, Typography} from "@material-ui/core";
import {format} from "date-fns";
import {DataOwnerResponse} from "../../models";

interface DataOwnersTableProps {
    dataOwners: DataOwnerResponse[]
}

export const DataOwnersTable: FunctionComponent<DataOwnersTableProps> = ({
    dataOwners
}) => (
    <Table>
        <TableHead>
            <TableRow>
                <TableCell>
                    <Typography variant="body1">Data owner</Typography>
                    <Typography variant="body1">(Wallet ID)</Typography>
                </TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Storing until</TableCell>
                <TableCell>Price (PROM)</TableCell>
                <TableCell>File ID</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {dataOwners.map(dataOwner => (
                <TableRow>
                    <TableCell>{dataOwner.address}</TableCell>
                    <TableCell>{format(new Date(dataOwner.file.createdAt), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{format(new Date(dataOwner.file.storingUntil), "dd/MM/yyyy")}</TableCell>
                    <TableCell>{dataOwner.file.price}</TableCell>
                    <TableCell>{dataOwner.file.id}</TableCell>
                    <Typography><u>prolong</u></Typography>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
