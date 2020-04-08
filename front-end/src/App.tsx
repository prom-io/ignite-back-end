import React, { FunctionComponent } from "react";
import { MuiThemeProvider } from "@material-ui/core";
import { SnackbarProvider } from "notistack";
import enLocale from "date-fns/locale/en-GB";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import { red } from "./themes";
import "./index.css";
const { MobxRouter } = require("mobx-router");

export const App: FunctionComponent = () => (
  <div id="app" style={{ paddingBottom: 150 }}>
    <SnackbarProvider maxSnack={3}>
      <MuiThemeProvider theme={red}>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={enLocale}>
          <MobxRouter />
        </MuiPickersUtilsProvider>
      </MuiThemeProvider>
    </SnackbarProvider>
  </div>
);
