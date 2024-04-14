/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../../admin.core.v1";
import { getApplicationList } from "../api/application";
import { ApplicationManagementConstants } from "../constants";
import { ApplicationListInterface } from "../models";
import { ValidationRule, ValidationRuleTypes } from "../models/dynamic-fields";

/**
 * Custom hook for dynamic field validations.
 *
 * @returns A validation function for the field.
 */
const useDynamicFieldValidations = (): {
    validate: (value: any, validations: ValidationRule[]) => Promise<string | null> } => {
    const { t, i18n } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const reservedAppNamePattern: string = useSelector((state: AppState) => {
        return state.config?.deployment?.extensions?.asgardeoReservedAppRegex as string;
    });

    /**
     * Search for applications and retrieve a list for the given app name.
     *
     * @param appName - Name of the application for searching.
     * @returns List of applications found based on the given name.
     */
    const getApplications = (appName: string): Promise<ApplicationListInterface> => {

        return getApplicationList(null, null, "name eq " + appName.trim())
            .then((response: ApplicationListInterface) => response)
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t("applications:notifications.fetchApplications.error.message")
                    }));

                    return null;
                }

                dispatch(addAlert({
                    description: t("applications:notifications." +
                        "fetchApplications.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("applications:notifications." +
                        "fetchApplications.genericError.message")
                }));

                return null;
            });
    };

    /**
     * Handle error messages based on the validation rule error message.
     * If the validation rule contains an error message, that message will be returned.
     * If there is no configured error message, the function will return the default error message.
     *
     * @param validationResult - Result of the validation function.
     * @param errorMessage - Custom error message for the validation rule.
     * @returns The final error message or null based on the validation result.
     */
    const handleErrorMessage = (validationResult: string | null, errorMessage: string): string | null => {
        if (validationResult) {
            if (errorMessage) {
                if (i18n.exists(errorMessage)) {
                    return t(errorMessage);
                }

                return errorMessage;
            }

            return t(validationResult);
        }

        // If all validation rules are successful, return null for the errorMessage.
        return null;
    };

    /**
     * Validates a field based on its validation rules.
     *
     * @param value - The field's value to be validated.
     * @param validations - An array of validation rules for the field.
     * @returns An error message if validation fails, or `null` if validation succeeds.
     */
    const validateField = async (value: any, validations: ValidationRule[]): Promise<string | null> => {
        if (!validations) {
            return null;
        }

        for (const validation of validations) {
            const { type, errorMessage } = validation;

            switch (type) {
                case ValidationRuleTypes.DOMAIN_NAME:
                    return handleErrorMessage(validateDomainName(value), errorMessage);
                case ValidationRuleTypes.APPLICATION_NAME:
                    return handleErrorMessage(await validateApplicationName(value), errorMessage);
            }
        }
    };

    /**
     * Verify if the provided value is a domain name.
     *
     * value - The value needs validation.
     * @returns Whether the provided value is a valid domain name or not.
     */
    const validateDomainName = (value: string): string | null => {
        // Regular expression to validate domain name.
        const domainRegex: RegExp = /^((?!-)[A-Za-z0-9-]{1, 63}(?<!-)\\.)+[A-Za-z]{2, 6}$/;

        // Test if the provided value matches the domain name regex.
        if (!domainRegex.test(value)) {
            return "applications:dynamicFieldValidation.invalidDomainName";
        }

        return null;
    };

    /**
     * Checks whether the application name is valid.
     *
     * @param name - Application name.
     */
    const validateApplicationName = async (name: string): Promise<string> => {

        /**
         * Checks whether the application name is reserved.
         *
         * @param name - Name of the application.
         */
        const isAppNameReserved = (name: string) => {
            if(!reservedAppNamePattern) {
                return false;
            }
            const reservedAppRegex: RegExp = new RegExp(reservedAppNamePattern);

            return name && reservedAppRegex.test(name);
        };

        /**
         * Checks whether the application name is valid.
         *
         * @param name - Name of the application.
         */
        const isNameValid = (name: string) => {
            return name && !!name.match(ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_PATTERN);
        };

        const appName: string = name.toString().trim();

        if (!isNameValid(appName)) {
            return t("applications:forms." +
                "spaProtocolSettingsWizard.fields.name.validations.invalid", {
                appName,
                characterLimit: ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH
            });
        }

        if (isAppNameReserved(appName)) {
            return t("applications:forms.generalDetails.fields.name.validations.reserved", {
                appName
            });
        }

        const response: ApplicationListInterface = await getApplications(appName);

        if (response?.applications?.length > 0) {
            return t("applications:forms.generalDetails.fields.name.validations.duplicate");
        }

        return null;
    };

    return {
        validate:
            (value: any, validations: ValidationRule[]): Promise<string | null> => validateField(value, validations)
    };
};

export default useDynamicFieldValidations;
