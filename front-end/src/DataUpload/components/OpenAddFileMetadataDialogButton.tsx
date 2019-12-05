import * as React from "react";
import {inject, observer} from "mobx-react";
import {IconButton, Tooltip} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {IAppState} from "../../store";

interface OpenAddFileMetaDataDialogButtonProps {
    setDialogOpen: (open: boolean) => void
}

export const OpenAddFileMetadataDialogButton: React.FC<any>
    = inject((state: IAppState): OpenAddFileMetaDataDialogButtonProps => ({setDialogOpen: state.metadataAdding.setDialogOpen}))
(observer((props: OpenAddFileMetaDataDialogButtonProps) => (
    <Tooltip title="Add metadata">
        <IconButton color="primary"
                    onClick={() => props.setDialogOpen(true)}
                    size="small"
        >
            <AddIcon/>
        </IconButton>
    </Tooltip>
)));
