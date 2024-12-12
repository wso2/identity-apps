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

import { getApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import { ApplicationListInterface } from "@wso2is/admin.applications.v1/models/application";
import { AppState } from "@wso2is/admin.core.v1";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { AxiosError } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import { MutableRefObject, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";

/**
 * Hook for validate the application name.
 *
 * @returns The application name validation function.
 */
const useApplicationNameValidation = (): {
    validateApplicationName: (name: string, id: string) => Promise<string | null>
} => {
    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const reservedAppNamePattern: string = useSelector((state: AppState) => {
        return state?.config?.deployment?.extensions?.asgardeoReservedAppRegex as string;
    });

    const previouslyValidatedApplicationName: MutableRefObject<string> = useRef(null);
    const [ isApplicationNameAlreadyReserved, setIsApplicationNameAlreadyReserved ] = useState<boolean>(false);

    /**
     * Search for applications and retrieve a list for the given app name.
     *
     * @param appName - Name of the application for searching.
     * @returns List of applications found based on the given name.
     */
    const getApplications = (appName: string): Promise<ApplicationListInterface> => {

        return getApplicationList(null, null, "name eq " + appName?.trim())
            .then((response: ApplicationListInterface) => response)
            .catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
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
        return name && !!name?.match(ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_PATTERN);
    };

    /**
     * Check if there is any application with the given name.
     *
     * @param name - Name of the application.
     * @param appId - application id.
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
     * @param name - The value need to be validated.
     * @returns Whether the provided value is a valid application name.
     */
    const validateApplicationName = async (name: string, id: string): Promise<string | null> => {
        if (!isNameValid(name)) {
            return t("applications:forms." +
                "spaProtocolSettingsWizard.fields.name.validations.invalid", {
                characterLimit: ApplicationManagementConstants.FORM_FIELD_CONSTRAINTS.APP_NAME_MAX_LENGTH,
                name
            });
        }

        if (isAppNameReserved(name)) {
            return t("applications:forms.generalDetails.fields.name.validations.reserved", {
                name
            });
        }

        await isApplicationNameAlreadyExist(name, id);

        if (isApplicationNameAlreadyReserved) {
            return t("applications:forms.generalDetails.fields.name.validations.duplicate");
        }

        return null;
    };

    return {
        validateApplicationName
    };
};

export default useApplicationNameValidation;
