import { HttpRequestConfig } from "../../models/api";

export const API_REQUEST_START = "API_REQUEST_START";
export const apiRequestStart = (actionType) => ({
    payload: actionType,
    type: API_REQUEST_START
});

export const API_REQUEST_END = "API_REQUEST_END";
export const apiRequestEnd = (actionType) => ({
    payload: actionType,
    type: API_REQUEST_END
});

export const API_REQUEST = "API_REQUEST";
export const apiRequest = (config: HttpRequestConfig) => {
    const { auth, data, dispatcher, headers, method, onSuccess, onError, url  } = config;
    return {
        meta: {auth, dispatcher, headers, method, onSuccess, onError, url},
        payload: data,
        type: API_REQUEST
    };
};
