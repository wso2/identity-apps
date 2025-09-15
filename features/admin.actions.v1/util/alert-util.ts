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
 * Custom hook for handling success alerts.
 */
export const useHandleSuccess = () => {
    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    return (operation: string): void => {
        dispatch(
            addAlert({
                description: t("actions:notification.success." + operation + ".description"),
                level: AlertLevels.SUCCESS,
                message: t("actions:notification.success." + operation + ".message")
            })
        );
    };
};

/**
 * Custom hook for handling error alerts.
 */
export const useHandleError = () => {

    const dispatch: Dispatch<any> = useDispatch();
    const { t } = useTranslation();

    return (error: AxiosError, operation: string): void => {
        if (error.response?.data?.description) {
            dispatch(
                addAlert({
                    description: t("actions:notification.error." + operation + ".description", {
                        description: error.response.data.description
                    }),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.error." + operation + ".message")
                })
            );
        } else {
            dispatch(
                addAlert({
                    description: t("actions:notification.genericError." + operation + ".description"),
                    level: AlertLevels.ERROR,
                    message: t("actions:notification.genericError." + operation + ".message")
                })
            );
        }
    };
};
