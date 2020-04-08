import React, { FunctionComponent } from "react";
import { Typography, createStyles, makeStyles } from "@material-ui/core";
const { version } = require("../../../package.json");

const useStyles = makeStyles(() =>
  createStyles({
    footer: {
      position: "fixed",
      minHeight: 56,
      backgroundColor: "#2B2B2B",
      left: 0,
      bottom: 0,
      width: "100%",
      textAlign: "center",
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "space-between",
    },
  })
);

export const Footer: FunctionComponent = () => {
  const classes = useStyles();

  return (
    <div className={classes.footer}>
      <Typography style={{ padding: "15px" }} variant="body1" color="secondary">
        Data validator client v. {version}
      </Typography>
      <Typography style={{ padding: "15px" }} variant="body1" color="secondary">
        © Copyright - Promeθeus Team 2019-2020
      </Typography>
    </div>
  );
};
