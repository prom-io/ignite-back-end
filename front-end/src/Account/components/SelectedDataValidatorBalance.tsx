import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {TypographyProps} from "@material-ui/core/Typography";
import {AccountBalance} from "./AccountBalance";
import {IAppState} from "../../store";

interface SelectedDataValidatorBalanceMobxProps {
    balance: number,
    selectedDataValidator?: string
}

type SelectedDataValidatorBalanceProps = SelectedDataValidatorBalanceMobxProps & TypographyProps;

const _SelectedDataValidatorBalance: FunctionComponent<SelectedDataValidatorBalanceProps> = ({
    balance,
    selectedDataValidator,
    ...rest
}) => {
    return selectedDataValidator
        ? <AccountBalance balance={balance} {...rest}/>
        : null;
};

const mapMobxToProps = (state: IAppState): SelectedDataValidatorBalanceMobxProps => ({
    balance: state.settings.selectedDataValidatorAccount
        ? state.balances.accountsBalances[state.settings.selectedDataValidatorAccount] || 0
        : 0,
    selectedDataValidator: state.settings.selectedDataValidatorAccount
});

export const SelectedDataValidatorBalance = inject(mapMobxToProps)(observer(_SelectedDataValidatorBalance) as FunctionComponent<TypographyProps>);
