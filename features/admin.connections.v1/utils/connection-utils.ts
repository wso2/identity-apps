/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ImageUtils, URLUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import { AxiosError } from "axios";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import { getConnections } from "../api/connections";
import { CommonAuthenticatorConstants } from "../constants/common-authenticator-constants";
import { ConnectionUIConstants } from "../constants/connection-ui-constants";
import { FederatedAuthenticatorConstants } from "../constants/federated-authenticator-constants";
import { AuthenticatorLabels, AuthenticatorTypes, MultiFactorAuthenticatorInterface } from "../models/authenticators";
import {
    ConnectionInterface,
    ConnectionListResponseInterface,
    ConnectionTabTypes,
    CustomAuthConnectionInterface,
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorListResponseInterface,
    OutboundProvisioningConnectorInterface,
    SupportedServices
} from "../models/connection";
import { ReactComponent as ConnectionIcon } from "../resources/assets/images/icons/connection.svg";
import { ReactComponent as ProvisionIcon } from "../resources/assets/images/icons/provision.svg";

/**
 * Utility class for connections operations.
 */
export class ConnectionsManagementUtils {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() {}

    public static updateConnnectorDetails = (
        connection: ConnectionInterface,
        templateDescription: string
    ): ConnectionInterface => {
        const connector: OutboundProvisioningConnectorInterface =
            connection?.provisioning?.outboundConnectors?.connectors[0];

        const isGoogleConnector: boolean =
            get(connector, CommonAuthenticatorConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME_KEY) ===
            CommonAuthenticatorConstants.PROVISIONING_CONNECTOR_GOOGLE;

        // If the outbound connector is Google, remove the displayName from the connector.
        if (connector && isGoogleConnector) {
            delete connector[CommonAuthenticatorConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME_KEY];
        }

        // Use description from template.
        connection.description = templateDescription;

        return connection;
    };

    /**
     * Type-guard to check if the connector is an Identity Provider.
     *
     * @param connector - Checking connector.
     *
     * @returns Whether the connector is IdentityProviderInterface.
     */
    public static isConnectorIdentityProvider(
        connector: ConnectionInterface | MultiFactorAuthenticatorInterface
    ): connector is ConnectionInterface {
        return (connector as ConnectionInterface)?.federatedAuthenticators !== undefined;
    }

    /**
     * Type-guard to check if the connector is a custom authenticator.
     *
     * @param authenticator - Authenticator to evaluate.
     * @returns - `true` if the authenticator is a custom authenticator.
     */
    public static IsCustomAuthenticator = (authenticator: ConnectionInterface): boolean => {
        const tags: string[] = (authenticator as CustomAuthConnectionInterface)?.tags ?? [];
        const isCustom: boolean = tags.some((tag: string) => tag === AuthenticatorLabels.CUSTOM);

        return isCustom;
    };

    /**
     * Type-guard to check if the connector is a custom local authenticator.
     *
     * @param authenticator - Authenticator to evaluate.
     * @returns - `true` if the authenticator is a custom local authenticator.
     */
    public static IsCustomLocalAuthenticator = (authenticator: ConnectionInterface): boolean => {
        return (
            this.IsCustomAuthenticator(authenticator) &&
            authenticator?.type === AuthenticatorTypes.LOCAL
        );
    };

    /**
     * Utility method to check if the connector is Organization SSO.
     *
     * @param id - Connector id.
     *
     * @returns Whether the connector is Organization SSO.
     */
    public static isOrganizationSSOConnection(id: string): boolean {
        return id === FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID;
    }

    /**
     * Resolve tags for a connection.
     * `tags` appear inside the `federatedAuthenticators.authenticators` array. Hence, we need to iterate
     * and find out the default authenticator and extract the tags.
     *
     * @param connections - Federated authenticators.
     *
     * @returns Tags.
     */
    public static resolveConnectionTags(connections: FederatedAuthenticatorListResponseInterface): string[] {
        if (!connections?.defaultAuthenticatorId || !Array.isArray(connections.authenticators)) {
            return [];
        }

        const found: FederatedAuthenticatorListItemInterface = connections.authenticators.find(
            (authenticator: FederatedAuthenticatorListItemInterface) => {
                return authenticator.authenticatorId === connections.defaultAuthenticatorId;
            }
        );

        return Array.isArray(found.tags) ? found.tags : [];
    }

