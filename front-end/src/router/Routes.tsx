import * as React from "react";
import {DataSalesPage, DataUploadPage, HomePage, NotFoundPage, WalletsPage} from "../pages";
import {store} from "../store";
import {TransactionType} from "../models";

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
        component: <WalletsPage/>,
        beforeEnter: () => {
            store.transactions.setTransactionType(undefined);
            store.transactions.fetchTransactions();
            store.transactions.setRefreshOnAccountChange(true);
        },
        onExit: () => {
            store.transactions.reset();
            store.transactions.setRefreshOnAccountChange(false);
        }
    }),
    transactions: new Route({
        path: '/data-sales',
        component: <DataSalesPage/>,
        beforeEnter: () => {
            store.transactions.setTransactionType(TransactionType.DATA_PURCHASE);
            store.transactions.fetchTransactions();
            store.transactions.setRefreshOnAccountChange(true);
        },
        onExit: () => {
            store.transactions.reset();
            store.transactions.setRefreshOnAccountChange(false);
        }
    })
};
