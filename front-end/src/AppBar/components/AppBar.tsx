import React, {Fragment, FunctionComponent, ReactElement} from "react";
import Headroom from "react-headroom";
import {inject} from "mobx-react";
import {
    AppBar as MaterialUiAppBar,
    createStyles,
    Hidden,
    ListItemIcon,
    ListItemText,
    makeStyles,
    MenuItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import {NavigationalDrawer} from "./NavigationalDrawer";
import {OpenDrawerButton} from "./OpenDrawerButton";
import {Routes} from "../../router";
import {IAppState} from "../../store";
import {PrometeusLogoIcon} from "../../icons";

const {Link} = require('mobx-router');

interface AppBarProps {
    title?: string,
    sideBarItem?: ReactElement
}

interface AppBarMobxProps {
    store: any
}

const useStyles = makeStyles(() => createStyles({
    root: {
        flexGrow: 1
    },
    grow: {
        flexGrow: 1
    },
    undecoratedLink: {
        textDecoration: "none",
        color: "inherit"
    }
}));

const _AppBar: FunctionComponent<AppBarProps & AppBarMobxProps> = ({title, store, sideBarItem}) => {
    const classes = useStyles();

    const linkToHome = (
        <Link store={store}
              view={Routes.home}
              className={classes.undecoratedLink}
        >
            <MenuItem>
                <ListItemIcon>
                    <PrometeusLogoIcon/>
                </ListItemIcon>
                <ListItemText>
                    <Hidden xsDown>
                        Data validator client
                    </Hidden>
                </ListItemText>
            </MenuItem>
        </Link>
    );

    return (
        <Fragment>
            <Headroom style={{
                position: 'fixed',
                zIndex: 1300
            }}>
                <MaterialUiAppBar position="static"
                                  classes={classes}
                >
                    <Toolbar>
                        <Hidden lgUp>
                            <OpenDrawerButton/>
                        </Hidden>
                        <div className={classes.grow}
                             style={{display: 'flex'}}
                        >
                            <Typography variant="h6">
                                {title
                                    ?
                                    <span>{linkToHome} <Hidden smDown> | {title}</Hidden></span>
                                    : linkToHome
                                }
                            </Typography>
                        </div>
                        {sideBarItem && sideBarItem}
                    </Toolbar>
                </MaterialUiAppBar>
            </Headroom>
            <NavigationalDrawer/>
        </Fragment>
    );
};

const mapMobxToProps = (appState: IAppState): AppBarMobxProps => ({
    store: appState.store
});

export const AppBar = inject(mapMobxToProps)(_AppBar as FunctionComponent<AppBarProps>);
