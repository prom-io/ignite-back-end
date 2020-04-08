import React, { Fragment, FunctionComponent } from "react";
import { inject, observer } from "mobx-react";
import { Grid, TextField, Typography } from "@material-ui/core";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { EditableMetadataTable } from "./EditableMetadataTable";
import { FileInput } from "./FileInput";
import { UploadedFileDescriptor } from "./UploadedFileDescriptor";
import {
  FileMetadata,
  UploadDataRequest,
  UploadDataResponse,
} from "../../models";
import { FormErrors } from "../../utils";
import { ApiError, SERVICE_NODE_API_UNREACHABLE_CODE } from "../../api";
import { IAppState } from "../../store";
import { format } from "date-fns";

interface UploadDataFormProps {
  uploadDataForm: Partial<UploadDataRequest>;
  errors: FormErrors<UploadDataRequest> & { attachedFile: string | undefined };
  pending: boolean;
  uploadData: () => void;
  reset: () => void;
  setFormValue: (
    key: keyof UploadDataRequest,
    value: string | number | FileMetadata | Date
  ) => void;
  setAdditionalMetaField: (
    fieldName: keyof FileMetadata,
    fieldValue: string | string[]
  ) => void;
  submissionError?: ApiError;
  setAttachedFileName: (fileName: string) => void;
  fileName?: string;
  response?: UploadDataResponse;
  dataValidatorAccount?: string;
  attachFile: (file: File) => void;
  file?: File;
  dataOwnerAddress?: string;
}

const getMessageFromError = (apiError: ApiError): string => {
  if (apiError.status === SERVICE_NODE_API_UNREACHABLE_CODE) {
    return "Service node API is unreachable. Please ensure that it's running.";
  }

  return "Unknown error occurred when tried to upload file";
};

const _UploadDataForm: FunctionComponent<UploadDataFormProps> = ({
  uploadDataForm,
  pending,
  errors,
  submissionError,
  response,
  file,
  dataValidatorAccount,
  uploadData,
  attachFile,
  setFormValue,
  reset,
  dataOwnerAddress,
}) => {
  const content = response ? (
    <UploadedFileDescriptor
      fileId={response.id}
      storagePrice={response.storagePrice}
      dataOwnerAddress={dataOwnerAddress!}
    />
  ) : (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1">
          Creation date {format(new Date(), "dd/MM/yyyy")}
        </Typography>
        <KeyboardDatePicker
          value={uploadDataForm.keepUntil}
          onChange={(date) => setFormValue("keepUntil", date as Date)}
          disablePast
          autoOk
          format="dd/MM/yyyy"
          label="Must be stored until"
          fullWidth
          margin="dense"
        />
        <TextField
          onChange={(event) =>
            setFormValue("price", Number(event.target.value))
          }
          label="Price"
          fullWidth
          margin="dense"
          error={Boolean(errors.price)}
          helperText={errors.price && errors.price}
          defaultValue="1"
        />
      </Grid>
      <Grid item xs={12}>
        <EditableMetadataTable />
      </Grid>
      <Grid item xs={12}>
        <FileInput onFileAttached={(file) => attachFile(file)} file={file} />
        {errors.attachedFile && (
          <Typography variant="body1" style={{ color: "red" }}>
            {errors.attachedFile}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        {submissionError && (
          <Typography style={{ color: "red" }} variant="body1">
            {getMessageFromError(submissionError)}
          </Typography>
        )}
      </Grid>
    </Grid>
  );

  return <Fragment>{content}</Fragment>;
};

const mapMobxToProps = (store: IAppState): UploadDataFormProps => {
  const dataUpload = store.dataUpload;

  return {
    errors: dataUpload.errors,
    pending: dataUpload.pending,
    uploadData: dataUpload.uploadData,
    setFormValue: dataUpload.setField,
    setAdditionalMetaField: dataUpload.setAdditionalField,
    submissionError: dataUpload.submissionError,
    uploadDataForm: dataUpload.uploadDataForm,
    setAttachedFileName: dataUpload.setAttachedFileName,
    fileName: dataUpload.attachedFileName,
    response: dataUpload.response,
    reset: dataUpload.reset,
    dataValidatorAccount: dataUpload.dataValidatorAccount,
    attachFile: dataUpload.setAttachedFile,
    file: dataUpload.attachedFile,
    dataOwnerAddress: store.dataUpload.response?.dataOwner,
  };
};

export const UploadDataForm = inject(mapMobxToProps)(
  observer(_UploadDataForm) as FunctionComponent
);
