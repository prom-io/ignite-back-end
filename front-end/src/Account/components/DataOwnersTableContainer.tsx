import React, { FunctionComponent } from "react";
import { inject, observer } from "mobx-react";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  createStyles,
  makeStyles,
} from "@material-ui/core";
import { DataValidatorAccountSelect } from "./DataValidatorAccountSelect";
import { DataOwnersTable } from "./DataOwnersTable";
import { DataOwnerResponse } from "../../models";
import { IAppState } from "../../store";
import { CreateDataOwnerButton } from "./CreateDataOwnerButton";

interface DataOwnersTableContainerMobxProps {
  selectedDataValidator?: string;
  selectDataValidator: (address: string) => void;
  dataOwners: { [dataValdiatorAccountAddress: string]: DataOwnerResponse[] };
  dataValidators: string[];
}

const useStyles = makeStyles(() =>
  createStyles({
    dataOwnersCard: {
      overflowX: "auto",
    },
  })
);

const _DataOwnersTableContainer: FunctionComponent<DataOwnersTableContainerMobxProps> = ({
  selectDataValidator,
  selectedDataValidator,
  dataOwners,
  dataValidators,
}) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12} style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <DataValidatorAccountSelect
            accounts={dataValidators}
            onSelect={selectDataValidator}
            selectedAccount={selectedDataValidator}
          />
          <div style={{ marginTop: 20 }}>
            <CreateDataOwnerButton />
          </div>
        </div>
      </Grid>
      <Grid item xs={12}>
        {selectedDataValidator && (
          <Card className={classes.dataOwnersCard}>
            <CardHeader title="Data owners" />
            <CardContent>
              <DataOwnersTable
                dataOwners={dataOwners[selectedDataValidator] || []}
              />
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );
};

const mapMobxToProps = (
  state: IAppState
): DataOwnersTableContainerMobxProps => ({
  selectedDataValidator: state.settings.selectedDataValidatorAccount,
  selectDataValidator: state.settings.selectDataValidatorAccount,
  dataOwners: state.dataOwners.dataOwners,
  dataValidators: state.accounts.accounts.map((account) => account.address),
});

export const DataOwnersTableContainer = inject(mapMobxToProps)(
  observer(_DataOwnersTableContainer as FunctionComponent<{}>)
);
