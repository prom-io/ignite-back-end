import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {IconButton, Tooltip} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {IAppState} from "../../store";

interface OpenAddFileMetaDataDialogButtonMobxProps {
    setDialogOpen: (open: boolean) => void
}

const _OpenAddFileMetadataDialogButton: FunctionComponent<OpenAddFileMetaDataDialogButtonMobxProps> = ({
    setDialogOpen
}) => (
    <Tooltip title="Add metadata">
        <IconButton color="primary"
                    onClick={() => setDialogOpen(true)}
                    size="small"
        >
            <AddIcon/>
        </IconButton>
    </Tooltip>
);

const mapMobxToProps = (state: IAppState): OpenAddFileMetaDataDialogButtonMobxProps => ({
    setDialogOpen: state.metadataAdding.setDialogOpen
});

export const OpenAddFileMetadataDialogButton = inject(mapMobxToProps)(observer(_OpenAddFileMetadataDialogButton) as FunctionComponent);
