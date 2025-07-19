/**
 * Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { ValidationManagementConstants } from "../constants/validation-config-constants";
import {
    RevertValidationConfigInterface,
    ValidationConfInterface,
    ValidationDataInterface,
    ValidationFormInterface
} from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Function to update the validation configurations.
 *
 * @param data - password validation configuration.
 *
 * @returns response - updated validation configurations.
 */
export const updateValidationConfigData = (
    formData: ValidationFormInterface,
    passwordData: ValidationDataInterface,
    usernameData: ValidationDataInterface
): Promise<ValidationDataInterface[]> => {
    const configArray: ValidationDataInterface[] = [
        passwordData,
        usernameData,
        preparePasswordValidationConfigData(formData),
        prepareUsernameValidationConfigData(formData)
    ];

    const config: ValidationDataInterface[] = configArray.filter(
        (item: ValidationDataInterface) => item != null);

    const requestConfig: AxiosRequestConfig = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.validationServiceMgt
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ValidationManagementConstants.CONFIGURATION_UPDATE_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as ValidationDataInterface[]);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ValidationManagementConstants.CONFIGURATION_STATUS_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

export const revertValidationConfigData = (
    fields: string[]
): Promise<any> => {
    const config: RevertValidationConfigInterface = {
        fields: fields
    };

    const requestConfig: AxiosRequestConfig = {
        data: config,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.validationServiceMgt + "/revert"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ValidationManagementConstants.CONFIGURATION_REVERT_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ValidationManagementConstants.CONFIGURATION_REVERT_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Hook to get the validation configurations.
 *
 * @returns The response of the validation configurations.
 */
export const useValidationConfigData = <Data = ValidationDataInterface[], Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { organizationType } = useGetCurrentOrganizationType();

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {},
        url: organizationType === OrganizationType.SUBORGANIZATION
            ? store.getState().config.endpoints.validationServiceMgtSubOrg
            : store.getState().config.endpoints.validationServiceMgt
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null, {
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

const preparePasswordValidationConfigData = (values: ValidationFormInterface): ValidationDataInterface => {

    if(values.field==="username"){
        return;
    }

    let rules: ValidationConfInterface[] = [
        {
            properties: [
                {
                    key: "min.length",
                    value: values.minLength ? values.minLength : "8"
                },
                {
                    key: "max.length",
                    value: values.maxLength ? values.maxLength : "30"
                }
            ],
            validator: "LengthValidator"
        },
        {
            properties: [
                {
                    key: "min.length",
                    value: values.minNumbers ? values.minNumbers : "1"
                }
            ],
            validator: "NumeralValidator"
        },
        {
            properties: [
                {
                    key: "min.length",
                    value: values.minUpperCaseCharacters ? values.minUpperCaseCharacters : "1"
                }
            ],
            validator: "UpperCaseValidator"
        },
        {
            properties: [
                {
                    key: "min.length",
                    value: values.minLowerCaseCharacters ? values.minLowerCaseCharacters : "8"
                }
            ],
            validator: "LowerCaseValidator"
        },
        {
            properties: [
                {
                    key: "min.length",
                    value: values.minSpecialCharacters ? values.minSpecialCharacters : "8"
                }
            ],
            validator: "SpecialCharacterValidator"
        }
    ];

    if (values.uniqueCharacterValidatorEnabled && Number(values.minUniqueCharacters) > 0) {
        rules = [
            ...rules,
            {
                properties: [
                    {
                        key: "min.unique.character",
                        value: values.minUniqueCharacters ? values.minUniqueCharacters : "1"
                    }
                ],
                validator: "UniqueCharacterValidator"
            }
        ];
    }

    if (values.consecutiveCharacterValidatorEnabled && Number(values.maxConsecutiveCharacters) > 0) {
        rules = [
            ...rules,
            {
                properties: [
                    {
                        key: "max.consecutive.character",
                        value: values.maxConsecutiveCharacters ? values.maxConsecutiveCharacters : "1"
                    }
                ],
                validator: "RepeatedCharacterValidator"
            }
        ];
    }

    return {
        field: "password",
        rules: rules
    };
};

const prepareUsernameValidationConfigData = (values: ValidationFormInterface): ValidationDataInterface => {

    if (!values || values?.field === "password") {
        return;
    }

    const rules: ValidationConfInterface[] = [];

    if (values?.enableValidator === "false") {
        rules.push(
            {
                properties: [
                    {
                        key: "enable.validator",
                        value: "true"
                    }
                ],
                validator: "EmailFormatValidator"
            }
        );
    } else {
        rules.push(
            {
                properties: [
                    {
                        key: "enable.validator",
                        value: "true"
                    },
                    {
                        key: "enable.special.characters",
                        value: `${!values.isAlphanumericOnly}`
                    }
                ],
                validator: "AlphanumericValidator"
            },
            {
                properties: [
                    {
                        key: "min.length",
                        value: values.minLength ? values.minLength : "3"
                    },
                    {
                        key: "max.length",
                        value: values.maxLength ? values.maxLength : "50"
                    }
                ],
                validator: "LengthValidator"
            }
        );
    }

    return {
        field: "username",
        rules: rules
    };
};
