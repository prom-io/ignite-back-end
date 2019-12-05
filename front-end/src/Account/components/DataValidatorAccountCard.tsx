import * as React from "react";
import {Fragment, FunctionComponent, ReactNode, useState} from "react";
import getClassName from "clsx";
import {
    Card,
    CardActions,
    CardContent,
    CardHeader,
    Collapse,
    createStyles,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemText,
    makeStyles,
    Theme,
    Tooltip,
    Typography
} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {CreateDataOwnerButton} from "./CreateDataOwnerButton";
import {getBalanceLabel} from "../utils";

interface DataValidatorAccountCardProps {
    address: string,
    dataOwners: string[],
    balance: number,
    selectedAsDefault: boolean,
    onSelect: (address: string) => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    }
}));

export const DataValidatorAccountCard: FunctionComponent<DataValidatorAccountCardProps> = ({
    address,
    dataOwners,
    balance,
    selectedAsDefault,
    onSelect
}) => {
    const [expanded, setExpanded] = useState(false);
    const classes = useStyles();

    const handleExpandClick = (): void => {
        setExpanded(!expanded);
    };

    const cursor = selectedAsDefault ? 'default' : 'pointer';

    const actions: ReactNode = (
        <Fragment>
            {selectedAsDefault && <CreateDataOwnerButton/>}
            <Tooltip title={expanded
                ? "Hide data owners"
                : "Show data owners"
            }>
                <IconButton className={
                    getClassName(classes.expand, {
                            [classes.expandOpen]: expanded
                        })
                }
                            onClick={event => {
                                event.stopPropagation();
                                handleExpandClick();
                            }}
                            aria-expanded={expanded}
                >
                    <ExpandMoreIcon/>
                </IconButton>
            </Tooltip>
        </Fragment>
    );

    return (
        <Card elevation={selectedAsDefault ? 3 : 1}
              onClick={() => !selectedAsDefault && onSelect(address)}
              style={{cursor}}
        >
            <CardHeader title={(
                <Fragment>
                    <Hidden lgUp>
                        <Typography variant="caption" noWrap>
                            {address}
                        </Typography>
                    </Hidden>
                    <Hidden mdDown>
                        {address}
                    </Hidden>
                </Fragment>
            )}
                        subheader={(
                            <Fragment>
                                <div>{getBalanceLabel(balance)}</div>
                                <div>Number of data owners: {dataOwners.length}</div>
                            </Fragment>
                        )}
                        action={(
                            <Hidden smDown>
                                {actions}
                            </Hidden>
                        )}
            />
            {selectedAsDefault && (
                <CardContent>
                    <Typography variant="h6" color="textSecondary">
                        Selected as default
                    </Typography>
                </CardContent>
            )}
            <Hidden mdUp>
                <CardActions style={{float: 'right'}}>
                    {actions}
                </CardActions>
            </Hidden>
            <Collapse in={expanded}
                      timeout="auto"
                      unmountOnExit
            >
                <CardContent>
                    <Typography variant="body1">
                        Data owners:
                    </Typography>
                    <List>
                        {dataOwners.map(dataOwnerAddress => (
                            <ListItem key={dataOwnerAddress}>
                                <ListItemText disableTypography>
                                    <Typography variant="body1" noWrap>
                                        {dataOwnerAddress}
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Collapse>
        </Card>
    )
};
