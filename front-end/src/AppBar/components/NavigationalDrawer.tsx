import * as React from "react";
import {inject, observer} from "mobx-react";
import {SwipeableDrawer} from "@material-ui/core";
import {NavigationMenu} from "../../Navigation";
import {IAppState} from "../../store";

interface NavigationalDrawerProps {
    drawerOpen: boolean,
    setDrawerOpen: (open: boolean) => void
}

const _NavigationalDrawer: React.FC<NavigationalDrawerProps> = ({
    drawerOpen,
    setDrawerOpen
}) => (
    <SwipeableDrawer onClose={() => setDrawerOpen(false)}
                     onOpen={() => setDrawerOpen(true)}
                     open={drawerOpen}
    >
        <NavigationMenu onItemClick={() => setDrawerOpen(false)}/>
    </SwipeableDrawer>
);

const mapMobxToProps = (state: IAppState): NavigationalDrawerProps => ({
    setDrawerOpen: state.drawer.setOpen,
    drawerOpen: state.drawer.open
});

export const NavigationalDrawer = inject(mapMobxToProps)(observer(_NavigationalDrawer)) as React.FC<any>;
