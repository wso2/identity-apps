/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useRequest, { 
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../features/core/hooks/use-request";
import { store } from "../../../../features/core/store";
import { MyAccountManagementConstants } from "../constants";
import {
    MyAccountConfigInterface,
    MyAccountDataInterface,
    MyAccountFormInterface,
    MyAccountPortalStatusInterface,
    TotpConfigInterface,
    TotpConfigPortalStatusInterface
} from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Function to add/update My Account portal status.
 *
 * @param status - My Account portal status.
 *
 * @returns Promise of response of the My Account status update request.
 * @throws IdentityAppsApiException
 */
export const updateMyAccountStatus = (status: boolean): Promise<MyAccountPortalStatusInterface> => {

    const config: MyAccountConfigInterface = {
        attributes: [
            {
                key: "enable", 
                value: status
            } 
        ],
        name: "status"
    };

    const requestConfig: AxiosRequestConfig = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.myAccountConfigMgt
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    MyAccountManagementConstants.MYACCOUNT_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as MyAccountPortalStatusInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                MyAccountManagementConstants.MYACCOUNT_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Function to add/update My Account portal MFA options.
 *
 * @param status - My Account portal MFA options.
 *
 * @returns Promise of response of the My Account MFA options update request.
 * @throws IdentityAppsApiException
 */
export const updateMyAccountMFAOptions = (options: MyAccountFormInterface): Promise<MyAccountPortalStatusInterface> => {

    const config: MyAccountConfigInterface = {
        attributes: [
            {
                key: "email_otp_enabled", 
                value: options.emailOtpEnabled
            },
            {
                key: "sms_otp_enabled", 
                value: options.smsOtpEnabled
            },
            {
                key: "totp_enabled", 
                value: options.totpEnabled
            },
            {
                key: "backup_code_enabled", 
                value: options.backupCodeEnabled
            }
        ],
        name: "myaccount-2FA-config"
    };

    const requestConfig: AxiosRequestConfig = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.myAccountConfigMgt
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    MyAccountManagementConstants.MYACCOUNT_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as MyAccountPortalStatusInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                MyAccountManagementConstants.MYACCOUNT_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Function to add/update My Account portal Totp options.
 *
 * @param options - Totp config options.
 *
 * @returns Promise of response of the My Account MFA options update request.
 * @throws IdentityAppsApiException
 */
export const updateTotpConfigOptions = (options: MyAccountFormInterface): Promise<TotpConfigPortalStatusInterface> => {

    const config: TotpConfigInterface = {
        attributes: [
            {
                key: "enrolUserInAuthenticationFlow", 
                value: options.totpEnrollmentEnabled
            }
        ],
        name: "myaccount-TOTP-config"
    };

    const requestConfig: AxiosRequestConfig = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.myAccountConfigMgt
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    MyAccountManagementConstants.MYACCOUNT_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as TotpConfigPortalStatusInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                MyAccountManagementConstants.MYACCOUNT_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Hook to get the status of the My Account Portal.
 *
 * @returns Reponse of the My Account status retrieval request.
 */
export const useMyAccountStatus = <Data = MyAccountPortalStatusInterface, Error = RequestErrorInterface>(
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {},
        url: store.getState().config.endpoints.myAccountConfigMgt + "/status/enable"
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        shouldRetryOnError: false
    });

    return {
        data,
        error: error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};

/**
 * Hook to get the data of the My Account Portal.
 *
 * @returns Reponse of the My Account data retrieval request.
 */
export const useMyAccountData = <Data = MyAccountDataInterface, Error = RequestErrorInterface>(
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {},
        url: store.getState().config.endpoints.myAccountConfigMgt + "/myaccount-2FA-config"
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        shouldRetryOnError: false
    });

    return {
        data,
        error: error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};

/**
 * Hook to get the data of the My Account Portal.
 *
 * @returns Reponse of the My Account data retrieval request.
 */
export const useTotpConfigData = <Data = MyAccountDataInterface, Error = RequestErrorInterface>(
): RequestResultInterface<Data, Error> => {
    
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {},
        url: store.getState().config.endpoints.myAccountConfigMgt + "/myaccount-TOTP-config"
    };
    
    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        shouldRetryOnError: false
    });
    
    return {
        data,
        error: error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};
