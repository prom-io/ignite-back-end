import React, { Fragment, FunctionComponent } from "react";
import { inject, observer } from "mobx-react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@material-ui/core";
import withMobileDialog, {
  WithMobileDialog,
} from "@material-ui/core/withMobileDialog";
import { format } from "date-fns";
import { ExtendDataOwnerFileStorageDurationDialog } from "./ExtendDataOwnerFileStorageDurationDialog";
import {
  DataOwnerResponse,
  FileInfoResponse,
  FileMetadata,
} from "../../models";
import { getMetadataKeyLabel } from "../../utils";
import { IAppState } from "../../store";

interface DataOwnerDetailsDialogOwnProps {
  dataOwner?: DataOwnerResponse;
  onClose: () => void;
}

interface DataOwnerDetailsDialogMobxProps {
  setExtendFileStorageDurationFile: (
    file: FileInfoResponse | undefined
  ) => void;
}

type DataOwnerDetailsDialogProps = DataOwnerDetailsDialogOwnProps &
  DataOwnerDetailsDialogMobxProps &
  WithMobileDialog;

const _DataOwnerDetailsDialog: FunctionComponent<DataOwnerDetailsDialogProps> = ({
  dataOwner,
  onClose,
  fullScreen,
  setExtendFileStorageDurationFile,
}) => {
  if (dataOwner) {
    const storageDate = dataOwner.file
      ? new Date(dataOwner.file.keepUntil)
      : undefined;
    const storageExpired = storageDate
      ? new Date().getTime() - storageDate.getTime() > 0
      : true;

    return (
      <Fragment>
        <Dialog
          open
          fullScreen={fullScreen}
          onClose={onClose}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Data owner info</DialogTitle>
          <DialogContent style={{ marginBottom: 25 }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Wallet ID</TableCell>
                  <TableCell>{dataOwner?.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Private key</TableCell>
                  <TableCell>{dataOwner?.privateKey}</TableCell>
                </TableRow>
                {dataOwner?.file && storageDate && (
                  <Fragment>
                    <TableRow>
                      <TableCell>Creation date</TableCell>
                      <TableCell>
                        {format(
                          new Date(dataOwner.file.createdAt),
                          "dd/MM/yyyy"
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Must be stored until</TableCell>
                      <TableCell>
                        <b>{format(new Date(storageDate), "dd/MM/yyyy")}</b>
                      </TableCell>
                    </TableRow>
                  </Fragment>
                )}
              </TableBody>
            </Table>
            {dataOwner?.file && dataOwner.file.fileMetadata && (
              <Fragment>
                <br />
                <Typography variant="body1">File metadata</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <b>Metadata key</b>
                      </TableCell>
                      <TableCell>
                        <b>Metadata value</b>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.keys(dataOwner?.file.fileMetadata).map((key) => (
                      <TableRow>
                        <TableCell>{getMetadataKeyLabel(key)}</TableCell>
                        <TableCell>
                          {typeof dataOwner?.file.fileMetadata[
                            key as keyof FileMetadata
                          ] === "string"
                            ? (dataOwner?.file.fileMetadata[
                                key as keyof FileMetadata
                              ] as string)
                            : (dataOwner?.file.fileMetadata[
                                key as keyof FileMetadata
                              ] as string[]).map((tag) => `${tag}; `)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Fragment>
            )}
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="secondary" onClick={onClose}>
              Close
            </Button>
            {!storageExpired && (
              <Button
                variant="contained"
                color="primary"
                onClick={() =>
                  setExtendFileStorageDurationFile(dataOwner?.file)
                }
              >
                Prolong the term
              </Button>
            )}
          </DialogActions>
        </Dialog>
        <ExtendDataOwnerFileStorageDurationDialog
          onClose={() => setExtendFileStorageDurationFile(undefined)}
        />
      </Fragment>
    );
  } else {
    return null;
  }
};

const mapMobxToProps = (state: IAppState): DataOwnerDetailsDialogMobxProps => ({
  setExtendFileStorageDurationFile: state.fileStorageDurationExtension.setFile,
});

export const DataOwnerDetailsDialog = withMobileDialog()(
  inject(mapMobxToProps)(observer(_DataOwnerDetailsDialog))
) as FunctionComponent<DataOwnerDetailsDialogOwnProps>;
