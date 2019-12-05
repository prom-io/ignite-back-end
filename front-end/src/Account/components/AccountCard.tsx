import * as React from "react";
import {Card, CardContent, CardHeader, Typography, Hidden} from "@material-ui/core";
import {getBalanceLabel} from "../utils";
import {AccountType} from "../../models";

interface AccountCardProps {
    selectedAsDefault: boolean,
    onSelect: (address: string) => void,
    address: string,
    balance: number,
    type: AccountType
}

export const AccountCard: React.FC<AccountCardProps> = ({
    balance,
    address,
    selectedAsDefault,
    onSelect,
    type
}) => {
    return (
        <Card elevation={selectedAsDefault ? 3 : 1}
              onClick={() => !selectedAsDefault && onSelect(address)}
              style={{cursor: 'pointer'}}
        >
            <CardHeader title={(
                <React.Fragment>
                    <Hidden lgUp>
                        <Typography variant="caption">
                            {address}
                        </Typography>
                    </Hidden>
                    <Hidden mdDown>
                        {address}
                    </Hidden>
                </React.Fragment>
            )}
                        subheader={getBalanceLabel(balance)}
            />
            {selectedAsDefault && (
                <CardContent>
                    <Typography variant="h6" color="textSecondary">
                        Selected as default
                    </Typography>
                </CardContent>
            )}
        </Card>
    )
};
