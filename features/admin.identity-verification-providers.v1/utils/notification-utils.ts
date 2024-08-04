/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { store } from "@wso2is/admin.core.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { AxiosError } from "axios";

/**
 * Show an alert with an error message if the IDVP delete API call fails.
 *
 * @param error - Error response object
 * @returns void
 */
export const handleIDVPDeleteError = (error: IdentityAppsApiException): void => {

    if(!error){
        return;
    }

    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "idvp:notifications.deleteIDVP.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "idvp:notifications.deleteIDVP.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "idvp:notifications.deleteIDVP.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("idvp:notifications.deleteIDVP.genericError.message")
        })
    );
};

/**
 * Show an alert with a success message if the IDVP delete API call succeeds.
 *
 * @returns void
 */
export const handleIDVPDeleteSuccess = (): void => {

    store.dispatch(
        addAlert({
            description: I18n.instance.t("idvp:notifications.deleteIDVP.success.description"),
            level: AlertLevels.SUCCESS,
            message: I18n.instance.t("idvp:notifications.deleteIDVP.success.message")
        })
    );
};

/**
 * Show an alert with a success message if the IDVP update API call succeeds.
 *
 * @returns void
 */
export const handleIDVPUpdateSuccess = (): void => {

    store.dispatch(
        addAlert({
            description: I18n.instance.t("idvp:notifications.updateIDVP.success.description"),
            level: AlertLevels.SUCCESS,
            message: I18n.instance.t("idvp:notifications.updateIDVP.success.message")
        })
    );
};

/**
 * Show an alert with an error message if the IDVP update API call fails.
 *
 * @param error - Error response object
 * @returns void
 */
export const handleIDVPUpdateError = (error: IdentityAppsApiException): void => {

    if(!error){
        return;
    }

    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "idvp:notifications.updateIDVP.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "idvp:notifications.updateIDVP.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "idvp:notifications.updateIDVP.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("idvp:notifications.updateIDVP.genericError.message")
        })
    );
};

/**
 * Show an alert with an error message if the IDVP template API call fails.
 *
 * @param error - Error response object
 * @returns void
 */
export const handleIDVPTemplateRequestError = (error: AxiosError): void => {

    if(!error){
        return;
    }

    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "idvp:notifications.getIDVPTemplateTypes.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "idvp:notifications.getIDVPTemplateTypes.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "idvp:notifications.getIDVPTemplateTypes.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "idvp:notifications.getIDVPTemplateTypes.genericError.message"
            )
        })
    );
};

/**
 * Handle load error on IDVP template types.
 *
 * @param error - Error response.
 * @returns void
 */
export const handleIDVPTemplateTypesLoadError = (error: AxiosError): void => {

    if (!error) {
        return;
    }

    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "idvp:notifications.getIDVPTemplateType.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "idvp:notifications.getIDVPTemplateType.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "idvp:notifications.getIDVPTemplateTypes.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "idvp:notifications.getIDVPTemplateTypes.genericError.message"
            )
        })
    );
};

/**
 * Displays an error alert when there is a failure in the identity verification provider list fetch request.
 *
 * @param idvpListFetchRequestError - Error response.
 * @returns void
 */
export const handleIdvpListFetchRequestError = (idvpListFetchRequestError: AxiosError): void => {

    if (!idvpListFetchRequestError) {
        return;
    }
    if (idvpListFetchRequestError?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "idvp:notifications.getIDVPList.error.description",
                    { description: idvpListFetchRequestError.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("idvp:notifications.getIDVPList.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "idvp:notifications.getIDVPList.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "idvp:notifications.getIDVPList.genericError.message"
            )
        })
    );
};

/**
 * Displays an error alert when there is a failure in the identity verification provider UI metadata load request.
 *
 * @param uiMetaDataLoadError - Error response from API request.
 * @returns void
 */
export const handleUIMetadataLoadError = (uiMetaDataLoadError: AxiosError): void=> {

    if (!uiMetaDataLoadError) {
        return;
    }

    if (uiMetaDataLoadError?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "idvp:notifications.getUIMetadata.error.description",
                    { description: uiMetaDataLoadError.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("idvp:notifications.getUIMetadata.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "idvp:notifications.getUIMetadata.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("idvp:notifications.getUIMetadata.genericError.message")
        })
    );
};

/**
 * Displays an error alert when there is a failure in the identity verification provider template load request.
 *
 * @param idvpTemplateFetchRequestError - Error response from API request.
 */
export const handleIDVPTemplateFetchRequestError = (idvpTemplateFetchRequestError: AxiosError): void => {

    if (!idvpTemplateFetchRequestError) {
        return;
    }

    if (idvpTemplateFetchRequestError?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "idvp:notifications.getIDVPTemplate.error.description",
                    { description: idvpTemplateFetchRequestError.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("idvp:notifications.getIDVPTemplate.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "idvp:notifications.getIDVPTemplate.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("idvp:notifications.getIDVPTemplate.genericError.message")
        })
    );
};

/**
 * Displays an error alert when there is a failure in the identity verification provider fetch request.
 *
 * @param idvpFetchError - Error response from API request.
 * @returns void
 */
export const handleIDVPFetchRequestError = (idvpFetchError: AxiosError): void => {

    if (!idvpFetchError) {
        return;
    }

    if (idvpFetchError?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "idvp:notifications.getIDVP.error.description",
                    { description: idvpFetchError.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("idvp:notifications.getIDVP.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "idvp:notifications.getIDVP.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("idvp:notifications.getIDVP.genericError.message")
        })
    );
};
