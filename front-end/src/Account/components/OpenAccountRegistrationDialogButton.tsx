import React, {FunctionComponent} from "react";
import {inject, observer} from "mobx-react";
import {Button} from "@material-ui/core";
import {IAppState} from "../../store";

interface OpenAccountRegistrationDialogButtonMobxProps {
    setRegistrationDialogOpen: (registrationDialogOpen: boolean) => void
}

const _OpenAccountRegistrationDialogMobxProps: FunctionComponent<OpenAccountRegistrationDialogButtonMobxProps> = ({
    setRegistrationDialogOpen
}) => (
    <Button variant="text"
            color="primary"
            onClick={() => setRegistrationDialogOpen(true)}
    >
        Register new wallet
    </Button>
);

const mapMobxToProps = (state: IAppState): OpenAccountRegistrationDialogButtonMobxProps => ({setRegistrationDialogOpen: state.registration.setRegistrationDialogOpen});

export const OpenAccountRegistrationDialogButton = inject(mapMobxToProps)(observer(_OpenAccountRegistrationDialogMobxProps as FunctionComponent));
