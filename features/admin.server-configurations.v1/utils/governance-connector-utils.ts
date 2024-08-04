/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants, store } from "@wso2is/admin.core.v1";
import FeatureStatusLabel from "@wso2is/admin.extensions.v1/components/feature-gate/models/feature-gate";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import camelCase from "lodash-es/camelCase";
import { getConnectorCategories } from "../api";
import { ServerConfigurationsConstants } from "../constants";
import {
    ConnectorPropertyInterface,
    GovernanceCategoryForOrgsInterface, GovernanceConnectorCategoryInterface,
    GovernanceConnectorForOrgsInterface,
    GovernanceConnectorInterface,
    GovernanceConnectorsInterface
} from "../models";
import { SetGovernanceConnectorCategory } from "../store/actions";

/**
 * Utility class for governance connectors.
 */
export class GovernanceConnectorUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Clears the session related information and sign out from the session.
     */
    public static getGovernanceConnectors(): void {
        const connectorCategories: GovernanceConnectorsInterface = {
            categories: []
        };

        getConnectorCategories()
            .then((response: GovernanceConnectorCategoryInterface[]) => {
                response.map((category: GovernanceConnectorCategoryInterface) => {
                    connectorCategories.categories.push({
                        id: category.id,
                        name: category.name
                    });
                });
                store.dispatch(SetGovernanceConnectorCategory(connectorCategories));
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.detail) {
                    store.dispatch(addAlert({
                        description: I18n.instance.t("governanceConnectors:notifications." +
                            "getConnectorCategories.error.description",
                        { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("governanceConnectors:notifications." +
                            "getConfigurations.error.message")
                    }));
                } else {
                    // Generic error message
                    store.dispatch(addAlert({
                        description: I18n.instance.t("governanceConnectors:notifications." +
                            "getConfigurations.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("governanceConnectors:notifications." +
                            "getConfigurations.genericError.message")
                    }));
                }
            });
    }

    public static encodeConnectorPropertyName(name: string): string {
        return name.split(".").join("-");
    }

    public static decodeConnectorPropertyName(name: string): string {
        return name?.split("-").join(".");
    }

    /**
     * Governance connectors and their sub categories that will be visible in a sub organization
     */
    public static readonly SHOW_GOVERNANCE_CONNECTORS_FOR_SUBORGS: GovernanceCategoryForOrgsInterface[] = [
        {
            connectors: [
                {
                    friendlyName: "Account Recovery",
                    id: "YWNjb3VudC1yZWNvdmVyeQ",
                    name: "account-recovery",
                    properties: [
                        "Recovery.Notification.Password.Enable" // Notification based password recovery
                    ]
                }
            ],
            id: "QWNjb3VudCBNYW5hZ2VtZW50",
            name: "Account Management"
        },
        {
            connectors: [
                {
                    friendlyName: "Ask Password",
                    id: "dXNlci1lbWFpbC12ZXJpZmljYXRpb24",
                    name: "user-email-verification",
                    properties: [
                        "EmailVerification.Enable", // Enable user email verification
                        "EmailVerification.LockOnCreation", // Enable account lock on creation
                        "EmailVerification.Notification.InternallyManage", // Manage notifications sending internally
                        "EmailVerification.ExpiryTime", // Email verification code expiry time
                        "EmailVerification.AskPassword.ExpiryTime", // Username recoveryAsk password code expiry time
                        "EmailVerification.AskPassword.PasswordGenerator",
                        // Temporary password generation extension class
                        "_url_listPurposeJITProvisioning" // Manage JIT provisioning purposes
                    ]
                }
            ],
            id: "VXNlciBPbmJvYXJkaW5n",
            name: "User Onboarding"
        }
    ];

    /**
     * Filter governance categories of a connector for a sub organization.
     * @param governanceConnectors - List of categories to evaluate.
     * @param governanceCategoryId - Category id of the governance connector.
     *
     * @returns Filtered categories as a list.
     */
    public static filterGovernanceConnectorCategories
    (governanceCategoryId: string, governanceConnectors: GovernanceConnectorInterface[])
    : GovernanceConnectorInterface[] {
        let showGovernanceConnectors: GovernanceConnectorForOrgsInterface[] = [];

        showGovernanceConnectors  = this.SHOW_GOVERNANCE_CONNECTORS_FOR_SUBORGS
            .filter((category:GovernanceCategoryForOrgsInterface) => category.id === governanceCategoryId)[0]
            .connectors;

        const showGovernanceConnectorsIdOfSuborgs: string[] = [];

        showGovernanceConnectors.forEach((connector: GovernanceConnectorForOrgsInterface) => {
            showGovernanceConnectorsIdOfSuborgs.push(connector.id);
        });

        return governanceConnectors.filter((connector: GovernanceConnectorInterface) => {
            if (showGovernanceConnectorsIdOfSuborgs.includes(connector.id)) {
                const showProperties: string[] = this.getGovernanceConnectorsProperties(showGovernanceConnectors,
                    connector.id);

                connector.properties = connector.properties.filter((property: ConnectorPropertyInterface) => {
                    if (showProperties.includes(property.name)) {
                        return property;
                    }
                });

                return connector;
            }
        });
    }

    public static getPredefinedConnectorCategories(): Array<any> {

        return [
            {
                connectors: [
                    {
                        description: "Configure multiple attributes as the login identifier.",
                        header: "Multi Attribute Login",
                        id: ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID,
                        route: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(":categoryId",
                                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
                            .replace(":connectorId",
                                ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID),
                        testId: "mutli-attribute-login-card"
                    },
                    {
                        description: "Configure alternative login identifier settings.",
                        header: "Alternative Login Identifier",
                        id: ServerConfigurationsConstants.ALTERNATIVE_LOGIN_IDENTIFIER,
                        route: AppConstants.getPaths()
                            .get("ALTERNATIVE_LOGIN_IDENTIFIER_EDIT"),
                        status: FeatureStatusLabel.BETA,
                        testId: "alternative-login-identifier-card"
                    },
                    {
                        description: "Customize username validation rules for your users.",
                        header: "Username Validation",
                        id: ServerConfigurationsConstants.USERNAME_VALIDATION,
                        route: AppConstants.getPaths().get("USERNAME_VALIDATION_EDIT"),
                        testId: "username-validation-card"
                    }
                ],
                displayOrder: 1,
                id: "login-identifier",
                title: "Login Identifier"
            },
            {
                connectors: [
                    {
                        description: "Customize password validation rules for your users.",
                        header: "Password Validation",
                        id: ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID,
                        route: AppConstants.getPaths().get("VALIDATION_CONFIG_EDIT"),
                        testId: "password-validation-card"
                    },
                    {
                        description: "Configure account lock on consecutive failed " +
                            "login attempts.",
                        header: "Login Attempts",
                        id: ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY,
                        route: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(
                                ":categoryId",
                                ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
                            )
                            .replace(
                                ":connectorId",
                                ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID
                            ),
                        testId: "login-attempts-card"
                    },
                    {
                        description: "Enable reCAPTCHA for the organization.",
                        header: "Bot Detection",
                        id: ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID,
                        route: AppConstants.getPaths().get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(
                                ":categoryId",
                                ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
                            )
                            .replace(
                                ":connectorId",
                                ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID
                            ),
                        testId: "bot-detection-card"
                    },
                    {
                        description: "Manage and configure user session settings and preferences.",
                        header: I18n.instance.t("sessionManagement:title"),
                        id: ServerConfigurationsConstants.SESSION_MANAGEMENT_CONNECTOR_ID,
                        route: AppConstants.getPaths().get("SESSION_MANAGEMENT"),
                        testId: "session-management-card"
                    }
                ],
                displayOrder: 1,
                id: "login-security",
                title: "Login Security"
            },
            {
                connectors: [
                    {
                        description: "Enable self registration for users of the organization.",
                        header: "Self Registration",
                        id: ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID,
                        route: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                            .replace(":connectorId", ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID),
                        testId: "self-registration-card"
                    },
                    {
                        description: "Allow users to set their own passwords during admin-initiated onboarding " +
                                    "and configure related settings",
                        header: "Invite User to Set Password",
                        id: ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID,
                        route: AppConstants.getPaths().get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                            .replace(
                                ":connectorId",
                                ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID),
                        testId: "invite-user-to-set-password-card"
                    }
                ],
                displayOrder: 1,
                id: "user-onboarding",
                title: "User Onboarding"
            },
            {
                connectors: [
                    {
                        description: "Enable self-service password recovery for users on the login page.",
                        header: "Password Recovery",
                        id: ServerConfigurationsConstants.PASSWORD_RECOVERY,
                        route: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(":categoryId",
                                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID)
                            .replace(":connectorId",
                                ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID),
                        testId: "password-recovery-card"
                    },
                    {
                        description: "Enable self-service username recovery for users on the login page.",
                        header: "Username Recovery",
                        id: ServerConfigurationsConstants.USERNAME_RECOVERY,
                        route: AppConstants.getPaths()
                            .get("USERNAME_RECOVERY_CONNECTOR_EDIT")
                            .replace(
                                ":type",
                                "username"
                            )
                            .replace(":categoryId",
                                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID)
                            .replace(":connectorId",
                                ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID),
                        testId: "username-recovery-card"
                    },
                    {
                        description: "Enable administrators to initiate password reset process for users.",
                        header: "Admin Initiated Password Reset",
                        id: ServerConfigurationsConstants.ADMIN_FORCED_PASSWORD_RESET,
                        route: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR_EDIT")
                            .replace(":categoryId",
                                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
                            .replace(":connectorId",
                                ServerConfigurationsConstants.ADMIN_FORCED_PASSWORD_RESET),
                        testId: "admin-initiated-password-reset-card"
                    }
                ],
                displayOrder: 1,
                id: "account-recovery",
                title: "Account Recovery"
            },
            {
                connectors: [
                    {
                        description: "Configure settings for SAML2 Web Single Sign-On functionality.",
                        header: I18n.instance.t("saml2Config:title"),
                        id: ServerConfigurationsConstants.SAML2_SSO_CONNECTOR_ID,
                        route: AppConstants.getPaths().get("SAML2_CONFIGURATION"),
                        testId: "saml2-web-sso-card"
                    },
                    {
                        description: "Manage settings for WS-Federation based single sign-on.",
                        header: I18n.instance.t("wsFederationConfig:title"),
                        id: ServerConfigurationsConstants.WS_FEDERATION_CONNECTOR_ID,
                        route: AppConstants.getPaths().get("WSFED_CONFIGURATION"),
                        testId: "ws-federation-sso-card"
                    }
                ],
                displayOrder: 0,
                id: "sso-settings",
                title: "Single Sign-On (SSO) Settings"
            },
            {
                connectors: [
                    {
                        description: I18n.instance.t("pages:emailDomainDiscovery.subTitle"),
                        header: I18n.instance.t("pages:emailDomainDiscovery.title"),
                        id: ServerConfigurationsConstants.EMAIL_DOMAIN_DISCOVERY,
                        route: AppConstants.getPaths().get("ORGANIZATION_DISCOVERY_DOMAINS"),
                        status: FeatureStatusLabel.NEW,
                        testId: "email-domain-discovery-card"
                    },
                    {
                        description: I18n.instance.t("pages:impersonation.subTitle"),
                        header: I18n.instance.t("pages:impersonation.title"),
                        id: ServerConfigurationsConstants.IMPERSONATION,
                        route: AppConstants.getPaths().get("IMPERSONATION"),
                        status: FeatureStatusLabel.NEW,
                        testId: "impersonation-card"
                    }
                ],
                displayOrder: 0,
                id: "organization-settings",
                title: "Organization Settings"
            },
            {
                connectors: [
                    {
                        description: I18n.instance.t(
                            "applications:resident.provisioning.outbound.subHeading"),
                        header: I18n.instance.t(
                            "applications:resident.provisioning.outbound.heading"),
                        id: ServerConfigurationsConstants.OUTBOUND_PROVISIONING_SETTINGS_CONNECTOR_ID,
                        route: AppConstants.getPaths().get("OUTBOUND_PROVISIONING_SETTINGS"),
                        testId: "outbound-provisioning-settings-card"
                    }
                ],
                displayOrder: 0,
                id: ServerConfigurationsConstants.PROVISIONING_SETTINGS_CATEGORY_ID,
                title: "Provisioning Settings"
            }
        ];
    }

    public static resolveFieldLabel(category: string, name: string, displayName: string): string {
        const fieldLabelKey: string = "governanceConnectors:connectorCategories." +
                camelCase(category) + ".connectors." + camelCase(name) +
                ".properties." + camelCase(name) + ".label";

        let fieldLabel: string = displayName;

        if (I18n.instance.exists(fieldLabelKey)) {
            fieldLabel = I18n.instance.t(fieldLabelKey);
        }

        return fieldLabel;
    }

    public static resolveFieldHint(category: string, name: string, description: string): string {
        const fieldHintKey: string = "governanceConnectors:connectorCategories." +
                camelCase(category) + ".connectors." + camelCase(name) +
                ".properties." + camelCase(name) + ".hint";

        let fieldHint: string = description;

        if (I18n.instance.exists(fieldHintKey)) {
            fieldHint = I18n.instance.t(fieldHintKey);
        }

        return fieldHint;
    }

    /**
     * Get governance connector properties for a given connector.
     * @param showGovernanceConnectors - Category id of the governance connector.
     * @param governanceConnectorId - Connector id.
     *
     * @returns governance connector properties as a list.
     */
    private static getGovernanceConnectorsProperties
    (showGovernanceConnectors: GovernanceConnectorForOrgsInterface[], governanceConnectorId: string) {

        return showGovernanceConnectors
            .filter((connector: GovernanceConnectorForOrgsInterface)=>connector.id===governanceConnectorId)[0]
            .properties;

    }
}
