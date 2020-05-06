/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";

const dispatch = useDispatch();

const { t } = useTranslation();

export const handleIDPDeleteError = (error) => {
    if (error.response && error.response.data && error.response.data.description) {
        dispatch(addAlert({
            description: error.response.data.description,
            level: AlertLevels.ERROR,
            message: t("devPortal:components.idp.notifications.deleteIDP.error.message")
        }));

        return;
    }

    dispatch(addAlert({
        description: t("devPortal:components.idp.notifications.deleteIDP.genericError.description"),
        level: AlertLevels.ERROR,
        message: t("devPortal:components.idp.notifications.deleteIDP.genericError.message")
    }));
};

export const handleIDPUpdateError = (error) => {
    if (error.response && error.response.data && error.response.data.description) {
        dispatch(addAlert({
            description: t("devPortal:components.idp.notifications.updateIDP.error.description"),
            level: AlertLevels.ERROR,
            message: t("devPortal:components.idp.notifications.updateIDP.error.message")
        }));

        return;
    }

    dispatch(addAlert({
        description: t("devPortal:components.idp.notifications.updateIDP.genericError.description"),
        level: AlertLevels.ERROR,
        message: t("devPortal:components.idp.notifications.updateIDP.genericError.message")
    }));
};
