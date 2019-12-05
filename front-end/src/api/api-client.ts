import Axios from "axios";

const _axiosInstance = Axios.create({
    baseURL: process.env.REACT_APP_DATA_MART_NODE_API_BASE_URL as string || "http://localhost:3004"
});

export const axiosInstance = _axiosInstance;
