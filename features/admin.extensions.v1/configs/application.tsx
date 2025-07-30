/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { APIAuthorization } from "@wso2is/admin.applications.v1/components/api-authorization/api-authorization";
import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "@wso2is/admin.applications.v1/components/settings/attribute-management/attribute-settings";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import {
    ApplicationInterface,
    ApplicationTabTypes,
    ApplicationTemplateIdTypes,
    additionalSpProperty
} from "@wso2is/admin.applications.v1/models/application";
import { SupportedAuthProtocolTypes } from "@wso2is/admin.applications.v1/models/application-inbound";
import getTryItClientId from "@wso2is/admin.applications.v1/utils/get-try-it-client-id";
import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { ApplicationRoles } from "@wso2is/admin.roles.v2/components/application-roles";
import { I18n } from "@wso2is/i18n";
import {
    Code,
    Heading,
    ResourceTab,
    ResourceTabPaneInterface
} from "@wso2is/react-components";
import React, { ReactElement } from "react";
import { Trans } from "react-i18next";
import { Divider, Icon } from "semantic-ui-react";
import { MarketingConsentModalWrapper } from "./components/marketing-consent/components";
import { ApplicationConfig, ExtendedFeatureConfigInterface } from "./models";
import { ApplicationTabIDs } from "./models/application";
import MobileAppTemplate from "../application-templates/templates/mobile-application/mobile-application.json";
import OIDCWebAppTemplate from "../application-templates/templates/oidc-web-application/oidc-web-application.json";
import SamlWebAppTemplate
    from "../application-templates/templates/saml-web-application/saml-web-application.json";
import SinglePageAppTemplate from
    "../application-templates/templates/single-page-application/single-page-application.json";

function isClaimInterface(
    claim: ExtendedClaimInterface | ExtendedExternalClaimInterface
): claim is ExtendedClaimInterface {
    if ((claim as ExtendedExternalClaimInterface).mappedLocalClaimURI == undefined) {
        return true;
    }

    return false;
}

const IS_ENTERPRISELOGIN_MANAGEMENT_APP: string = "isEnterpriseLoginManagementApp";

// Relative tab indexes.
const API_AUTHORIZATION_INDEX: number = 4;
const APPLICATION_ROLES_INDEX: number = 4;
const M2M_API_AUTHORIZATION_INDEX: number = 2;

const featureConfig: FeatureConfigInterface = window[ "AppUtils" ].getConfig().ui.features;

/**
 * Check whether claims is  identity claims or not.
 *
 * @param claim - claim
 * @returns boolean
 */
const isIdentityClaim = (claim: ExtendedClaimInterface | ExtendedExternalClaimInterface): boolean => {
    const enableIdentityClaims: boolean = window[ "AppUtils" ]?.getConfig()?.ui?.enableIdentityClaims;

    if (enableIdentityClaims) {
        return false;
    }

    const identityRegex: RegExp = new RegExp("wso2.org/claims/identity");

    if (isClaimInterface(claim)) {
        return identityRegex.test(claim.claimURI);
    }

    return identityRegex.test(claim.mappedLocalClaimURI);
};

