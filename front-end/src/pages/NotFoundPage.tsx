import React, {FunctionComponent} from "react";
import {Grid, Hidden, Typography} from "@material-ui/core";
import {AppBar} from "../AppBar";
import {Footer} from "../Footer";
import {Layout} from "../Layout";
import {NavigationMenu} from "../Navigation";

export const NotFoundPage: FunctionComponent = () => (
    <Grid container spacing={1}>
        <Grid item xs={12}>
            <AppBar/>
        </Grid>
        <Hidden mdDown>
            <Grid item lg={2}>
                <NavigationMenu/>
            </Grid>
        </Hidden>
        <Grid item xs={12} lg={10}>
            <Layout>
                <Typography variant="h4">
                    The page you requested was not found :(
                </Typography>
            </Layout>
        </Grid>
        <Grid item xs={12}>
            <Footer/>
        </Grid>
    </Grid>
);
