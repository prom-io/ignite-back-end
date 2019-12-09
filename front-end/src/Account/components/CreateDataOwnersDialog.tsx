import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Button, Dialog, DialogContent, DialogTitle} from "@material-ui/core";
import withMobileDialog, {WithMobileDialog} from "@material-ui/core/withMobileDialog";
import {UploadDataForm} from "../../DataUpload";
import {IAppState} from "../../store";

interface CreateDataOwnersDialogMobxProps {
    dialogOpen: boolean,
    setDialogOpen: (dialogOpen: boolean) => void,
    createDataOwner: () => Promise<void>
}

type CreateDataOwnersDialogProps = CreateDataOwnersDialogMobxProps & WithMobileDialog;

const _CreateDataOwnerDialog: FunctionComponent<CreateDataOwnersDialogProps> = ({
    dialogOpen,
    setDialogOpen,
    createDataOwner,
    fullScreen
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
            <Button color="primary"
                    onClick={createDataOwner}
            >
                Create data owner
            </Button>
        </DialogContent>
    </Dialog>
);

const mapMobxToProps = (state: IAppState): CreateDataOwnersDialogMobxProps => ({
    createDataOwner: state.createDataOwner.createNewDataOwner,
    dialogOpen: state.createDataOwner.dialogOpen,
    setDialogOpen: state.createDataOwner.setDialogOpen
});

export const CreateDataOwnerDialog = withMobileDialog()(inject(mapMobxToProps)(observer(_CreateDataOwnerDialog) as FunctionComponent));