    public static buildConnectionsFilterQuery(searchQuery: string, filters: string[]): string {
        if (isEmpty(filters) || !Array.isArray(filters) || filters.length <= 0) {
            return isEmpty(searchQuery) ? null : searchQuery;
        }

        let query: string = searchQuery ? `${searchQuery} and (` : "(";

        if (filters.length > 1) {
            filters.map((filter: string, index: number) => {
                query = `${query}tag eq ${filter}${index === filters.length - 1 ? ")" : " or "}`;
            });
        } else {
            query = `${query}tag eq ${filters[0]})`;
        }

        return query.trim();
    }

    /**
     * Checks if the template image URL is a valid image URL and if not checks if it's
     * available in the passed in icon set.
     *
     * @param image - Input image.
     *
     * @returns Predefined image if available. If not, return input parameter.
     */
    public static resolveTemplateImage(image: string | any, icons: Record<string, any>): string | any {
        if (image) {
            if (typeof image !== "string") {
                return image;
            }

            if ((URLUtils.isHttpsUrl(image) || URLUtils.isHttpUrl(image)) && ImageUtils.isValidImageExtension(image)) {
                return image;
            }

            if (URLUtils.isDataUrl(image)) {
                return image;
            }

            if (!icons) {
                return image;
            }
        }

        const match: string = Object.keys(icons).find((key: string) => key.toString() === image);

        return match ? icons[match] : icons["default"] ?? image;
    }

    public static hideLogoInputFieldInIdPGeneralSettingsForm(templateId: string): boolean {
        // show if the idp is enterprise idp, otherwise don't
        const allowedTemplates: string[] = [
            CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.OIDC,
            CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.SAML
        ];

        return !allowedTemplates.includes(templateId);
    }

    public static isTabEnabledForConnection(templateType: string, tabType: ConnectionTabTypes): boolean | undefined {
        const templateMapping: Map<string, Set<string>> = new Map<string, Set<string>>([
            [
                ConnectionTabTypes.USER_ATTRIBUTES,
                new Set([
                    CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.FACEBOOK,
                    CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.GOOGLE,
                    CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.GITHUB,
                    CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.OIDC,
                    CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.MICROSOFT,
                    CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.HYPR,
                    CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.APPLE,
                    CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.SWE
                ])
            ]
        ]);

        if (templateMapping.get(tabType)?.has(templateType)) {
            return false;
        }

        return undefined;
    }

    /**
     * Util to resolve connection resource path.
     *
     * @param externalURL - External resource location URL
     * @param path - Resource path.
     * @returns
     */
    public static resolveConnectionResourcePath(externalURL: string, path: string): string {
        if (typeof path !== "string") {
            return path;
        }

        if (URLUtils.isHttpsOrHttpUrl(path) && ImageUtils.isValidImageExtension(path)) {
            return path;
        }

        if (URLUtils.isDataUrl(path)) {
            return path;
        }

        if (!isEmpty(externalURL)) {
            // If the connection resource url is set, append the given path to it.
            return externalURL + "/" + path;
        }

        if (AppConstants.getClientOrigin()) {
            const basename: string = AppConstants.getAppBasename() ? `/${AppConstants.getAppBasename()}` : "";

            if (path?.includes(AppConstants.getClientOrigin())) {
                return path;
            }

            return AppConstants.getClientOrigin() + basename + "/resources/connections/" + path;
        }
    }

    /**
     * Util to resolve the resource path relative to assets folder.
     *
     * @param path - Resource path.
     * @returns - Relative path.
     */
    public static resolveConnectionRelativePath(path: string): string {
        const assetsFolder: string = "assets";
        const index: number = path.indexOf(assetsFolder);

        if (index === -1) {
            return path;
        }

        return path.slice(index);
    }

    /**
     * Util to resolve connection doc links.
     */
    public static resolveConnectionDocLink(id: string): string {
        return ConnectionUIConstants.DOC_LINK_DICTIONARY.get(id);
    }

