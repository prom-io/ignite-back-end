import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Grid, Hidden, Typography} from "@material-ui/core";
import {AppBar} from "../AppBar";
import {Layout} from "../Layout";
import {UploadDataForm} from "../DataUpload";
import {NavigationMenu} from "../Navigation";
import {Footer} from "../Footer";
import {SelectedDataValidatorBalance} from "../Account";
import {Routes} from "../router";
import {IAppState} from "../store";

const {Link} = require("mobx-router");

interface DataUploadPageMobxProps {
    selectedDataValidatorAccount: string | undefined,
    store?: any
}

const _DataUploadPage: FunctionComponent<DataUploadPageMobxProps> = ({selectedDataValidatorAccount, store}) => {
    let content: React.ReactNode;

    if (!selectedDataValidatorAccount) {
        content = (
            <Typography variant="body1">
                Looks like you haven't selected data validator account.
                You can select it at <Link view={Routes.home} store={store}>home page</Link>.
            </Typography>
        );
    } else {
        content = <UploadDataForm/>
    }

    return (
        <Grid container spacing={1}>
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
                    {content}
                </Layout>
            </Grid>
            <Grid item xs={12}>
                <Footer/>
            </Grid>
        </Grid>
    );
};

const mapMobxToProps = (state: IAppState): DataUploadPageMobxProps => ({
    store: state.store,
    selectedDataValidatorAccount: state.settings.selectedDataValidatorAccount
});

export const DataUploadPage = inject(mapMobxToProps)(observer(_DataUploadPage) as FunctionComponent);