export const applicationConfig: ApplicationConfig = {
    advancedConfigurations: {
        showEnableAuthorization: true,
        showFapiFeatureStatusChip: false,
        showHybridFlowFeatureStatusChip: false,
        showMtlsAliases: false,
        showMyAccount: true,
        showMyAccountStatus: true,
        showReturnAuthenticatedIdPs: true,
        showSaaS: true,
        showTrustedAppConsentWarning: false
    },
    allowedGrantTypes: {
        // single page app template
        [ "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT
        ],
        // oidc traditional web app template
        [ "b9c5e11e-fc78-484b-9bec-015d247561b8" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT,
            ApplicationManagementConstants.OAUTH2_TOKEN_EXCHANGE
        ],
        // oidc standard app template
        [ "custom-application" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.PASSWORD,
            ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT,
            ApplicationManagementConstants.DEVICE_GRANT,
            ApplicationManagementConstants.OAUTH2_TOKEN_EXCHANGE,
            ApplicationManagementConstants.SAML2_BEARER,
            ApplicationManagementConstants.JWT_BEARER,
            ApplicationManagementConstants.IWA_NTLM
        ],
        [ "m2m-application" ]: [
            ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT
        ],
        [ "mcp-client-application" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT
        ],
        [ "mobile-application" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.PASSWORD,
            ApplicationManagementConstants.DEVICE_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT,
            ApplicationManagementConstants.OAUTH2_TOKEN_EXCHANGE
        ],
        [ "nextjs-application" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.OAUTH2_TOKEN_EXCHANGE,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT
        ],
        [ "react-application" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT
        ],
        [ "sub-organization-application" ]: [
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.PASSWORD,
            ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT
        ]
    },
    attributeSettings: {
        advancedAttributeSettings: {
            isLinkedAccountsEnabled: (templateId: string): boolean => {
                const allowedTemplates: string[] = [
                    ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS,
                    ApplicationManagementConstants.CUSTOM_APPLICATION_SAML,
                    ApplicationManagementConstants.TRADITIONAL_WEB_APPLICATION_SAML,
                    ApplicationManagementConstants.MOBILE,
                    ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC,
                    ApplicationManagementConstants.TRADITIONAL_WEB_APPLICATION_OIDC,
                    ApplicationManagementConstants.SPA_APP_TEMPLATE_ID
                ];

                return allowedTemplates.includes(templateId);
            },
            isMandateLinkedLocalAccountEnabled: (templateId: string): boolean => {
                const allowedTemplates: string[] = [];

                return allowedTemplates.includes(templateId);
            },
            showIncludeTenantDomain: true,
            showIncludeUserstoreDomainRole: true,
            showIncludeUserstoreDomainSubject: true,
            showRoleAttribute: true,
            showRoleMapping: true,
            showSubjectAttribute: true,
            showValidateLinkedLocalAccount: true
        },
        attributeSelection: {
            getClaims: (claims: ExtendedClaimInterface[]): ExtendedClaimInterface[] => {
                return claims.filter((claim: ExtendedClaimInterface) => isIdentityClaim(claim) == false);
            },
            getExternalClaims: (claims: ExtendedExternalClaimInterface[]): ExtendedExternalClaimInterface[] => {
                return claims.filter((claim: ExtendedExternalClaimInterface) => isIdentityClaim(claim) == false);
            },
            showAttributePlaceholderTitle: false,
            showShareAttributesHint: (selectedDialect: SelectedDialectInterface): boolean => {
                return selectedDialect.id === ClaimManagementConstants.ATTRIBUTE_DIALECT_IDS.get("OIDC");
            }
        },
        makeSubjectMandatory: true,
        roleMapping: true
    },
    customApplication: {
        allowedProtocolTypes: [
            SupportedAuthProtocolTypes.OAUTH2_OIDC,
            SupportedAuthProtocolTypes.SAML,
            SupportedAuthProtocolTypes.WS_FEDERATION
        ],
        defaultTabIndex: 1
    },
    editApplication: {
        extendTabs: false,
        getActions: () => null,
        getOverriddenDescription: () => null,
        getOverriddenImage: () => null,
        getOverriddenTab: (
            _clientId: string,
            _tabName: ApplicationTabTypes,
            defaultComponent: ReactElement,
            _application: ApplicationInterface,
            _tenantDomain: string,
            _onUpdate?:(id: string) => void,
            _readOnly?:boolean
        ) => defaultComponent,
        getStrongAuthenticationFlowTabIndex: (
            clientId: string,
            tenantDomain: string
        ): number => {
            if (clientId === getTryItClientId(tenantDomain)) {
                return ApplicationManagementConstants.TRY_IT_SIGNIN_TAB; // For Asgardeo Try It App
            } else {
                return ApplicationManagementConstants.APPLICATION_SIGNIN_TAB; // For other applications
            }
        },
        getTabExtensions: (
            props: Record<string, unknown>,
            features: FeatureConfigInterface,
            isReadOnly: boolean
        ): ResourceTabPaneInterface[] => {
            const extendedFeatureConfig: ExtendedFeatureConfigInterface = features as ExtendedFeatureConfigInterface;
            const apiResourceFeatureEnabled: boolean = extendedFeatureConfig?.apiResources?.enabled;

            const application: ApplicationInterface = props?.application as ApplicationInterface;

            const onApplicationUpdate: () => void = props?.onApplicationUpdate as () => void;

            const tabExtensions: ResourceTabPaneInterface[] = [];

            // Enable the API authorization tab for supported templates when the api resources config is enabled.
            if (
                apiResourceFeatureEnabled && !application?.advancedConfigurations?.fragment &&
                (
                    application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
                    || application?.templateId === MobileAppTemplate?.id
                    || application?.templateId === OIDCWebAppTemplate?.id
                    || application?.templateId === SinglePageAppTemplate?.id
                    || application?.templateId === ApplicationManagementConstants.M2M_APP_TEMPLATE_ID
                )
                && application.name !== ApplicationManagementConstants.MY_ACCOUNT_APP_NAME
            ) {
                tabExtensions.push(
                    {
                        componentId: "api-authorization",
                        "data-tabid": ApplicationTabIDs.API_AUTHORIZATION,
                        index: application?.templateId === ApplicationManagementConstants.M2M_APP_TEMPLATE_ID
                            ? M2M_API_AUTHORIZATION_INDEX + tabExtensions.length
                            : API_AUTHORIZATION_INDEX + tabExtensions.length,
                        menuItem: application?.originalTemplateId === ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION
                            ? I18n.instance.t(
                                "extensions:develop.applications.edit.sections.resourceAuthorization.title"
                            )
                            : I18n.instance.t(
                                "extensions:develop.applications.edit.sections.apiAuthorization.title"
                            ),
                        render: () => (
                            <ResourceTab.Pane controlledSegmentation>
                                <APIAuthorization
                                    templateId={ application?.templateId }
                                    originalTemplateId={ application?.originalTemplateId }
                                    readOnly={ isReadOnly }
                                />
                            </ResourceTab.Pane>
                        )
                    }
                );
            }

            // Enable the roles tab for supported templates when the api resources config is enabled.
            if (apiResourceFeatureEnabled
                && (
                    application?.advancedConfigurations?.fragment ||
                    (application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
                    || application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_SAML
                    || application?.templateId === MobileAppTemplate?.id
                    || application?.templateId === OIDCWebAppTemplate?.id
                    || application?.templateId === SinglePageAppTemplate?.id
                    || application?.templateId === SamlWebAppTemplate?.id)
                )
                && application.name !== ApplicationManagementConstants.MY_ACCOUNT_APP_NAME
            ) {
                tabExtensions.push(
                    {
                        componentId: "application-roles",
                        "data-tabid": ApplicationTabIDs.APPLICATION_ROLES,
                        index: APPLICATION_ROLES_INDEX + tabExtensions.length,
                        menuItem: I18n.instance.t(
                            "extensions:develop.applications.edit.sections.roles.heading"
                        ),
                        render: () => (
                            <ResourceTab.Pane controlledSegmentation>
                                <ApplicationRoles
                                    onUpdate={ onApplicationUpdate }
                                    originalTemplateId={ application?.originalTemplateId }
                                    readOnly={ isReadOnly || application?.advancedConfigurations?.fragment }
                                />
                            </ResourceTab.Pane>
                        )
                    }
                );
            }

            return tabExtensions;
        },
        getTabPanelReadOnlyStatus: (tabPanelName: string, application: ApplicationInterface): boolean => {
            // Restrict modifying configurations for Enterprise IDP Login Applications.
            let isEnterpriseLoginMgt: string;

            if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
                application?.advancedConfigurations?.additionalSpProperties?.
                    forEach((item: additionalSpProperty) => {
                        if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                            isEnterpriseLoginMgt = "true";
                        }
                    });
            }
            if (application.name.startsWith("WSO2_LOGIN_FOR_") || isEnterpriseLoginMgt==="true") {
                return [
                    "APPLICATION_EDIT_GENERAL_SETTINGS",
                    "APPLICATION_EDIT_ACCESS_CONFIG",
                    "APPLICATION_EDIT_PROVISIONING_SETTINGS"
                ].includes(tabPanelName);
            }

            return false;
        },
        isTabEnabledForApp: (clientId: string, tabType: ApplicationTabTypes, tenantDomain: string): boolean => {
            if(clientId === getTryItClientId(tenantDomain)) {
                if(tabType === ApplicationTabTypes.PROVISIONING
                    || tabType === ApplicationTabTypes.INFO
                    || tabType === ApplicationTabTypes.ROLES
                    || tabType === ApplicationTabTypes.PROTOCOL){
                    return false;
                }
            }

            return true;
        },
        renderHelpPanelItems: () => {
            return (
                <>
                    <Divider hidden />
                    <Heading ellipsis as="h5">
                        <strong>
                            Add User
                        </strong>
                    </Heading>
                    <div>
                        <p>
                            You will need a user account to log in to the applications.
                        </p>
                        <p>
                            { " " }
                            Do not have a user account?{ " " }<a
                                onClick={ () => {
                                    window.open(AppConstants.getClientOrigin()
                                    + AppConstants.getPaths().get("USERS"),
                                    "",
                                    "noopener");
                                } }
                                className="external-link link pointing primary"
                            >Create Account <Icon name="external"/></a>
                        </p>
                    </div>
                </>
            );
        },
        showApplicationShare: true,
        showDangerZone: (application: ApplicationInterface): boolean => {
            let isEnterpriseLoginMgt: string;

            if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
                application?.advancedConfigurations?.additionalSpProperties?.
                    forEach((item: additionalSpProperty) => {
                        if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                            isEnterpriseLoginMgt = "true";
                        }
                    });
            }

            // Hide danger zone for Enterprise IDP Login Applications.
            return !(application.name.startsWith("WSO2_LOGIN_FOR_") || isEnterpriseLoginMgt === "true");
        },
        showDeleteButton: (application: ApplicationInterface): boolean => {
            let isEnterpriseLoginMgt: string;

            if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
                application?.advancedConfigurations?.additionalSpProperties?.
                    forEach((item: additionalSpProperty) => {
                        if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                            isEnterpriseLoginMgt = "true";
                        }
                    });
            }

            // Hide delete button for Enterprise IDP Login Applications.
            return !(application.name.startsWith("WSO2_LOGIN_FOR_") || isEnterpriseLoginMgt === "true");
        },
        showProvisioningSettings: true
    },
    excludeSubjectClaim: false,
    generalSettings: {
        getFieldReadOnlyStatus: (application: ApplicationInterface, fieldName: string): boolean => {
            let isEnterpriseLoginMgt: string;

            if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
                application?.advancedConfigurations?.additionalSpProperties?.
                    forEach((item: additionalSpProperty) => {
                        if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                            isEnterpriseLoginMgt = "true";
                        }
                    });
            }

            // Allow access url edit even for Enterprise login given `General section is read-only.
            if (application.name.startsWith("WSO2_LOGIN_FOR_") || isEnterpriseLoginMgt==="true") {

                if (fieldName == "ACCESS_URL") {
                    return false;
                }
            }

            return true;
        }
    },
    hiddenGrantTypes: [ ApplicationManagementConstants.ACCOUNT_SWITCH_GRANT ],
    inboundOIDCForm: {
        disabledGrantTypes: {
            "choreo-apim-application-oidc": [
                "urn:ietf:params:oauth:grant-type:saml2-bearer",
                "asg_api",
                "iwa:ntlm",
                "organization_switch",
                "system_app_grant",
                "account_switch",
                "urn:ietf:params:oauth:grant-type:token-exchange",
                "urn:ietf:params:oauth:grant-type:jwt-bearer"
            ],
            "custom-application": []
        },
        shouldValidateCertificate: true,
        showCertificates: true,
        showClientSecretMessage: false,
        showFrontChannelLogout: false,
        showIdTokenEncryption: true,
        showIdTokenResponseSigningAlgorithm: true,
        showNativeClientSecretMessage: false,
        showRequestObjectConfigurations: true,
        showRequestObjectSignatureValidation: false,
        showReturnAuthenticatedIdPList: false,
        showScopeValidators: false
    },
    inboundSAMLForm: {
        artifactBindingAllowed: true,
        showApplicationQualifier: true,
        showAttributeConsumingServiceIndex: false,
        showQueryRequestProfile: true
    },
    marketingConsent: {
        getBannerComponent: (): ReactElement =>
            !window[ "AppUtils" ].getConfig().organizationName && <MarketingConsentModalWrapper />
    },
    quickstart: {
        oidcWeb: {
            dotNet: {
                readme: "",
                sample: {
                    artifact: "",
                    repository: ""
                }
            },
            tomcatOIDCAgent: {
                catalog: "",
                integrate: {
                    defaultCallbackContext: ""
                },
                readme: "",
                sample: {
                    artifact: "",
                    home: "",
                    repository: "",
                    sigInRedirectURL: ""
                }
            }
        },
        samlWeb: {
            tomcatSAMLAgent: {
                catalog: "",
                readme: "",
                sample: {
                    acsURLSuffix: "",
                    artifact: "",
                    home: "",
                    repository: ""
                }
            }
        },
        spa: {
            javascript: {
                apis: "",
                artifact: "",
                cdn: "",
                npmInstallCommand: "",
                readme: "",
                repository: "",
                samples: {
                    javascript: {
                        artifact: "",
                        repository: ""
                    },
                    react: {
                        artifact: "",
                        repository: ""
                    },
                    root: ""
                }
            },
            react: {
                links: {
                    reactClientConfig: "",
                    routingOptions: "",
                    useContextDocumentation: ""
                },
                npmInstallCommand: "",
                readme: "",
                repository: "",
                samples: {
                    basicUsage: {
                        artifact:"",
                        repository: ""
                    },
                    root: "",
                    routing: {
                        artifact: "",
                        repository: ""
                    }
                }
            }
        }
    },
    signInMethod: {
        authenticatorSelection: {
            messages: {
                secondFactorDisabled: (
                    <Trans
                        i18nKey={
                            "extensions:develop.applications.edit.sections.signInMethod.sections." +
                            "authenticationFlow.sections.stepBased.secondFactorDisabled"
                        }
                    >
                        Second factor authenticators can only be used if <Code>Username & Password
                        </Code>, <Code>Social Login</Code> or <Code>Passkey</Code>
                        is present in a previous step.
                    </Trans>
                ),
                secondFactorDisabledInFirstStep: null
            }
        }
    },
    templates:{
        custom: true,
        customProtocol: true,
        m2m: !featureConfig?.applications?.disabledFeatures?.includes("m2mTemplate"),
        mobile: true,
        oidc: true,
        saml: false,
        spa: true,
        windows: false
    }
};
