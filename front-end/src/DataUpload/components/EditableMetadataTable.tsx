import * as React from "react";
import {inject, observer} from "mobx-react";
import {
    Grid,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    Tooltip
} from "@material-ui/core";
import RemoveIcon from "@material-ui/icons/Remove";
import {OpenAddFileMetadataDialogButton} from "./OpenAddFileMetadataDialogButton";
import {AddFileMetadataDialog} from "./AddFileMetadataDialog";
import {IAppState} from "../../store";

interface EditableMetaDataTableProps {
    entries: Map<string, string>,
    addEntry: (key: string, value: string) => void,
    removeEntry: (key: string) => void
}

const _EditableMetadataTable: React.FC<EditableMetaDataTableProps> = ({
    addEntry,
    removeEntry,
    entries
}) => {
    const rows: React.ReactNode[] = [];

    entries.forEach((value, key) => rows.push(
        <TableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{value}</TableCell>
            <TableCell size="small">
                <Tooltip title="Remove">
                    <IconButton onClick={() => removeEntry(key)}
                                size="small"
                    >
                        <RemoveIcon/>
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    ));

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant="body1">
                    File metadata
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {entries.size === 0
                    ? (
                        <div>
                            <Typography variant="body2">
                                Add some metadata
                                <OpenAddFileMetadataDialogButton/>
                            </Typography>
                        </div>
                    )
                    : (
                        <Table>
                            <TableHead title="File metadata">
                                <TableRow>
                                    <TableCell>Metadata key</TableCell>
                                    <TableCell>Metadata value</TableCell>
                                    <TableCell size="small"/>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows}
                            </TableBody>
                        </Table>
                    )
                }
            </Grid>
            {entries.size !== 0 && (
                <Grid item xs={12}>
                    <div style={{marginLeft: '50%'}}>
                        <OpenAddFileMetadataDialogButton/>
                    </div>
                </Grid>
            )}
            <AddFileMetadataDialog onAdd={(key, value) => addEntry(key, value)}/>
        </Grid>
    )
};

const mapMobxToProps = (state: IAppState): EditableMetaDataTableProps => ({
    addEntry: state.dataUpload.setAdditionalField,
    removeEntry: state.dataUpload.removeAdditionalField,
    entries: state.dataUpload.uploadDataForm.additional!
});

export const EditableMetadataTable = inject(mapMobxToProps)(observer(_EditableMetadataTable)) as React.FC<any>;
