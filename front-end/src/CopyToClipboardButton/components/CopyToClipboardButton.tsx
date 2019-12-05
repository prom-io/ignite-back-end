import * as React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import IconButton from "@material-ui/core/IconButton";
import {CopyToClipboardIcon} from "../../icons"

interface CopyToClipboardButtonProps {
    textToCopy: string
}

export const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({textToCopy}) => (
    <CopyToClipboard text={textToCopy}>
        <IconButton>
            <CopyToClipboardIcon fontSize="small"/>
        </IconButton>
    </CopyToClipboard>
);
