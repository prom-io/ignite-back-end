import * as React from "react";
import {DataUploadPage, WalletsPage, HomePage, NotFoundPage, DataSalesPage} from "../pages";
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
    wallets: new Route({
        path: '/wallets',
        component: <WalletsPage/>
    }),
    transactions: new Route({
        path: '/data-sales',
        component: <DataSalesPage/>,
        beforeEnter: () => {
            store.transactions.fetchTransactions();
            store.transactions.setRefreshOnAccountChange(true);
        },
        onExit: () => {
            store.transactions.reset();
            store.transactions.setRefreshOnAccountChange(false);
        }
    })
};
