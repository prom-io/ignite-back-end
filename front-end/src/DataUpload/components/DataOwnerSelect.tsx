import * as React from "react";
import {observer, inject} from "mobx-react";
import {Select, InputLabel, MenuItem, Typography} from "@material-ui/core";
import {IAppState} from "../../store";

interface DataOwnerSelectMobxProps {
    addresses: string[],
    selectedDataOwner?: string,
    setSelectedDataOwner: (address: string) => void,
    error?: string
}

const _DataOwnerSelect: React.FC<DataOwnerSelectMobxProps> = ({
    addresses,
    selectedDataOwner,
    setSelectedDataOwner,
    error
}) => {
    let select: React.ReactNode;

    if (addresses.length === 0) {
        select = (
            <Select style={{width: '100%'}}>
                <MenuItem>
                    Looks like selected data validator does not have any data owners.
                </MenuItem>
            </Select>
        )
    } else {
        select = (
            <Select value={selectedDataOwner}
                    onChange={event => setSelectedDataOwner(event.target.value as string)}
                    style={{width: '100%'}}
            >
                {addresses.map((address, index) => (
                    <MenuItem key={index} value={address}>
                        <Typography variant="body1" noWrap>
                            {address}
                        </Typography>
                    </MenuItem>
                ))}
            </Select>
        )
    }

    return (
        <React.Fragment>
            <InputLabel>Data owner</InputLabel>
            {select}
            {error && (
                <Typography variant="body1" noWrap style={{color: 'red'}}>
                    {error}
                </Typography>
            )}
        </React.Fragment>
    )
};

const mapMobxToProps = (state: IAppState): DataOwnerSelectMobxProps => ({
    addresses: state.dataOwnerSelect.dataOwners,
    error: state.dataUpload.errors.dataOwnerAddress,
    selectedDataOwner: state.dataUpload.uploadDataForm.dataOwnerAddress,
    setSelectedDataOwner: (address: string) => state.dataUpload.setField("dataOwnerAddress", address)
});

export const DataOwnerSelect = inject(mapMobxToProps)(observer(_DataOwnerSelect)) as React.FC<any>;
