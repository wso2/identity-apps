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
import {
    Code,
    DocumentationLink,
    EmphasizedSegment,
    GenericIcon,
    Heading,
    Popup,
    PrimaryButton,
    ResourceTab,
    ResourceTabPaneInterface,
    Text
} from "@wso2is/react-components";
import React, { ElementType, ReactElement } from "react";
import { Trans } from "react-i18next";
import { Dispatch } from "redux";
import { Divider, Icon, Message } from "semantic-ui-react";
import { ApplicationGeneralTabOverride } from "./components/application-general-tab-overide";
import { MarketingConsentModalWrapper } from "./components/marketing-consent/components";
import { ApplicationConfig, ExtendedFeatureConfigInterface } from "./models";
import {
    ExtendedClaimInterface,
    ExtendedExternalClaimInterface,
    SelectedDialectInterface
} from "../../features/applications/components/settings";
import { ApplicationManagementConstants } from "../../features/applications/constants";
import CustomApplicationTemplate from 
    "../../features/applications/data/application-templates/templates/custom-application/custom-application.json";
import {
    ApplicationInterface,
    ApplicationTabTypes,
    ApplicationTemplateIdTypes,
    ApplicationTemplateListItemInterface,
    SupportedAuthProtocolTypes,
    additionalSpProperty
} from "../../features/applications/models";
import { ClaimManagementConstants } from "../../features/claims/constants/claim-management-constants";
import { EventPublisher, FeatureConfigInterface } from "../../features/core";
import { AppConstants } from "../../features/core/constants";
import {
    IdentityProviderManagementConstants
} from "../../features/identity-providers/constants/identity-provider-management-constants";
import MobileAppTemplate from "../application-templates/templates/mobile-application/mobile-application.json";
import OIDCWebAppTemplate from "../application-templates/templates/oidc-web-application/oidc-web-application.json";
import SinglePageAppTemplate from 
    "../application-templates/templates/single-page-application/single-page-application.json";
import { ApplicationRolesConstants } from "../components/application/constants/application-roles";
import { getTryItClientId } from "../components/application/utils/try-it-utils";
import APIAuthorizationTab from "../components/component-extensions/application/api-authorization-tab";
import ApplicationRolesTab from "../components/component-extensions/application/application-roles-tab";
import QuickStartTab from "../components/component-extensions/application/quick-start-tab";
import { getGettingStartedCardIllustrations } from "../components/getting-started/configs";
import { UsersConstants } from "../components/users/constants";

function isClaimInterface(
    claim: ExtendedClaimInterface | ExtendedExternalClaimInterface
): claim is ExtendedClaimInterface {
    if ((claim as ExtendedExternalClaimInterface).mappedLocalClaimURI == undefined) {
        return true;
    }

    return false;
}

const IS_ENTERPRISELOGIN_MANAGEMENT_APP: string = "isEnterpriseLoginManagementApp";
const WSO2_LOGIN_FOR_TEXT: string = "WSO2_LOGIN_FOR_";

// Relative tab indexes.
const QUICK_START_INDEX: number = 0;
const API_AUTHORIZATION_INDEX: number = 4;
const APPLICATION_ROLES_INDEX: number = 4;

/**
 * Check whether claims is  identity claims or not.
 *
 * @param claim - claim
 * @returns boolean
 */
const isIdentityClaim = (claim: ExtendedClaimInterface | ExtendedExternalClaimInterface): boolean => {
    const identityRegex: RegExp = new RegExp("wso2.org/claims/identity");

    if (isClaimInterface(claim)) {
        return identityRegex.test(claim.claimURI);
    }

    return identityRegex.test(claim.mappedLocalClaimURI);
};

/**
 * Check whether the application is a Choreo application or not.
 *
 * @param application - application.
 * @returns true if the application is a Choreo application.
 */
const isChoreoApplication = (application: ApplicationInterface): boolean => {
    // Check whether `isChoreoApp` SP property is available.
    const additionalSpProperties: additionalSpProperty[] = 
        application?.advancedConfigurations?.additionalSpProperties;

    const choreoSpProperty: additionalSpProperty = additionalSpProperties?.find(
        (spProperty: additionalSpProperty) => 
            spProperty.name === ApplicationRolesConstants.IS_CHOREO_APP_SP_PROPERTY 
            && spProperty.value === "true"
    );

    // Check whether the application is a choreo app using choreo app template ID or `isChoreoApp` SP property.
    return application?.templateId === ApplicationRolesConstants.CHOREO_APP_TEMPLATE_ID
        || choreoSpProperty?.name === ApplicationRolesConstants.IS_CHOREO_APP_SP_PROPERTY;
};

