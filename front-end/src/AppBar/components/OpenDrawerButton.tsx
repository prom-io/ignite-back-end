import * as React from "react";
import {inject, observer} from "mobx-react";
import {IconButton} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import {IAppState} from "../../store";

interface OpenDrawerButtonMobxProps {
    setDrawerOpen: (open: boolean) => void,
}

const _OpenDrawerButton: React.FC<OpenDrawerButtonMobxProps> = ({
    setDrawerOpen
}) => (
    <IconButton style={{
        marginLeft: -12,
        marginRight: 20,
        color: 'inherit'
    }}
                onClick={() => setDrawerOpen(true)}
    >
        <MenuIcon/>
    </IconButton>
);

const mapMobxToProps = (state: IAppState): OpenDrawerButtonMobxProps => ({
    setDrawerOpen: state.drawer.setOpen
});

export const OpenDrawerButton = inject(mapMobxToProps)(observer(_OpenDrawerButton)) as React.FC<any>;
