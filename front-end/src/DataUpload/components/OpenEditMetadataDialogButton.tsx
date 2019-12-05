import * as React from "react";
import {observer, inject} from "mobx-react";
import {IconButton, Tooltip} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import {IAppState} from "../../store";

interface OpenEditMetadataDialogButtonOwnProps {
    metadataKey: string
}

interface OpenEditMetadataDialogButtonMobxProps {
    setMetadataKey: (key?: string) => void
}

type OpenEditMetadataDialogButtonProps = OpenEditMetadataDialogButtonOwnProps & OpenEditMetadataDialogButtonMobxProps;

const _OpenEditMetadataDialogButton: React.FC<OpenEditMetadataDialogButtonProps> = ({
    metadataKey,
    setMetadataKey
}) => (
    <Tooltip title="Edit">
        <IconButton onClick={() => setMetadataKey(metadataKey)}
                    size="small"
        >
            <EditIcon/>
        </IconButton>
    </Tooltip>
);

const mapMobxToProps = (state: IAppState): OpenEditMetadataDialogButtonMobxProps => ({
    setMetadataKey: state.metadataEdit.setEditedMetadataKey,
});

export const OpenEditMetadataDialogButton = inject(mapMobxToProps)(observer(_OpenEditMetadataDialogButton));
