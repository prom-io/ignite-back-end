import React, {FunctionComponent} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@material-ui/core";
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
                    <TableCell>{dataOwner.file.createdAt}</TableCell>
                    <TableCell>{dataOwner.file.keepUntil}</TableCell>
                    <TableCell>{dataOwner.file.price}</TableCell>
                    <TableCell>{dataOwner.file.id}</TableCell>
                    <Typography><u>prolong</u></Typography>
                </TableRow>
            ))}
        </TableBody>
    </Table>
);
