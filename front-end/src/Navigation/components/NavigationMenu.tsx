import React, {FunctionComponent} from "react";
import {inject} from "mobx-react";
import {createStyles, List, ListItemIcon, ListItemText, makeStyles, MenuItem} from "@material-ui/core";
import ContactMailIcon from '@material-ui/icons/ContactMail';
import AccountIcon from "@material-ui/icons/AccountCircle"
import MonetizationIcon from "@material-ui/icons/MonetizationOn";
import {Routes} from "../../router";
import {IAppState} from "../../store";

const {Link} = require("mobx-router");

interface NavigationMenuMobxProps {
    store?: any
}

interface NavigationMenuOwnProps {
    onItemClick?: () => void,
}

type NavigationMenuProps = NavigationMenuMobxProps & NavigationMenuOwnProps

const useStyles = makeStyles(() => createStyles({
    undecoratedLink: {
        textDecoration: "none",
        color: "inherit"
    }
}));

const _NavigationMenu: FunctionComponent<NavigationMenuProps> = ({store, onItemClick}) => {
    const classes = useStyles();

    return (
        <List>
            <Link store={store}
                  view={Routes.home}
                  className={classes.undecoratedLink}
            >
                <MenuItem onClick={() => onItemClick && onItemClick()}>
                    <ListItemIcon>
                        <ContactMailIcon/>
                    </ListItemIcon>
                    <ListItemText>Data Owners</ListItemText>
                </MenuItem>
            </Link>
            <Link store={store}
                  view={Routes.transactions}
                  className={classes.undecoratedLink}
            >
                <MenuItem onClick={() => onItemClick && onItemClick()}>
                    <ListItemIcon>
                        <MonetizationIcon/>
                    </ListItemIcon>
                    <ListItemText>Data sales</ListItemText>
                </MenuItem>
            </Link>
            <Link store={store}
                  view={Routes.registration}
                  className={classes.undecoratedLink}
            >
                <MenuItem onClick={() => onItemClick && onItemClick()}>
                    <ListItemIcon>
                        <AccountIcon/>
                    </ListItemIcon>
                    <ListItemText>
                        Register
                    </ListItemText>
                </MenuItem>
            </Link>
        </List>
    )
};

const mapMobxToProps = (state: IAppState): NavigationMenuMobxProps => ({
    store: state.store
});

export const NavigationMenu = inject(mapMobxToProps)(_NavigationMenu) as FunctionComponent<NavigationMenuOwnProps>;
