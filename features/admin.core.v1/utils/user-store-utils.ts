/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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

import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { getUserStoreList } from "@wso2is/admin.userstores.v1/api";
import { UserStoreProperty } from "@wso2is/admin.userstores.v1/models";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import isEmpty from "lodash-es/isEmpty";
import { getAUserStore, getPrimaryUserStore } from "../api/user-store";
import { UserStoreDetails } from "../models/user-store";
import { store } from "../store";

/**
 * Utility class for common user store operations.
 */
export class SharedUserStoreUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * The following method get the username regEx for the selected user store.
     *
     * @param userstore - userstore name.
     * @param regExName - regEx pattern.
     *
     *  @deprecated This method is deprecated. Use the `useUserStoreRegEx()` hook.
     */
    public static async getUserStoreRegEx(userstore: string, regExName: string): Promise<string> {
        let usernameRegEx: UserStoreProperty = null;

        return getUserStoreList()
            .then((response: any) => {
                const store: any = response?.data?.find((item: any) => item.name === userstore);

                if (!isEmpty(store)) {
                    return getAUserStore(store.id)
                        .then((resp: any) => {
                            usernameRegEx = resp.properties.find((property: any) =>
                                property?.name?.toLowerCase() === regExName?.toLowerCase());

                            return usernameRegEx?.value;
                        });
                }
            });
    }

    /**
     * The following method validate user input against the user store regEx.
     *
     * @param inputValue - input value.
     * @param regExValue - regEx value.
     */
    public static validateInputAgainstRegEx(inputValue: string, regExValue: string): boolean {
        const regEx: RegExp = new RegExp(regExValue);

        return regEx.test(inputValue);
    }

    /**
     * Validate against password.
     *
     * @param inputValue - input value to be validated.
     * @param passwordConfig - password configuration.
     * @param upperCasePattern - regex for upper case.
     * @param lowerCasePattern - regex for lower case.
     * @param numberPattern - regex for numbers.
     * @param specialChrPattern - regex for special characters.
     * @param consecutiveChrPattern - regex for consecutive characters.
     */
    public static validatePasswordAgainstRules(inputValue: string, passwordConfig: ValidationFormInterface,
        upperCasePattern: string, lowerCasePattern: string, numberPattern: string, specialChrPattern: string,
        consecutiveChrPattern: string
    ): boolean {

        if (passwordConfig === undefined || passwordConfig === null) {
            return true;
        }
        // Length check.
        if (inputValue.length < Number(passwordConfig.minLength) ||
            inputValue.length > Number(passwordConfig.maxLength)) {
            return false;
        }

        // Upper case check.
        if (Number(passwordConfig.minUpperCaseCharacters) > 0) {
            if (!inputValue.match(upperCasePattern) ||
                inputValue.match(upperCasePattern).length < Number(passwordConfig.minUpperCaseCharacters)) {
                return false;
            }
        }

        // Lower case check.
        if (Number(passwordConfig.minLowerCaseCharacters) > 0) {
            if (!inputValue.match(lowerCasePattern) ||
                inputValue.match(lowerCasePattern).length < Number(passwordConfig.minLowerCaseCharacters)) {
                return false;
            }
        }

        // Numeric check.
        if (Number(passwordConfig.minNumbers) > 0) {
            if (!inputValue.match(numberPattern) ||
                inputValue.match(numberPattern).length < Number(passwordConfig.minNumbers)) {
                return false;
            }
        }

        // Special character check.
        if (Number(passwordConfig.minSpecialCharacters) > 0) {
            if (!inputValue.match(specialChrPattern) ||
                inputValue.match(specialChrPattern).length < Number(passwordConfig.minSpecialCharacters)) {
                return false;
            }
        }

        // Unique character check.
        if (passwordConfig.uniqueCharacterValidatorEnabled) {
            const unique : string[] = inputValue.split("");
            const set : Set<string> = new Set(unique);

            if (!(Number(passwordConfig.minUniqueCharacters) > 0 &&
                set.size > Number(passwordConfig.minUniqueCharacters))) {
                return false;
            }
        }
        // Repetitive character check.
        if(passwordConfig.consecutiveCharacterValidatorEnabled &&
            inputValue.match(consecutiveChrPattern)) {
            const long: string = inputValue.match(consecutiveChrPattern).sort(
                function(a: string, b: string) {
                    return b.length - a.length;
                }
            ) [0];

            if (long.length > Number(passwordConfig.maxConsecutiveCharacters)) {
                return false;
            }
        }

        return true;
    }

    /**
     * The following method will fetch the primary user store details.
     */
    public static async getPrimaryUserStore(): Promise<void | UserStoreDetails> {
        return getPrimaryUserStore(userstoresConfig.primaryUserstoreId).then((response: any) => {
            return response;
        }).catch(() => {
            store.dispatch(addAlert({
                description: I18n.instance.t("console:develop.features.userstores.notifications.fetchUserstores." +
                    "genericError.description"),
                level: AlertLevels.INFO,
                message: I18n.instance.t("console:develop.features.userstores.notifications.fetchUserstores." +
                    "genericError.message")
            }));
        });
    }
}
