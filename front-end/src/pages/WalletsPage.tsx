import React, {FunctionComponent} from "react";
import {Grid, Hidden} from "@material-ui/core";
import {AppBar} from "../AppBar";
import {Layout} from "../Layout";
import {Footer} from "../Footer";
import {NavigationMenu} from "../Navigation";
import {
    AccountsTable,
    OpenAccountRegistrationDialogButton,
    RegisterAccountDialog,
    SelectedDataValidatorBalance
} from "../Account";
import {TransactionsHistoryContainer} from "../Transaction/components";

export const WalletsPage: FunctionComponent = () => (
    <Grid container>
        <Grid item xs={12}>
            <AppBar sideBarItem={<SelectedDataValidatorBalance/>}/>
        </Grid>
        <Hidden mdDown>
            <Grid item lg={2}>
                <NavigationMenu/>
            </Grid>
        </Hidden>
        <Grid item xs={12} lg={10}>
            <Layout>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <OpenAccountRegistrationDialogButton/>
                    </Grid>
                    <Grid item xs={12}>
                        <AccountsTable/>
                    </Grid>
                    <Grid item xs={12}>
                        <TransactionsHistoryContainer hideAccountSelect/>
                    </Grid>
                </Grid>
                <RegisterAccountDialog/>
            </Layout>
        </Grid>
        <Grid item xs={12}>
            <Footer/>
        </Grid>
    </Grid>
);
