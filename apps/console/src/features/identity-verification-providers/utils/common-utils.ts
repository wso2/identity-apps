/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { I18n } from "@wso2is/i18n";
import { AxiosError } from "axios";
import { store } from "../../core";


export const handleIDVPDeleteError = (error: AxiosError): void => {

    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "console:develop.features.idvp.notifications.deleteIDVP.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.idvp.notifications.deleteIDVP.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.idvp.notifications.deleteIDVP.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("console:develop.features.idvp.notifications.deleteIDVP.genericError.message")
        })
    );
};

export const handleIDVPDeleteSuccess = (): void => {
    store.dispatch(
        addAlert({
            description: I18n.instance.t("console:develop.features.idvp.notifications.deleteIDVP.success.description"),
            level: AlertLevels.SUCCESS,
            message: I18n.instance.t("console:develop.features.idvp.notifications.deleteIDVP.success.message")
        })
    );
};


