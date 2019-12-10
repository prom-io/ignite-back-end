import * as React from "react";
import {DataUploadPage, DataValidatorRegistrationPage, HomePage, NotFoundPage, TransactionsPage} from "../pages";
import {store} from "../store";

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
        path: '/data-upload',
        component: <DataUploadPage/>
    }),
    registration: new Route({
        path: '/registration',
        component: <DataValidatorRegistrationPage/>
    }),
    transactions: new Route({
        path: '/transactions',
        component: <TransactionsPage/>,
        beforeEnter: () => store.transactions.fetchTransactions(),
        onExit: () => store.transactions.reset()
    })
};
