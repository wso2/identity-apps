import { HttpRequestConfig } from "../../models/api";
import { API, API_REQUEST_END, API_REQUEST_START } from "./types";

export const apiRequestStart = (actionType) => ({
    payload: actionType,
    type: API_REQUEST_START
});

export const apiRequestEnd = (actionType) => ({
    payload: actionType,
    type: API_REQUEST_END
});

export const apiRequestAction = (config: HttpRequestConfig, meta: object) => ({
    meta,
    payload: config,
    type: API
});
