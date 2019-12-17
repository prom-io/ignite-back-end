import React, {Fragment, FunctionComponent, ReactElement, ReactNode, useState} from "react";
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
    balance: number,
    selectedAsDefault: boolean,
    onSelect: (address: string) => void,
    children: ReactElement,
    numberOfDataOwners: number,
    onExpand?: () => void,
    hideDataOwnerCreationButton?: boolean
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
    balance,
    selectedAsDefault,
    onSelect,
    children,
    numberOfDataOwners,
    onExpand,
    hideDataOwnerCreationButton = false
}) => {
    const [expanded, setExpanded] = useState(selectedAsDefault);
    const classes = useStyles();

    const handleExpandClick = (): void => {
        if (onExpand) {
            onExpand();
        }

        setExpanded(!expanded);
    };

    const cursor = selectedAsDefault ? 'default' : 'pointer';

    const actions: ReactNode = (
        <Fragment>
            {selectedAsDefault && !hideDataOwnerCreationButton && <CreateDataOwnerButton/>}
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
              style={{
                  cursor,
                  overflowX: 'auto'
              }}
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
                                <div>Number of data owners: {numberOfDataOwners}</div>
                            </Fragment>
                        )}
                        action={(
                            <Hidden smDown>
                                {actions}
                            </Hidden>
                        )}
            />
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
                    {children}
                </CardContent>
            </Collapse>
        </Card>
    )
};
