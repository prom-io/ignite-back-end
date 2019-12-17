import React, {FunctionComponent} from "react";
import {Grid, Typography} from "@material-ui/core";
import {makePreciseNumberString} from "../../utils";
import {CopyToClipboardButton} from "../../CopyToClipboardButton";

interface UploadedFileDescriptorProps {
    fileId: string,
    storagePrice: number,
    dataOwnerAddress: string,
}

export const UploadedFileDescriptor: FunctionComponent<UploadedFileDescriptorProps> = ({
    fileId,
    storagePrice,
    dataOwnerAddress,
}) => (
    <Grid container spacing={2}>
        <Grid item xs={12}>
            <Typography variant="h6">
                You have successfully uploaded file
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="body1">
                Uploaded file id is {fileId} <CopyToClipboardButton textToCopy={fileId}/>
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="body1">
                Created data owner address is {dataOwnerAddress}
            </Typography>
        </Grid>
        <Grid item xs={12}>
            <Typography variant="body1">
                Storage price is {makePreciseNumberString(storagePrice)} PROM
            </Typography>
        </Grid>
    </Grid>
);
