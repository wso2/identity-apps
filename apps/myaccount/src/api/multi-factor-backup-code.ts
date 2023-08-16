/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpInstance, HttpRequestConfig } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { MultiFactorAuthenticationConstants } from "../constants/mfa-constants";
import { BackupCodeInterface, BackupCodesCountInterface } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Generate backup codes the authenticated user.
 */
export const generateBackupCodes = (): Promise<BackupCodeInterface> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.backupCode
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data as BackupCodeInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                MultiFactorAuthenticationConstants.MFA_BACKUP_CODE_INIT_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * This API is used to delete backup codes of the authenticated user.
 */
export const deleteBackupCode = (): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.backupCode
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                MultiFactorAuthenticationConstants.MFA_BACKUP_CODE_DELETE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * This API is used to retrieve backup codes of the authenticated user.
 */
export const getRemainingBackupCodesCount = (): Promise<BackupCodesCountInterface> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.backupCode
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data as BackupCodesCountInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                MultiFactorAuthenticationConstants.MFA_BACKUP_CODE_RETRIEVE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
