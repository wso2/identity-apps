/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import { AxiosError } from "axios";
import { store } from "../../../core";

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
                    "console:develop.features.authenticationProvider.notifications.deleteIDPWithConnectedApps" +
                    ".error.description"),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.deleteIDPWithConnectedApps" +
                    ".error.message")
            })
        );

        return;
    } else if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.deleteIDP.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.deleteIDP.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.deleteIDP.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.deleteIDP.genericError.message"
            )
        })
    );
};

export const handleIDPUpdateError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.updateIDP.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.updateIDP.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.updateIDP.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.updateIDP.genericError.message"
            )
        })
    );
};

export const handleGetRoleListError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getRolesList.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getRolesList.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getRolesList.genericError." +
                    "description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getRolesList.genericError.message"
            )
        })
    );
};

export const handleUpdateIDPRoleMappingsError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications." +
                        "updateIDPRoleMappings.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.updateIDPRoleMappings.error.message"
                )
            })
        );
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.updateIDPRoleMappings." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.updateIDPRoleMappings." +
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
                    "console:develop.features.authenticationProvider.notifications." +
                        "getFederatedAuthenticatorMetadata.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications." +
                        "getFederatedAuthenticatorMetadata.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getFederatedAuthenticatorMetadata." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications." +
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
                    "console:develop.features.authenticationProvider.notifications." +
                        "getOutboundProvisioningConnectorMetadata.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications." +
                        "getOutboundProvisioningConnectorMetadata.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications." +
                    "getOutboundProvisioningConnectorMetadata.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications." +
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
                    "console:develop.features.authenticationProvider.notifications." +
                        "updateOutboundProvisioningConnector.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications." +
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
                "console:develop.features.authenticationProvider.notifications.updateOutboundProvisioningConnector." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.updateOutboundProvisioningConnector." +
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
                    "console:develop.features.authenticationProvider.notifications.getIDPTemplateList." +
                        "error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getIDPTemplateList.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getIDPTemplateList." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getIDPTemplateList.genericError.message"
            )
        })
    );
};

export const handleGetIDPTemplateAPICallError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getIDPTemplate.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getIDPTemplate.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getIDPTemplate." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getIDPTemplate.genericError.message"
            )
        })
    );
};

export const handleGetIDPListCallError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getIDPList.error.message",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "console:develop.features.authenticationProvider.notifications.getIDPList.error.message"
                )
            })
        );

        return;
    }
    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getIDPList.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "console:develop.features.authenticationProvider.notifications.getIDPList.genericError.message"
            )
        })
    );

    return;
};
