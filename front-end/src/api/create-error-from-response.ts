import {AxiosError} from "axios";
import {ApiError, SERVICE_NODE_API_UNREACHABLE_CODE} from "./ApiError";

export const createErrorFromResponse = (axiosError: AxiosError): ApiError => {
    if (axiosError.response) {
        return {
            status: axiosError.response.status
        }
    } else {
        return {
            status: SERVICE_NODE_API_UNREACHABLE_CODE
        }
    }
};
