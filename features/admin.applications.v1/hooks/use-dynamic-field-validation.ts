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
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import get from "lodash-es/get";
import set from "lodash-es/set";
import { MutableRefObject, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AppState } from "../../admin.core.v1";
import { getApplicationList } from "../api/application";
import { ApplicationManagementConstants } from "../constants";
import { ApplicationListInterface } from "../models";
import {
    DynamicFieldInterface,
    ValidationRule,
    ValidationRuleTypes
} from "../models/dynamic-fields";
import { ApplicationCreateWizardFormValuesInterface } from "../models/form";

/**
 * Custom hook for dynamic field validations.
 *
 * @returns A validation function for the field.
 */
const useDynamicFieldValidations = (): {
    validate: (
        formValues: ApplicationCreateWizardFormValuesInterface,
        fields: DynamicFieldInterface[]
    ) => Promise<{ [key in keyof ApplicationCreateWizardFormValuesInterface]: string }> } => {
    const { t, i18n } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const reservedAppNamePattern: string = useSelector((state: AppState) => {
        return state.config?.deployment?.extensions?.asgardeoReservedAppRegex as string;
    });

    const previouslyValidatedApplicationName: MutableRefObject<string> = useRef(null);
    const [
        isApplicationNameAlreadyReserved,
        setIsApplicationNameAlreadyReserved
    ] = useState<boolean>(false);

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
     * @param values - The form values to be validated.
     * @param validations - An array of validation rules for the field.
     * @returns An error message if validation fails, or `null` if validation succeeds.
     */
    const validateField = async (
        values: ApplicationCreateWizardFormValuesInterface,
        field: DynamicFieldInterface,
        validations: ValidationRule[]
    ): Promise<string | null> => {
        if (!validations) {
            return null;
        }

        for (const validation of validations) {
            const { type, errorMessage } = validation;

            let validationResult: string = null;

            switch (type) {
                case ValidationRuleTypes.DOMAIN_NAME:
                    validationResult = handleErrorMessage(validateDomainName(values, field), errorMessage);

                    break;
                case ValidationRuleTypes.APPLICATION_NAME:
                    validationResult = handleErrorMessage(await validateApplicationName(values, field), errorMessage);

                    break;
                case ValidationRuleTypes.REQUIRED:
                    validationResult = handleErrorMessage(requiredField(values, field), errorMessage);

                    break;
            }

            if (validationResult) {
                return validationResult;
            }
        }

        return null;
    };

    /**
     * Validate all provided fields according to their respective validation rules.
     *
     * @param formValues - Current values of all form fields.
     * @param fields - Metadata associated with each field.
     * @returns An error object containing error messages for each provided field.
     */
    const validateAllFields = async (
        formValues: ApplicationCreateWizardFormValuesInterface,
        fields: DynamicFieldInterface[]
    ): Promise<{ [key in keyof ApplicationCreateWizardFormValuesInterface]: string }> => {
        const errorObject: { [key in keyof ApplicationCreateWizardFormValuesInterface]: string } = {};

        for (const field of fields) {
            let validations: ValidationRule[] = [];

            if (field?.validations && Array.isArray(field?.validations) && field?.validations?.length > 0) {
                validations = [ ...field?.validations ];
            }

            if (field?.required) {
                validations = [ { type: ValidationRuleTypes.REQUIRED }, ...validations ];
            }

            if (validations?.length > 0) {
                const error: string = await validateField(formValues, field, validations);

                if (error) {
                    set(errorObject, field?.name, error);
                }
            }
        }

        return errorObject;
    };

    /**
     * Check if the field is filled with a value.
     *
     * value - The value needs validation.
     * @returns Whether the provided value is a non empty value.
     */
    const requiredField = (
        values: ApplicationCreateWizardFormValuesInterface,
        field: DynamicFieldInterface
    ): string | null => {
        const value: any = get(values, field?.name);

        if (!value) {
            return "applications:forms.dynamicApplicationCreateWizard.common.validations.required";
        }

        return null;
    };

    /**
     * Verify if the provided value is a domain name.
     *
     * value - The value needs validation.
     * @returns Whether the provided value is a valid domain name or not.
     */
    const validateDomainName = (
        values: ApplicationCreateWizardFormValuesInterface,
        field: DynamicFieldInterface
    ): string | null => {
        const value: any = get(values, field?.name);

        // Regular expression to validate domain name.
        const domainRegex: RegExp =
            /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)(?:\.(?!-)[A-Za-z0-9-]{1,63}(?<!-))*\.(?:[A-Za-z]{2,6})$/;

        // Test if the provided value matches the domain name regex.
        if (!domainRegex.test(value)) {
            return "applications:forms.dynamicApplicationCreateWizard.domainName.validations.invalid";
        }

        return null;
    };

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

    /**
     * Check if there is any application with the given name.
     *
     * @param name - Name of the application.
     */
    const isApplicationNameAlreadyExist: DebouncedFunc<(name: string, appId: string) => Promise<void>> = debounce(
        async (name: string, appId: string) => {
            if (previouslyValidatedApplicationName?.current !== name) {
                previouslyValidatedApplicationName.current = name;

                const response: ApplicationListInterface = await getApplications(name);

                setIsApplicationNameAlreadyReserved(
                    response?.totalResults > 0 && response?.applications[0]?.id !== appId);
            }
        },
        500
    );

    /**
     * Checks whether the application name is valid.
     *
     * @param name - Application name.
     */
    const validateApplicationName = async (
        values: ApplicationCreateWizardFormValuesInterface,
        field: DynamicFieldInterface
    ): Promise<string | null> => {
        const appName: string = get(values, field?.name)?.toString()?.trim();

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

        await isApplicationNameAlreadyExist(appName, values?.id);

        if (isApplicationNameAlreadyReserved) {
            return t("applications:forms.generalDetails.fields.name.validations.duplicate");
        }

        return null;
    };

    return {
        validate: (
            formValues: ApplicationCreateWizardFormValuesInterface,
            fields: DynamicFieldInterface[]
        ): Promise<{ [key in keyof ApplicationCreateWizardFormValuesInterface]: string }> =>
            validateAllFields(formValues, fields)
    };
};

export default useDynamicFieldValidations;
