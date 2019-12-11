import React, {FunctionComponent, Fragment, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableRow, Typography} from "@material-ui/core";
import {DataOwnerDetailsDialog} from "./DataOwnerDetailsDialog";
import {DataOwnerResponse} from "../../models";
import {format} from "date-fns";

interface DataOwnersTableProps {
    dataOwners: DataOwnerResponse[]
}

export const DataOwnersTable: FunctionComponent<DataOwnersTableProps> = ({
    dataOwners
}) => {
    const [selectedDataOwner, setSelectedDataOwner] = useState<DataOwnerResponse | undefined>(undefined);

    return (
        <Fragment>
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
                            <TableCell>{dataOwner.file && format(new Date(dataOwner.file.createdAt), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{dataOwner.file && format(new Date(dataOwner.file.keepUntil), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{dataOwner.file && dataOwner.file.price}</TableCell>
                            <TableCell>{dataOwner.file &&  dataOwner.file.id}</TableCell>
                            <Typography variant="body1"
                                        style={{cursor: 'pointer'}}
                                        onClick={() => setSelectedDataOwner(dataOwner)}>
                                <u>prolong</u>
                            </Typography>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <DataOwnerDetailsDialog onClose={() => setSelectedDataOwner(undefined)}
                                    dataOwner={selectedDataOwner}
            />
        </Fragment>
    )
};
