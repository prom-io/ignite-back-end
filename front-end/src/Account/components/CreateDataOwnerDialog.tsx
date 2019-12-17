import React, {FunctionComponent, Fragment} from "react";
import {inject, observer} from "mobx-react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress} from "@material-ui/core";
import withMobileDialog, {WithMobileDialog} from "@material-ui/core/withMobileDialog";
import {UploadDataForm} from "../../DataUpload";
import {IAppState} from "../../store";
import {UploadDataResponse} from "../../models";

interface CreateDataOwnersDialogMobxProps {
    dialogOpen: boolean,
    setDialogOpen: (dialogOpen: boolean) => void,
    createDataOwner: () => Promise<void>,
    pending: boolean,
    uploadDataResponse?: UploadDataResponse,
    resetDataUpload: () => void
}

type CreateDataOwnersDialogProps = CreateDataOwnersDialogMobxProps & WithMobileDialog;

const _CreateDataOwnerDialog: FunctionComponent<CreateDataOwnersDialogProps> = ({
    dialogOpen,
    setDialogOpen,
    createDataOwner,
    fullScreen,
    pending,
    uploadDataResponse,
    resetDataUpload
}) => (
    <Dialog open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            fullScreen={fullScreen}
    >
        <DialogTitle>
            Data owner
        </DialogTitle>
        <DialogContent>
            <UploadDataForm/>
        </DialogContent>
        <DialogActions>
            <Button variant="outlined"
                    color="secondary"
                    onClick={() => {
                        setDialogOpen(false);
                        resetDataUpload();
                    }}
            >
                Close
            </Button>
            {uploadDataResponse
                ? (
                    <Button onClick={resetDataUpload}
                            color="primary"
                            variant="text"
                    >
                        Create another data owner
                    </Button>
                )
                : (
                    <Fragment>
                        <Button onClick={createDataOwner}
                                color="primary"
                                variant="contained"
                                disabled={pending}
                        >
                            Create data owner
                        </Button>
                        {pending && <CircularProgress size={20} color="primary"/>}
                    </Fragment>
                )
            }
        </DialogActions>
    </Dialog>
);

const mapMobxToProps = (state: IAppState): CreateDataOwnersDialogMobxProps => ({
    createDataOwner: state.createDataOwner.createNewDataOwner,
    dialogOpen: state.createDataOwner.dialogOpen,
    setDialogOpen: state.createDataOwner.setDialogOpen,
    pending: state.createDataOwner.pending,
    uploadDataResponse: state.dataUpload.response,
    resetDataUpload: state.dataUpload.reset
});

export const CreateDataOwnerDialog = withMobileDialog()(inject(mapMobxToProps)(observer(_CreateDataOwnerDialog) as FunctionComponent));
