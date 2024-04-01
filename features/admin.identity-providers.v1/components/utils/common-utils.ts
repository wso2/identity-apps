/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { store } from "../../../admin.core.v1";

const CANNOT_DELETE_IDP_DUE_TO_ASSOCIATIONS_ERROR_CODE: string = "IDP-65004";

export const handleIDPDeleteError = (error: AxiosError): void  => {
    if (
        error.response &&
        error.response.data &&
        error.response.data.code &&
        error.response.data.code === CANNOT_DELETE_IDP_DUE_TO_ASSOCIATIONS_ERROR_CODE
    ) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.deleteIDPWithConnectedApps" +
                    ".error.description"),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.deleteIDPWithConnectedApps" +
                    ".error.message")
            })
        );

        return;
    } else if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.deleteIDP.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.deleteIDP.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.deleteIDP.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.deleteIDP.genericError.message"
            )
        })
    );
};

export const handleIDPUpdateError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.updateIDP.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.updateIDP.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.updateIDP.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.updateIDP.genericError.message"
            )
        })
    );
};

export const handleGetRoleListError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.getRolesList.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.getRolesList.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getRolesList.genericError." +
                    "description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.getRolesList.genericError.message"
            )
        })
    );
};

export const handleUpdateIDPRoleMappingsError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications." +
                        "updateIDPRoleMappings.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.updateIDPRoleMappings.error.message"
                )
            })
        );
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.updateIDPRoleMappings." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.updateIDPRoleMappings." +
                    "genericError.message"
            )
        })
    );
};

export const handleGetFederatedAuthenticatorMetadataAPICallError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications." +
                        "getFederatedAuthenticatorMetadata.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications." +
                        "getFederatedAuthenticatorMetadata.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getFederatedAuthenticatorMetadata." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications." +
                    "getFederatedAuthenticatorMetadata.genericError.message"
            )
        })
    );
};

export const handleGetOutboundProvisioningConnectorMetadataError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications." +
                        "getOutboundProvisioningConnectorMetadata.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications." +
                        "getOutboundProvisioningConnectorMetadata.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications." +
                    "getOutboundProvisioningConnectorMetadata.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications." +
                    "getOutboundProvisioningConnectorMetadata.genericError.message"
            )
        })
    );
};

export const handleUpdateOutboundProvisioningConnectorError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications." +
                        "updateOutboundProvisioningConnector.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications." +
                    "updateOutboundProvisioningConnector." +
                        "error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.updateOutboundProvisioningConnector." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.updateOutboundProvisioningConnector." +
                    "genericError.message"
            )
        })
    );
};

export const handleGetIDPTemplateListError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.getIDPTemplateList." +
                        "error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.getIDPTemplateList.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getIDPTemplateList." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.getIDPTemplateList.genericError.message"
            )
        })
    );
};

export const handleGetIDPTemplateAPICallError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.getIDPTemplate.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.getIDPTemplate.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getIDPTemplate." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.getIDPTemplate.genericError.message"
            )
        })
    );
};

export const handleGetIDPListCallError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.getIDPList.error.message",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.getIDPList.error.message"
                )
            })
        );

        return;
    }
    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getIDPList.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.getIDPList.genericError.message"
            )
        })
    );

    return;
};
