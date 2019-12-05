import * as React from "react";
import {Typography, createStyles, makeStyles} from "@material-ui/core";
const {version} = require("../../../package.json");

const useStyles = makeStyles(() => createStyles({
    footer: {
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100%',
        textAlign: 'center'
    }
}));

export const Footer: React.FC<{}> = () => {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <Typography variant="body1"
                        color="primary"
            >
                Data validator client v. {version}
            </Typography>
        </div>
    );
};
