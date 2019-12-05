import * as React from "react";
import {inject, observer} from "mobx-react";
import {CircularProgress, IconButton, Tooltip} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {withSnackbar, WithSnackbarProps} from "notistack";
import {ApiError} from "../../api";
import {IAppState} from "../../store";

interface CreateDataOwnerButtonMobxProps {
    showSnackbar: boolean,
    setShowSnackbar: (showSnackbar: boolean) => void,
    createDataOwner: () => void,
    error?: ApiError,
    pending: boolean
}

type CreateDataOwnerButtonInjectedProps = WithSnackbarProps;

type CreateDataOwnerButtonProps = CreateDataOwnerButtonMobxProps & CreateDataOwnerButtonInjectedProps;

const _CreateDataOwnerButton: React.FC<CreateDataOwnerButtonProps> = ({
    showSnackbar,
    error,
    pending,
    setShowSnackbar,
    enqueueSnackbar,
    createDataOwner
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
        <React.Fragment>
            {pending && <CircularProgress size={15} color="primary"/>}
            <Tooltip title="Create data owner">
                <IconButton onClick={event => {
                    event.stopPropagation();
                    createDataOwner();
                }}
                            disabled={pending}
                >
                    <AddIcon/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
};

const mapMobxToProps = (state: IAppState): CreateDataOwnerButtonMobxProps => ({
    setShowSnackbar: state.createDataOwner.setShowSnackbar,
    showSnackbar: state.createDataOwner.showSnackbar,
    pending: state.createDataOwner.pending,
    error: state.createDataOwner.error,
    createDataOwner: state.createDataOwner.createNewDataOwner
});

export const CreateDataOwnerButton = withSnackbar(
    inject(mapMobxToProps)(observer(_CreateDataOwnerButton)) as React.FC<any>
);
