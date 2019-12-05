import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from "mobx-react"
import {App} from './App';
import {store} from "./store";
import {Routes} from "./router";
import * as serviceWorker from './serviceWorker';

const {RouterStore, startRouter} = require("mobx-router");

const routerStore = {
    router: new RouterStore()
};

startRouter(Routes, routerStore, {
    notfound: () => {
        routerStore.router.goTo(Routes.notFound);
    }
});

store.accounts.fetchAccounts();

ReactDOM.render(<Provider store={routerStore} {...store}>
    <App/>
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
