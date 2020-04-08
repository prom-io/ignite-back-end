import React, { Fragment, FunctionComponent, ReactElement } from "react";
import Headroom from "react-headroom";
import { inject } from "mobx-react";
import {
  AppBar as MaterialUiAppBar,
  createStyles,
  Hidden,
  ListItemText,
  makeStyles,
  MenuItem,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { NavigationalDrawer } from "./NavigationalDrawer";
import { OpenDrawerButton } from "./OpenDrawerButton";
import { Routes } from "../../router";
import { IAppState } from "../../store";
import { PrometeusLogoIcon } from "../../icons";

const { Link } = require("mobx-router");

interface AppBarProps {
  title?: string;
  sideBarItem?: ReactElement;
}

interface AppBarMobxProps {
  store: any;
}

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    header: {
      backgroundColor: "#F8F8F8",
    },
    undecoratedLink: {
      textDecoration: "none",
      color: "inherit",
    },
  })
);

const _AppBar: FunctionComponent<AppBarProps & AppBarMobxProps> = ({
  title,
  store,
  sideBarItem,
}) => {
  const classes = useStyles();

  const linkToHome = (
    <Link store={store} view={Routes.home} className={classes.undecoratedLink}>
      <MenuItem style={{ padding: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <PrometeusLogoIcon />
        </div>
        <ListItemText>
          <Hidden xsDown>
            <span style={{ fontSize: 30, color: "#131315" }}>Promeθeus</span>
          </Hidden>
        </ListItemText>
      </MenuItem>
    </Link>
  );

  return (
    <Fragment>
      <Headroom
        style={{
          position: "fixed",
          zIndex: 1300,
        }}
      >
        <MaterialUiAppBar
          position="static"
          classes={classes}
          style={{
            boxShadow:
              "0px 0px 0px 0px rgba(0,0,0,0.0), 0px 0px 0px 0px rgba(0,0,0,0.0), 0px 0px 0px 0px rgba(0,0,0,0.0)",
          }}
        >
          <Toolbar className={classes.header}>
            <Hidden lgUp>
              <OpenDrawerButton />
            </Hidden>
            <div className={classes.grow} style={{ display: "flex" }}>
              {title ? (
                <Typography>
                  {linkToHome} <Hidden smDown> | {title}</Hidden>
                </Typography>
              ) : (
                linkToHome
              )}
            </div>
            {sideBarItem && sideBarItem}
          </Toolbar>
        </MaterialUiAppBar>
      </Headroom>
      <NavigationalDrawer />
    </Fragment>
  );
};

const mapMobxToProps = (appState: IAppState): AppBarMobxProps => ({
  store: appState.store,
});

export const AppBar = inject(mapMobxToProps)(
  _AppBar as FunctionComponent<AppBarProps>
);
