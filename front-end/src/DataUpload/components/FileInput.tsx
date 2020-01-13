import React, {FunctionComponent, Fragment} from "react";
import {Button, Typography} from "@material-ui/core";
import AttachIcon from "@material-ui/icons/AttachFileRounded";

interface FileInputProps {
    onFileAttached: (file: File) => void,
    file?: File
}

export const FileInput: FunctionComponent<FileInputProps> = ({onFileAttached, file}) => {
    const handleAttachment = (file?: File) => {
        if (file) {
            onFileAttached(file);
        }
    };

    return (
        <Fragment>
            <Button variant="contained"
                    component="label"
            >
                <AttachIcon/>
                Attach file
                <input type="file"
                       onChange={event => {
                           if (event.target.files !== null) {
                               handleAttachment(event.target.files[0])
                           }
                       }}
                       style={{display: "none"}}
                />
            </Button>
            {file && <Typography variant="body1" display="inline">{file.name}</Typography>}
        </Fragment>
    )
};