/**
 * Check whether the application is a Management application or not.
 * 
 * @param application - application.
 * @returns true if the application is a Management application.
 */
const isEnterpriseLoginManagemenetApplication = (application: ApplicationInterface): boolean => {
    let isEnterpriseLoginMgt: string;

    if (application?.advancedConfigurations?.additionalSpProperties?.length > 0) {
        application?.advancedConfigurations?.additionalSpProperties?.
            forEach((item: additionalSpProperty) => {
                if (item.name === IS_ENTERPRISELOGIN_MANAGEMENT_APP && item.value === "true") {
                    isEnterpriseLoginMgt = "true";
                }
            });
    }

    return application.name.startsWith(WSO2_LOGIN_FOR_TEXT) || isEnterpriseLoginMgt === "true";
};

/**
 * Check whether the application is the TryIt application or not.
 * 
 * @param application - application.
 * @returns true if the application is the TryIt application.
 */
const isTryItApplication = (applicaiton: ApplicationInterface , tenantDomain: string): boolean => 
    applicaiton?.clientId === getTryItClientId(tenantDomain);

export const applicationConfig: ApplicationConfig = {
    advancedConfigurations: {
        showEnableAuthorization: false,
        showMyAccount: true,
        showReturnAuthenticatedIdPs: false,
        showSaaS: false
    },
    attributeSettings: {
        advancedAttributeSettings: {
            showIncludeTenantDomain: false,
            showIncludeUserstoreDomainRole: false,
            showIncludeUserstoreDomainSubject: false,
            showRoleAttribute: false,
            showRoleMapping: false,
            showSubjectAttribute: false,
            showUseMappedLocalSubject: false
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
        roleMapping: false
    },
    customApplication: {
        allowedProtocolTypes: [ SupportedAuthProtocolTypes.OAUTH2_OIDC, SupportedAuthProtocolTypes.SAML ],
        defaultTabIndex: 1
    },
    editApplication: {
        extendTabs: true,
        getActions: (clientId: string, tenant: string, testId: string) => {

            const asgardeoLoginPlaygroundURL: string = window[ "AppUtils" ]?.getConfig()?.extensions?.asgardeoTryItURL;

            return (
                clientId === getTryItClientId(tenant)
                    ? (
                        <PrimaryButton
                            data-tourid="button"
                            onClick={ (): void => {
                                EventPublisher.getInstance().publish("tryit-try-login", {
                                    "client-id": clientId
                                });
                                window.open(asgardeoLoginPlaygroundURL+"?client_id="+clientId+"&org="+tenant);
                            } }
                            data-testid={ `${ testId }-playground-button` }
                        >
                            Try Login
                            <Icon name="arrow right"/>
                        </PrimaryButton>
                    ): null
            );
        },
        getOveriddenTab: (clientId: string, tabName: ApplicationTabTypes,
            defaultComponent: ReactElement, appName: string, appId: string, tenantDomain: string) => {
            if (clientId === getTryItClientId(tenantDomain) && tabName === ApplicationTabTypes.GENERAL) {
                return (
                    <ApplicationGeneralTabOverride
                        appId={ appId }
                        appName={ appName }
                        clientId={ clientId }
                    ></ApplicationGeneralTabOverride>
                );
            }

            if (clientId === getTryItClientId(tenantDomain) && tabName === ApplicationTabTypes.USER_ATTRIBUTES){
                return (
                    <ResourceTab.Pane controlledSegmentation>
                        <EmphasizedSegment padded="very">
                            <div className="form-container with-max-width">
                                <Heading ellipsis as="h4">User Attributes</Heading>
                                <Heading as="h6" color="grey" compact>
                                User attributes that are allowed to be shared with this application.
                                </Heading>
                                <Divider hidden />
                                <div className="authenticator-dynamic-properties">
                                    <div className="authenticator-dynamic-property">
                                        <div className="authenticator-dynamic-property-name-container">
                                            <GenericIcon
                                                square
                                                inline
                                                transparent
                                                icon={ <Icon name="mail"/> }
                                                size="micro"
                                                className="scope-icon"
                                                spaced="right"
                                                verticalAlign="top"
                                            />
                                            <div>
                                            Email
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="authenticator-dynamic-properties">
                                    <div className="authenticator-dynamic-property">
                                        <div className="authenticator-dynamic-property-name-container">
                                            <GenericIcon
                                                square
                                                inline
                                                transparent
                                                icon={ <Icon name="user"/> }
                                                size="micro"
                                                className="scope-icon"
                                                spaced="right"
                                                verticalAlign="top"
                                            />
                                            <div>
                                            First Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="authenticator-dynamic-properties">
                                    <div className="authenticator-dynamic-property">
                                        <div className="authenticator-dynamic-property-name-container">
                                            <GenericIcon
                                                square
                                                inline
                                                transparent
                                                icon={ <Icon name="user"/> }
                                                size="micro"
                                                className="scope-icon"
                                                spaced="right"
                                                verticalAlign="top"
                                            />
                                            <div>
                                            Last Name
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Message visible>
                                    <Text>
                                        These attributes are pre-configured for the
                                        { " " }<Text inline weight="bold"> Asgardeo Try It</Text> application.
                                    You can configure more attributes when you integrate your applications to Asgardeo.
                                        <DocumentationLink
                                            link={ "develop.applications"+
                                            ".editApplication.oidcApplication.attributes.learnMore" }
                                            isLinkRef={ true }
                                        >
                                            <Trans
                                                i18nKey={ "extensions:common.learnMore" }
                                            >
                                                Learn More
                                            </Trans>
                                        </DocumentationLink>
                                    </Text>
                                </Message>
                                <Divider hidden />
                            </div>
                        </EmphasizedSegment>
                    </ResourceTab.Pane>
                );
            }

            return defaultComponent;
        },
        getOverriddenDescription: (clientId: string, tenantDomain: string, _templateName: string) => {
            if (clientId === getTryItClientId(tenantDomain)){
                return (
                    <div className="ellipsis">
                        <Popup
                            content={ (
                                <Trans
                                    i18nKey=
                                        { "extensions:develop.applications.asgardeoTryit.description" }
                                >
                                    You can try out different login flows of Asgardeo with our Try It app.
                                </Trans>
                            ) }
                            trigger={ (
                                <span>
                                    <Trans
                                        i18nKey=
                                            { "extensions:develop.applications.asgardeoTryit.description" }
                                    >
                                        You can try out different login flows of Asgardeo with our Try It app.
                                    </Trans>
                                </span>
                            ) }
                        />
                    </div>
                );
            }

            return null;
        },
        getOverriddenImage: (clientId: string, tenantDomain: string) => {
            if(clientId === getTryItClientId(tenantDomain)) {
                return (
                    <GenericIcon
                        floated="left"
                        size="tiny"
                        transparent
                        icon={ getGettingStartedCardIllustrations().tryItApplication }
                    />
                );
            }

            return null;
        },
        getStrongAuthenticationFlowTabIndex: (
            clientId: string,
            tenantDomain: string,
            templateId: string,
            customApplicationTemplateId: string
        ): number => {
            if (clientId === getTryItClientId(tenantDomain)) {
                return 2; // For Asgardeo Try It App
            } else if (templateId === customApplicationTemplateId) {
                return 3; // For other apps built on Custom Application Templates
            } else {
                return 4; // Anything else
            }
        },
        getTabExtensions: (
            props: Record<string, unknown>, 
            features: FeatureConfigInterface,
            tenantDomain: string
        ): ResourceTabPaneInterface[] => {
            const { content, ...rest } = props;
            const extendedFeatureConfig: ExtendedFeatureConfigInterface = features as ExtendedFeatureConfigInterface;
            const applicationRolesFeatureEnabled: boolean = extendedFeatureConfig?.applicationRoles?.enabled;
            const apiResourceFeatureEnabled: boolean = extendedFeatureConfig?.apiResources?.enabled;

            const application: ApplicationInterface = props?.application as ApplicationInterface;
            const applicationTemplate: ApplicationTemplateListItemInterface = 
                props?.template as ApplicationTemplateListItemInterface;
            const onApplicationUpdate: () => void = props?.onApplicationUpdate as () => void;

            const tabExtensions: ResourceTabPaneInterface[] = [];

            /**
             * Return empty list for tab extensions in enterprise login management and try it applications.
             */
            if (isEnterpriseLoginManagemenetApplication(application) || isTryItApplication(application, tenantDomain)) {
                return tabExtensions;
            }

            // Enable the quick start tab for supported templates when the quick start content is available.
            if (
                content
                && application?.templateId !== CustomApplicationTemplate.id
                && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_PASSIVE_STS
                && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_SAML
                && application?.templateId !== ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
            ) {
                tabExtensions.push(
                    {
                        componentId: "quick-start",
                        index: QUICK_START_INDEX + tabExtensions.length,
                        menuItem: I18n.instance.t(
                            (applicationTemplate?.templateId === ApplicationTemplateIdTypes.MOBILE_APPLICATION) ?
                                "extensions:develop.applications.quickstart.mobileApp.tabHeading":
                                "console:develop.componentExtensions.component.application.quickStart.title"
                        ),
                        render: () => <QuickStartTab content={ content as ElementType } { ...rest } />
                    }
                );
            }

            const isChoreoApp: boolean = isChoreoApplication(application);

            // Enable the API authorization tab for supported templates when the api resources config is enabled.
            // And disable if the application is a Choreo application or a shared application.
            if (
                apiResourceFeatureEnabled && !application?.advancedConfigurations?.fragment &&
                (
                    application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
                    || application?.templateId === MobileAppTemplate?.id
                    || application?.templateId === OIDCWebAppTemplate?.id
                    || application?.templateId === SinglePageAppTemplate?.id
                )
            ) {
                tabExtensions.push(
                    {
                        componentId: "api-authorization",
                        index: API_AUTHORIZATION_INDEX + tabExtensions.length,
                        menuItem: I18n.instance.t(
                            "extensions:develop.applications.edit.sections.apiAuthorization.title"
                        ),
                        render: () => <APIAuthorizationTab isChoreoApp={ isChoreoApp } />
                    }
                );
            }

            // Enable the roles tab for supported templates when the api resources config is enabled.
            // Otherwise enable the roles tab for choreo applications when the application roles config is enabled.
            if (
                (
                    apiResourceFeatureEnabled &&
                    applicationRolesFeatureEnabled
                    && (!application?.advancedConfigurations?.fragment || window["AppUtils"].getConfig().ui.features?.
                        applicationRoles?.enabled) 
                    && (
                        application?.templateId === ApplicationManagementConstants.CUSTOM_APPLICATION_OIDC
                        || application?.templateId === MobileAppTemplate?.id
                        || application?.templateId === OIDCWebAppTemplate?.id
                        || application?.templateId === SinglePageAppTemplate?.id
                    )
                )
                || (applicationRolesFeatureEnabled && isChoreoApp)
            ) {
                tabExtensions.push(
                    {
                        componentId: "application-roles",
                        index: APPLICATION_ROLES_INDEX + tabExtensions.length,
                        menuItem: I18n.instance.t(
                            "extensions:develop.applications.edit.sections.roles.heading"
                        ),
                        render: () => (
                            <ApplicationRolesTab 
                                application={ application }
                                onUpdate={ onApplicationUpdate }
                            />
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
                                    + UsersConstants.getPaths().get("USERS_PATH"),
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
        showProvisioningSettings: false
    },
    excludeIdentityClaims: true,
    excludeSubjectClaim: true,
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
            "custom-application": [ "urn:ietf:params:oauth:grant-type:device_code" ]
        },
        shouldValidateCertificate: true,
        showBackChannelLogout: false,
        showCertificates: true,
        showClientSecretMessage: false,
        showFrontChannelLogout: false,
        showIdTokenEncryption: true,
        showNativeClientSecretMessage: false,
        showRequestObjectSignatureValidation: false,
        showReturnAuthenticatedIdPList: false,
        showScopeValidators: false
    },
    inboundSAMLForm: {
        artifactBindingAllowed:false,
        showApplicationQualifier: false,
        showAttributeConsumingServiceIndex: false,
        showQueryRequestProfile: false
    },
    marketingConsent: {
        getBannerComponent: (): ReactElement =>
            !window[ "AppUtils" ].getConfig().organizationName && <MarketingConsentModalWrapper />
    },
    signInMethod: {
        authenticatorSelection: {
            customAuthenticatorAdditionValidation: (
                authenticatorID: string,
                stepIndex: number,
                dispatch: Dispatch
            ): boolean => {
                // Prevent FIDO2 from being added as a second factor
                if (
                    [
                        IdentityProviderManagementConstants.FIDO_AUTHENTICATOR,
                        IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID
                    ].includes(authenticatorID)
                    && stepIndex > 0
                ) {
                    dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "console:develop.features.applications.notifications." +
                                "firstFactorAuthenticatorToSecondStep.genericError.description"
                            ),
                            level: AlertLevels.WARNING,
                            message: I18n.instance.t(
                                "console:develop.features.applications.notifications." +
                                "firstFactorAuthenticatorToSecondStep.genericError.message"
                            )
                        })
                    );

                    return false;
                }

                return true;
            },
            messages: {
                secondFactorDisabled: (
                    <Trans
                        i18nKey={
                            "extensions:develop.applications.edit.sections.signInMethod.sections." +
                            "authenticationFlow.sections.stepBased.secondFactorDisabled"
                        }
                    >
                        Second factor authenticators can only be used if <Code>Username & Password
                        </Code>, <Code>Social Login</Code> or <Code>Security Key/Biometrics</Code>
                        is present in a previous step.
                    </Trans>
                ),
                secondFactorDisabledInFirstStep: null
            }
        }
    },
    templates:{
        custom: true,
        mobile: true,
        oidc: true,
        saml: false,
        spa: true,
        windows: false
    }
};
