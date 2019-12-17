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
                            <Typography variant="body1"><b>Data owner</b></Typography>
                            <Typography variant="body1"><b>(Wallet ID)</b></Typography>
                        </TableCell>
                        <TableCell><b>Created</b></TableCell>
                        <TableCell><b>Storing until</b></TableCell>
                        <TableCell><b>Price (PROM)</b></TableCell>
                        <TableCell><b>File ID</b></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {dataOwners.map(dataOwner => (
                        <TableRow>
                            <TableCell>
                                <div style={{cursor: 'pointer'}}
                                     onClick={() => setSelectedDataOwner(dataOwner)}>
                                    <u>{dataOwner.address}</u>
                                </div>
                            </TableCell>
                            <TableCell>{dataOwner.file && format(new Date(dataOwner.file.createdAt), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{dataOwner.file && format(new Date(dataOwner.file.keepUntil), "dd/MM/yyyy")}</TableCell>
                            <TableCell>{dataOwner.file && dataOwner.file.price}</TableCell>
                            <TableCell>{dataOwner.file && dataOwner.file.id}</TableCell>
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
