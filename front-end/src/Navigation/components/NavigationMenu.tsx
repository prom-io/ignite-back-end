import React, { FunctionComponent } from "react";
import { inject } from "mobx-react";
import {
  createStyles,
  List,
  ListItemText,
  makeStyles,
  MenuItem,
} from "@material-ui/core";
import { Routes } from "../../router";
import { IAppState } from "../../store";

const { Link } = require("mobx-router");

interface NavigationMenuMobxProps {
  store?: any;
}

interface NavigationMenuOwnProps {
  onItemClick?: () => void;
}

type NavigationMenuProps = NavigationMenuMobxProps & NavigationMenuOwnProps;

const useStyles = makeStyles(() =>
  createStyles({
    undecoratedLink: {
      textDecoration: "none",
      color: "inherit",
    },
  })
);

const _NavigationMenu: FunctionComponent<NavigationMenuProps> = ({
  store,
  onItemClick,
}) => {
  const classes = useStyles();
  const style = `
.menu_link:hover .icon{
    stroke: #fb6c1c;
}
.menu_link:hover{
    border-right: 4px solid #fb6c1c;
    background-color: #E9E9E9 !important;
}
.menu_link .icon{
    fill: none;
    stroke: #7A7A81;
}
.menu_link_active .icon{
    fill: none;
    stroke: #fb6c1c;
}
.menu_link {
    color: #131315 !important;
}
.menu_link_active {
    background-color: #E9E9E9 !important;
  border-right: 4px solid #fb6c1c;
}

`;
  return (
    <List>
      <style>{style}</style>
      <Link
        store={store}
        view={Routes.home}
        className={classes.undecoratedLink}
      >
        <MenuItem
          onClick={() => onItemClick && onItemClick()}
          style={{
            height: 60,
            minHeight: 60,
            padding: "0 40px 0 30px",
          }}
          className={
            store.router.currentView.path === Routes.home.path
              ? "menu_link_active"
              : "menu_link"
          }
        >
          <div style={{ marginRight: 15 }}>
            {/* <MonetizationIcon /> */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2.9 7.2C2.9 6.6251 2.9007 6.24805 2.92426 5.95969C2.94696 5.68185 2.98632 5.5665 3.01989 5.50061C3.12535 5.29363 3.29363 5.12535 3.50061 5.01989C3.5665 4.98632 3.68185 4.94696 3.95969 4.92426C4.24805 4.9007 4.6251 4.9 5.2 4.9H8.28741C8.96959 4.9 9.12317 4.90917 9.24928 4.94747C9.38765 4.98949 9.51637 5.05838 9.62809 5.1502L10.1996 4.45491L9.62809 5.1502C9.72991 5.23388 9.82272 5.35658 10.2011 5.92419L10.3012 6.07427L11.05 5.57504L10.3012 6.07427C10.3204 6.10305 10.3393 6.13156 10.3581 6.15977C10.6487 6.59657 10.8936 6.96472 11.229 7.24038C11.5235 7.48246 11.8629 7.66408 12.2277 7.77486C12.6431 7.90102 13.0853 7.90058 13.6099 7.90007C13.6438 7.90003 13.678 7.9 13.7126 7.9H18.8C19.3749 7.9 19.752 7.9007 20.0403 7.92426C20.3182 7.94696 20.4335 7.98632 20.4994 8.01989C20.7064 8.12535 20.8746 8.29363 20.9801 8.50061C21.0137 8.5665 21.053 8.68185 21.0757 8.95969C21.0993 9.24805 21.1 9.6251 21.1 10.2V16.8C21.1 17.3749 21.0993 17.752 21.0757 18.0403C21.053 18.3182 21.0137 18.4335 20.9801 18.4994L21.782 18.908L20.9801 18.4994C20.8746 18.7064 20.7064 18.8746 20.4994 18.9801C20.4335 19.0137 20.3182 19.053 20.0403 19.0757C19.752 19.0993 19.3749 19.1 18.8 19.1H5.2C4.6251 19.1 4.24805 19.0993 3.95969 19.0757C3.68185 19.053 3.5665 19.0137 3.50061 18.9801C3.29363 18.8746 3.12535 18.7064 3.01989 18.4994L2.22857 18.9026L3.01989 18.4994C2.98632 18.4335 2.94696 18.3182 2.92426 18.0403C2.9007 17.752 2.9 17.3749 2.9 16.8V7.2Z"
                stroke-width="1.8"
              />
            </svg>
          </div>
          <ListItemText>Data Owners</ListItemText>
        </MenuItem>
      </Link>
      <Link
        store={store}
        view={Routes.transactions}
        className={classes.undecoratedLink}
      >
        <MenuItem
          onClick={() => onItemClick && onItemClick()}
          style={{
            height: 60,
            minHeight: 60,
            padding: "0 40px 0 30px",
          }}
          className={
            store.router.currentView.path === Routes.transactions.path
              ? "menu_link_active"
              : "menu_link"
          }
        >
          <div style={{ marginRight: 15 }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="9" stroke-width="1.8" />
              <path
                d="M10.4585 9.94112C10.4585 9.34702 10.9155 8.97489 11.5358 8.90307V10.9988C11.4705 10.9857 11.4117 10.9661 11.353 10.9465C10.7588 10.7507 10.4585 10.4112 10.4585 9.94112ZM13.7228 14.015C13.7228 14.6548 13.2332 15.0792 12.5412 15.1379V12.8855C12.5869 12.8986 12.6326 12.9116 12.6717 12.9182C13.4029 13.1206 13.7228 13.4796 13.7228 14.015ZM12.5542 17.3772L12.5477 16.5481C14.3365 16.3783 15.4725 15.3925 15.4725 13.8387C15.4725 12.2588 14.4083 11.5929 13.0961 11.3121L12.5412 11.1946V8.91613C13.2332 9.02712 13.6184 9.54941 13.638 10.0717H15.3093C15.2832 8.71374 14.219 7.68222 12.5673 7.50595V6.65723H11.5096V7.49942C9.92971 7.64305 8.68928 8.51136 8.68928 10.0782C8.68928 11.5602 9.75997 12.3175 10.9743 12.5852L11.5358 12.7093V15.1379C10.7001 15.0269 10.2627 14.5242 10.23 13.9236H8.51953C8.53259 15.1314 9.34214 16.4045 11.5031 16.5611L11.4966 17.3772H12.5542Z"
                fill="#7A7A81"
              />
            </svg>
          </div>
          <ListItemText>Data sales</ListItemText>
        </MenuItem>
      </Link>
      <Link
        store={store}
        view={Routes.wallets}
        className={classes.undecoratedLink}
      >
        <MenuItem
          onClick={() => onItemClick && onItemClick()}
          style={{
            height: 60,
            minHeight: 60,
            padding: "0 40px 0 30px",
          }}
          className={
            store.router.currentView.path === Routes.wallets.path
              ? "menu_link_active"
              : "menu_link"
          }
        >
          <div style={{ marginRight: 15 }}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              className="icon"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0)">
                <path
                  d="M21.635 4.24984C21.5057 2.58035 20.1069 1.26123 18.4048 1.26123H3.24103C1.45392 1.26123 0 2.71515 0 4.50226V19.4978C0 21.2849 1.45392 22.7388 3.24103 22.7388H20.759C22.5461 22.7388 24 21.2849 24 19.4978V7.36956C24 5.88606 22.9977 4.63309 21.635 4.24984ZM3.24103 2.77529H18.4049C19.2288 2.77529 19.9193 3.35541 20.0907 4.12857H3.24103C2.6065 4.12857 2.01445 4.31258 1.51406 4.62902V4.50226C1.51406 3.55001 2.28878 2.77529 3.24103 2.77529ZM20.759 21.2248H3.24103C2.28878 21.2248 1.51406 20.45 1.51406 19.4978V7.36956C1.51406 6.41731 2.28878 5.64258 3.24103 5.64258H20.759C21.7113 5.64258 22.486 6.41731 22.486 7.36956V10.0115H17.6587C15.7458 10.0115 14.1895 11.5678 14.1895 13.4807C14.1895 15.3936 15.7458 16.95 17.6587 16.95H22.4859V19.4978C22.4859 20.45 21.7112 21.2248 20.759 21.2248ZM22.4859 15.4359H17.6587C16.5806 15.4359 15.7036 14.5588 15.7036 13.4807C15.7036 12.4026 16.5806 11.5256 17.6587 11.5256H22.4859V15.4359Z"
                  fill="#7A7A81"
                />
                <path
                  d="M17.9385 14.3263C18.3738 14.3263 18.7267 13.9734 18.7267 13.5382C18.7267 13.1029 18.3738 12.75 17.9385 12.75C17.5033 12.75 17.1504 13.1029 17.1504 13.5382C17.1504 13.9734 17.5033 14.3263 17.9385 14.3263Z"
                  fill="#7A7A81"
                />
              </g>
            </svg>
          </div>
          <ListItemText>Wallets</ListItemText>
        </MenuItem>
      </Link>
    </List>
  );
};

const mapMobxToProps = (state: IAppState): NavigationMenuMobxProps => ({
  store: state.store,
});

export const NavigationMenu = inject(mapMobxToProps)(
  _NavigationMenu
) as FunctionComponent<NavigationMenuOwnProps>;
