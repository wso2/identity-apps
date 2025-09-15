/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

/**
 * Interface for additional parameters.
 */
interface DescriptionParams {
    [key: string]: string | number | boolean;
}

/**
 * Custom hook for handling webhook success alerts.
 */
export const useHandleWebhookSuccess = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    return (operation: string, additionalParams?: DescriptionParams): void => {
        const descriptionParams: DescriptionParams = additionalParams || {};

        dispatch(
            addAlert({
                description: t(`webhooks:notifications.${operation}.success.description`, descriptionParams),
                level: AlertLevels.SUCCESS,
                message: t(`webhooks:notifications.${operation}.success.message`)
            })
        );
    };
};

/**
 * Custom hook for handling webhook error alerts.
 */
export const useHandleWebhookError = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    return (error: AxiosError, operation: string, additionalParams?: DescriptionParams): void => {
        const descriptionParams: DescriptionParams = additionalParams || {};

        if (error.response?.data?.description) {
            dispatch(
                addAlert({
                    description: t(`webhooks:notifications.${operation}.error.description`, {
                        description: error.response.data.description,
                        ...descriptionParams
                    }),
                    level: AlertLevels.ERROR,
                    message: t(`webhooks:notifications.${operation}.error.message`)
                })
            );
        } else {
            dispatch(
                addAlert({
                    description: t(`webhooks:notifications.${operation}.error.genericDescription`, descriptionParams),
                    level: AlertLevels.ERROR,
                    message: t(`webhooks:notifications.${operation}.error.message`)
                })
            );
        }
    };
};