    /**
     * Utility function to search for the existence of a given identity provider name.
     *
     * @param idpName - New identity provider name.
     * @returns A Promise resolving to true/false indicating the identity provider
     * name already exist (true) or not (false).
     * @throws IdentityAppsApiException.
     */
    public static searchIdentityProviderName(idpName: string): Promise<boolean> {
        return getConnections(null, null, `name eq ${idpName}`, null)
            .then((idps: ConnectionListResponseInterface) => {
                if (idps?.identityProviders?.length > 0) {
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            })
            .catch((error: IdentityAppsApiException) => {
                throw error;
            });
    }
}

export const resolveConnectionName = (name: string): string => {
    if (name === "Enterprise") {
        return "Standard-Based IdP";
    } else if (name === "Expert Mode") {
        return "Custom Connector";
    } else {
        return name;
    }
};

/**
 * This method resolves the custom authenticator display name.
 *
 * This method is necessary since the display name is stored in two different properties in custom federated
 * authenticators and custom local authenticators.
 *
 * @param authenticator - Authenticator object.
 * @param isCustomLocalAuthenticator - Whether the authenticator is a custom local authenticator.
 * @returns - Resolved display name.x
 */
export const resolveCustomAuthenticatorDisplayName = (
    authenticator: ConnectionInterface | CustomAuthConnectionInterface,
    isCustomLocalAuthenticator: boolean
): string => {
    if (isCustomLocalAuthenticator) {
        return (authenticator as CustomAuthConnectionInterface)?.displayName;
    } else {
        return (authenticator as ConnectionInterface)?.name;
    }
};

export const getIdPCapabilityIcons = (): any => {
    return {
        [SupportedServices.AUTHENTICATION]: ConnectionIcon,
        [SupportedServices.PROVISIONING]: ProvisionIcon
    };
};

/**
 * Utility function to handle the error alert of the outbound provisioning connector metadata request.
 */
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
                    "authenticationProvider:notifications.getOutboundProvisioningConnectorMetadata.error.message"
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

/**
 * Utility function to handle the error alert of the connection deletion request.
 */
export const handleConnectionDeleteError = (error: AxiosError): void => {
    if (
        error.response &&
        error.response.data &&
        error.response.data.code &&
        error.response.data.code ===
            CommonAuthenticatorConstants.ERROR_CODES.CANNOT_DELETE_IDP_DUE_TO_ASSOCIATIONS_ERROR_CODE
    ) {
        store.dispatch(
            addAlert({
                description: "Cannot delete the identity provider as it's been used in applications.",
                level: AlertLevels.ERROR,
                message: "Cannot delete the IDP."
            })
        );

        return;
    } else if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t("authenticationProvider:notifications.deleteIDP.error.description", {
                    description: error.response.data.description
                }),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications.deleteIDP.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t("authenticationProvider:notifications.deleteIDP.genericError.description"),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("authenticationProvider:notifications.deleteIDP.genericError.message")
        })
    );
};

/**
 * Utility function to handle the error alert of the get connection list request.
 */
export const handleGetConnectionsError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t("authenticationProvider:notifications.getIDPList.error.message", {
                    description: error.response.data.description
                }),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications.getIDPList.error.message")
            })
        );

        return;
    }
    store.dispatch(
        addAlert({
            description: I18n.instance.t("authenticationProvider:notifications.getIDPList.genericError.description"),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("authenticationProvider:notifications.getIDPList.genericError.message")
        })
    );

    return;
};

/**
 * Utility function to handle the error alert of the get custom authenticator request.
 */
export const handleGetCustomAuthenticatorError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "customAuthentication:notifications.getCustomAuthenticator.error.description",
                    {
                        description: error?.response?.data?.description
                    }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("customAuthentication:notifications.getCustomAuthenticator.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "customAuthentication:notifications.getCustomAuthenticator.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("customAuthentication:notifications.getCustomAuthenticator.genericError.message")
        })
    );
};

/**
 * Utility function to handle the error alert of the get connection templates list request.
 */
export const handleGetConnectionTemplateListError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.getIDPTemplateList.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications.getIDPTemplateList.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getIDPTemplateList.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("authenticationProvider:notifications.getIDPTemplateList.genericError.message")
        })
    );
};

/**
 * Utility function to handle the error alert of the connection role mappings update request.
 */
export const handleUpdateConnectionRoleMappingsError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.updateIDPRoleMappings.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications.updateIDPRoleMappings.error.message")
            })
        );
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.updateIDPRoleMappings.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.updateIDPRoleMappings.genericError.message"
            )
        })
    );
};

/**
 * Utility function to handle the error alert of the get connection template list request.
 */
