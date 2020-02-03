import React, {Fragment} from "react";
import {inject, observer} from "mobx-react";
import {Button} from "@material-ui/core";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {ApiError} from "../../api";
import {IAppState} from "../../store";
import {CreateDataOwnerDialog} from "./CreateDataOwnerDialog";

interface CreateDataOwnerButtonMobxProps {
    showSnackbar: boolean,
    setShowSnackbar: (showSnackbar: boolean) => void,
    setDialogOpen: (dialogOpen: boolean) => void,
    error?: ApiError,
}

type CreateDataOwnerButtonInjectedProps = WithSnackbarProps;

type CreateDataOwnerButtonProps = CreateDataOwnerButtonMobxProps & CreateDataOwnerButtonInjectedProps;

const _CreateDataOwnerButton: React.FC<CreateDataOwnerButtonProps> = ({
    showSnackbar,
    error,
    setShowSnackbar,
    enqueueSnackbar,
    setDialogOpen
}) => {
    if (showSnackbar) {
        if (error) {
            enqueueSnackbar("Error occurred while creating account", {
                variant: "error"
            })
        } else {
            enqueueSnackbar("Data owner has been created");
        }

        setShowSnackbar(false);
    }

    return (
        <Fragment>
            <Button variant="text"
                    color="primary"
                    onClick={() => setDialogOpen(true)}
            >
                Create new data owner
            </Button>
            <CreateDataOwnerDialog/>
        </Fragment>
    )
};

const mapMobxToProps = (state: IAppState): CreateDataOwnerButtonMobxProps => ({
    setShowSnackbar: state.createDataOwner.setShowSnackbar,
    showSnackbar: state.createDataOwner.showSnackbar,
    error: state.createDataOwner.error,
    setDialogOpen: state.createDataOwner.setDialogOpen
});

export const CreateDataOwnerButton = withSnackbar(
    inject(mapMobxToProps)(observer(_CreateDataOwnerButton)) as React.FC<any>
);
