/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../../features/core/hooks/use-request";
import { store } from "../../core";
import { ValidationManagementConstants } from "../constants/validation-config-constants";
import { ValidationConfInterface, ValidationDataInterface, ValidationFormInterface } from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

export const updateValidationConfigData = (data: ValidationFormInterface): Promise<ValidationDataInterface[]> => {

    const config: ValidationDataInterface[] = [
        prepareValidationConfigData(data)
    ];

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

export const useValidationConfigData = <Data = ValidationDataInterface[], Error = RequestErrorInterface>(
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {},
        url: store.getState().config.endpoints.validationServiceMgt
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

const prepareValidationConfigData = (values: ValidationFormInterface): ValidationDataInterface => {

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

    if (values.uniqueCharacterValidatorEnabled) {
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

    if (values.consecutiveCharacterValidatorEnabled) {
        rules = [
            ...rules,
            {
                properties: [
                    {
                        key: "max.consecutive.character",
                        value: values.minUniqueCharacters ? values.minUniqueCharacters : "1"
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