export const handleGetConnectionTemplateRequestError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t("authenticationProvider:notifications.getIDPTemplate.error.description", {
                    description: error.response.data.description
                }),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications.getIDPTemplate.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getIDPTemplate.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("authenticationProvider:notifications.getIDPTemplate.genericError.message")
        })
    );
};

/**
 * Utility function to handle the error alert of the outbound provining connector update request.
 */
export const handleUpdateOutboundProvisioningConnectorError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.updateOutboundProvisioningConnector.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.updateOutboundProvisioningConnector.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.updateOutboundProvisioningConnector.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.updateOutboundProvisioningConnector.genericError.message"
            )
        })
    );
};

/**
 * Utility function to handle the error alert of the get connection list request.
 */
export const handleGetConnectionListCallError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t("authenticationProvider:notifications.getIDPList.error.message", {
                    description: error.response.data.description
                }),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications.getIDPList.error.message")
            })
        );

        return;
    }
    store.dispatch(
        addAlert({
            description: I18n.instance.t("authenticationProvider:notifications.getIDPList.genericError.description"),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("authenticationProvider:notifications.getIDPList.genericError.message")
        })
    );

    return;
};

/**
 * Utility function to handle the error alert of the connection update request.
 */
export const handleConnectionUpdateError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t("authenticationProvider:notifications.updateIDP.error.description", {
                    description: error.response.data.description
                }),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications.updateIDP.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t("authenticationProvider:notifications.updateIDP.genericError.description"),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("authenticationProvider:notifications.updateIDP.genericError.message")
        })
    );
};

/**
 * Utility function to handle the error alert of the custom authenticator update request.
 */
export const handleCustomAuthenticatorUpdateError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "customAuthentication:notifications.updateCustomAuthenticator.error.description",
                    { description: error?.response?.data?.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("customAuthentication:notifications.updateCustomAuthenticator.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "customAuthentication:notifications.updateCustomAuthenticator.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "customAuthentication:notifications.updateCustomAuthenticator.genericError.message"
            )
        })
    );
};

/**
 * Utility function to handle the error alert of the federated authenticator meta data GET request.
 */
export const handleGetFederatedAuthenticatorMetadataAPICallError = (error: IdentityAppsApiException): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.getFederatedAuthenticatorMetadata.error.description",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.getFederatedAuthenticatorMetadata.error.message"
                )
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications" +
                    ".getFederatedAuthenticatorMetadata." +
                    "genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.getFederatedAuthenticatorMetadata.genericError.message"
            )
        })
    );
};

/**
 * Utility function to handle the error alert of the connection meta data GET request.
 */
export const handleGetConnectionsMetaDataError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.getConnectionMetaDetails.error.message",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t(
                    "authenticationProvider:notifications.getConnectionMetaDetails.error.message"
                )
            })
        );

        return;
    }
    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getConnectionMetaDetails.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.getConnectionMetaDetails.genericError.message"
            )
        })
    );

    return;
};

/**
 * Utility function to handle the error alert of the authenticator tags GET request.
 */
export const handleGetAuthenticatorTagsError = (error: AxiosError): void => {
    if (error?.response?.data?.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.getAuthenticatorTags.error.message",
                    { description: error.response.data.description }
                ),
                level: AlertLevels.ERROR,
                message: I18n.instance.t("authenticationProvider:notifications.getAuthenticatorTags.error.message")
            })
        );

        return;
    }
    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:.notifications.getAuthenticatorTags.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.getAuthenticatorTags.genericError.message"
            )
        })
    );

    return;
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
                message: I18n.instance.t("authenticationProvider:notifications.getRolesList.error.message")
            })
        );

        return;
    }

    store.dispatch(
        addAlert({
            description: I18n.instance.t(
                "authenticationProvider:notifications.getRolesList.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t("authenticationProvider:notifications.getRolesList.genericError.message")
        })
    );
};

export const handleUpdateIDPRoleMappingsError = (error: AxiosError): void => {
    if (error.response && error.response.data && error.response.data.description) {
        store.dispatch(
            addAlert({
                description: I18n.instance.t(
                    "authenticationProvider:notifications.updateIDPRoleMappings.error.description",
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
                "authenticationProvider:notifications.updateIDPRoleMappings.genericError.description"
            ),
            level: AlertLevels.ERROR,
            message: I18n.instance.t(
                "authenticationProvider:notifications.updateIDPRoleMappings.genericError.message"
            )
        })
    );
};
