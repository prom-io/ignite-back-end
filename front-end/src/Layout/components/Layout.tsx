import * as React from "react";
import {
    Grid,
    createStyles,
    withStyles
} from "@material-ui/core";

const styles = createStyles({
    standardLayout: {
        paddingLeft: '2.08333333334%',
        paddingRight: '2.08333333334%',
        marginTop: 16
    }
});

interface LayoutProps {
    classes: any
}

const _Layout: React.FC<LayoutProps> = ({classes, children}) => (
    <Grid container className={classes.standardLayout}>
        <Grid item xs={12}>
            {children}
        </Grid>
    </Grid>
);

export const Layout = withStyles(styles)(_Layout);
