/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
import { HttpMethods } from "../models";
import {
    ValidationConfInterface,
    ValidationDataInterface,
    ValidationFormInterface,
    ValidationPropertyInterface
} from "../models/validation";
import { store } from "../store";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches the list of applications.
 *
 * @return {Promise<any>} A promise containing the response.
 */
export const fetchPasswordValidationConfig = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {},
        url: store.getState().config.endpoints.validationMgt
    };

    return httpClient(requestConfig)
        .then((response) => {
            console.log(response.data);
            console.log(getPasswordConfig(response.data));
            return getPasswordConfig(response.data) as ValidationFormInterface;
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

export const getPasswordConfig = (validationConfig: ValidationDataInterface[]): ValidationFormInterface => {

    const passwordConf: ValidationDataInterface[] =
        validationConfig?.filter((data: ValidationDataInterface) => data.field === "password");

    if (passwordConf === undefined || passwordConf.length < 1) {
        return {
            field: "password",
            maxLength: 30,
            minLength: 8,
            minLowerCaseCharacters: 1,
            minNumbers: 1,
            minSpecialCharacters: 1,
            minUpperCaseCharacters: 1,
            type: "rules"
        };
    }

    const config: ValidationDataInterface = passwordConf[0];

    const rules: ValidationConfInterface[] = config.rules;

    return {
        consecutiveCharacterValidatorEnabled:
            getConfig(rules, "RepeatedCharacterValidator", "max.consecutive.character") !== null,
        field: "password",
        maxConsecutiveCharacters: getConfig(rules, "RepeatedCharacterValidator", "max.consecutive.character") ?
            Number(getConfig(rules, "RepeatedCharacterValidator", "max.consecutive.character")) : 0,
        maxLength: getConfig(rules, "LengthValidator", "max.length") ?
            Number(getConfig(rules, "LengthValidator", "max.length")) : 30,
        minLength: getConfig(rules, "LengthValidator", "min.length") ?
            Number(getConfig(rules, "LengthValidator", "min.length")) : 8,
        minLowerCaseCharacters: getConfig(rules, "LowerCaseValidator", "min.length") ?
            Number(getConfig(rules, "LowerCaseValidator", "min.length")) : 0,
        minNumbers: getConfig(rules, "NumeralValidator", "min.length") ?
            Number(getConfig(rules, "NumeralValidator", "min.length")) : 0,
        minSpecialCharacters: getConfig(rules, "SpecialCharacterValidator", "min.length") ?
            Number(getConfig(rules, "SpecialCharacterValidator", "min.length")) : 0,
        minUniqueCharacters: getConfig(rules, "UniqueCharacterValidator", "min.length") ?
            Number(getConfig(rules, "UniqueCharacterValidator", "min.length")) : 1,
        minUpperCaseCharacters: getConfig(rules, "UpperCaseValidator", "min.length") ?
            Number(getConfig(rules, "UpperCaseValidator", "min.length")) : 0,
        type: "rules",
        uniqueCharacterValidatorEnabled:
            getConfig(rules, "UniqueCharacterValidator", "min.unique.character") !== null
    };
}

/**
 * The following function is to get the value of a specific validator configuration.
 *
 * @param ruleSet - list of rules configured.
 * @param validator - validator name.
 * @param attribute - attribute name.
 * @returns the value of the validator configuration.
 */
export const getConfig = (ruleSet: ValidationConfInterface[], validator: string, attribute: string): string => {

    const config: ValidationConfInterface[] = ruleSet?.filter((data: ValidationConfInterface) => {
        return data.validator === validator;
    });

    if (config.length > 0) {
        let properties: ValidationPropertyInterface[] = config[0].properties;

        properties = properties.filter((data: ValidationPropertyInterface) => data.key === attribute);

        if (properties.length > 0) {

                return properties[0].value;
        }
    }

    return null;
};
