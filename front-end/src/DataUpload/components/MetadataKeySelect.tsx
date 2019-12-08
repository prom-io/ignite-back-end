import React, {FunctionComponent, Fragment} from "react";
import {Select, MenuItem, InputLabel} from "@material-ui/core";
import {FileMetadata} from "../../models";
import {getMetadataKeyLabel} from "../../utils";

interface MetadataKeySelectProps {
    selectedKey?: keyof FileMetadata,
    error?: string,
    onSelect: (key: keyof FileMetadata) => void
}

const keys: Array<keyof FileMetadata> = ["briefDescription", "fullDescription", "hashTags", "userComment", "author"];

export const MetadataKeySelect: FunctionComponent<MetadataKeySelectProps> = ({
    selectedKey,
    onSelect
}) => {
    return (
        <Fragment>
            <InputLabel htmlFor="metadataKeySelect">Metadata key</InputLabel>
            <Select value={selectedKey}
                    onChange={event => onSelect(event.target.value as keyof FileMetadata)}
                    style={{width: '100%'}}
            >
                {keys.map(key => (
                    <MenuItem key={key}
                              value={key}
                    >
                        {getMetadataKeyLabel(key)}
                    </MenuItem>
                ))}
            </Select>
        </Fragment>
    )
};
