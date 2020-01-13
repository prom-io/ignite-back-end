import React, {FunctionComponent} from "react";
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
import {FileMetadata} from "../../models";
import {getMetadataKeyLabel} from "../../utils";

interface EditableMetaDataTableProps {
    entries: FileMetadata,
    addEntry: (key: keyof FileMetadata, value: string | string[]) => void,
    removeEntry: (key: keyof FileMetadata) => void
}

const getLabelForMetadataEntry = (entry: string | string[] | undefined): string => {
    if (entry) {
        if (typeof entry === "string") {
            return entry;
        } else {
            const tags = entry as string[];
            let label = "";
            tags.forEach(tag => label = `${label} ${tag};`);
            return label;
        }
    } else {
        return "";
    }
};

const _EditableMetadataTable: FunctionComponent<EditableMetaDataTableProps> = ({
    addEntry,
    removeEntry,
    entries
}) => {
    const rows: React.ReactNode[] = [];

    Object.keys(entries).forEach(key => rows.push(
        <TableRow key={key}>
            <TableCell>{getMetadataKeyLabel(key as keyof FileMetadata)}</TableCell>
            <TableCell>
                {getLabelForMetadataEntry(entries[key as keyof FileMetadata])}
            </TableCell>
            <TableCell size="small">
                <Tooltip title="Remove">
                    <IconButton onClick={() => removeEntry(key as keyof FileMetadata)}
                                size="small"
                    >
                        <RemoveIcon/>
                    </IconButton>
                </Tooltip>
            </TableCell>
        </TableRow>
    ));
    rows.push(
        <TableRow>
            <TableCell></TableCell>
            <TableCell>
                <OpenAddFileMetadataDialogButton/>
            </TableCell>
        </TableRow>
    );

    return (
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Typography variant="body1">
                    File metadata
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {Object.keys(entries).length === 0
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
            <AddFileMetadataDialog onAdd={(key, value) => addEntry(key, value)}/>
        </Grid>
    )
};

const mapMobxToProps = (state: IAppState): EditableMetaDataTableProps => ({
    addEntry: state.dataUpload.setAdditionalField,
    removeEntry: state.dataUpload.removeAdditionalField,
    entries: state.dataUpload.uploadDataForm.additional!
});

export const EditableMetadataTable = inject(mapMobxToProps)(observer(_EditableMetadataTable) as FunctionComponent);
