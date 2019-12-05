import * as React from "react";
import {DataUploadPage, DataValidatorRegistrationPage, HomePage, NotFoundPage} from "../pages";

const Route = require("mobx-router").Route;

export const Routes = {
    home: new Route({
        path: '/',
        component: <HomePage/>
    }),
    notFound: new Route({
        path: '/404',
        component: <NotFoundPage/>
    }),
    dataUpload: new Route({
        path: '//data-upload',
        component: <DataUploadPage/>
    }),
    registration: new Route({
        path: '/registration',
        component: <DataValidatorRegistrationPage/>
    })
};
