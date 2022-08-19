/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the License); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { LinkInterface } from "@wso2is/core/models";
import {
    OIDCDataInterface,
    PassiveStsConfigurationInterface,
    SAML2ConfigurationInterface,
    WSTrustConfigurationInterface
} from "./application-inbound";
import { TemplateContentInterface } from "../data/application-templates";

/**
 *  Captures the basic details in the applications.
 */
export interface ApplicationBasicInterface {
    access?: ApplicationAccessTypes;
    id?: string;
    name: string;
    description?: string;
    accessUrl?: string;
    templateId?: string;
    isManagementApp?: boolean;
    advancedConfigurations?: AdvancedConfigurationsInterface;
}

export enum ApplicationAccessTypes {
    READ = "READ",
    WRITE = "WRITE"
}

/**
 *  Application list item model.
 */
export interface ApplicationListItemInterface extends ApplicationBasicInterface {
    image?: string;
    self?: string;
}

/**
 *  Main application interface.
 */
export interface ApplicationInterface extends ApplicationBasicInterface {
    imageUrl?: string;
    claimConfiguration?: ClaimConfigurationInterface;
    advancedConfigurations?: AdvancedConfigurationsInterface;
    inboundProtocols?: InboundProtocolListItemInterface[];
    authenticationSequence?: AuthenticationSequenceInterface;
    provisioningConfigurations?: ProvisioningConfigurationInterface;
}

/**
 * Interface for the inbound protocol in the application response.
 */
export interface InboundProtocolListItemInterface {
    type: string;
    name?: string;
    self: string;
}

/**
 *  Application Basic details for add wizard.
 */
export interface ApplicationBasicWizard extends ApplicationBasicInterface {
    imageUrl?: string;
    discoverableByEndUsers?: boolean;
}

/**
 *  Captures inbound protocols.
 */
export interface InboundProtocolsInterface {
    oidc?: OIDCDataInterface;
    saml?: SAML2ConfigurationInterface;
    wsTrust?: WSTrustConfigurationInterface;
    passiveSts?: PassiveStsConfigurationInterface;
}

/**
 *  Application interface for Post request.
 */
export interface MainApplicationInterface  extends ApplicationInterface {
    inboundProtocolConfiguration?: InboundProtocolsInterface;
}

/**
 *  Captures application list properties.
 */
export interface ApplicationListInterface {
    /**
     * Number of results that match the listing operation.
     */
    totalResults?: number;
    /**
     * Index of the first element of the page, which will be equal to offset + 1.
     */
    startIndex?: number;
    /**
     * Number of elements in the returned page.
     */
    count?: number;
    /**
     * Set of applications.
     */
    applications?: ApplicationListItemInterface[];
    /**
     * Useful links for pagination.
     */
    links?: LinkInterface[];
}

export interface AppClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

export interface ClaimMappingInterface {
    applicationClaim: string;
    localClaim: AppClaimInterface;
}

export interface SubjectInterface {
    claim: AppClaimInterface[] | string;
    includeUserDomain: boolean;
    includeTenantDomain: boolean;
    useMappedLocalSubject: boolean;
}

export interface RoleInterface {
    claim: AppClaimInterface[] | string;
    includeUserDomain: boolean;
    mappings: AppClaimInterface[] | string[];
}

export interface RoleMappingInterface {
    localRole: string;
    applicationRole: string;
}

export interface RoleConfigInterface {
    mappings: RoleMappingInterface[];
    includeUserDomain: boolean;
    claim: AppClaimInterface;
}

export interface RequestedClaimConfigurationInterface {
    claim: AppClaimInterface;
    mandatory: boolean;
}

export interface SubjectConfigInterface {
    claim?: AppClaimInterface;
    includeUserDomain?: boolean;
    includeTenantDomain?: boolean;
    useMappedLocalSubject?: boolean;
}

/**
 *  Captures main claim features.
 */
export interface ClaimConfigurationInterface {
    dialect: string;
    claimMappings: ClaimMappingInterface[];
    requestedClaims: RequestedClaimConfigurationInterface[];
    subject: SubjectConfigInterface;
    role: RoleConfigInterface;
}

/**
 *  Acceptable certificate types.
 */
export enum CertificateTypeInterface {
    NONE ="None",
    JWKS = "JWKS",
    PEM = "PEM"
}

export interface CertificateInterface {
    value?: string;
    type?: CertificateTypeInterface; // TODO  Check for upload option.
}

/**
 *  Captures application related configuration.
 */
export interface AdvancedConfigurationsInterface {
    saas?: boolean;
    discoverableByEndUsers?: boolean;
    certificate?: CertificateInterface;
    skipLoginConsent?: boolean;
    skipLogoutConsent?: boolean;
    returnAuthenticatedIdpList?: boolean;
    enableAuthorization?: boolean;
    fragment?: boolean;
    additionalSpProperties?: additionalSpProperty[]
}
/**
 * Interface for the additional sp properties.
 */
export interface additionalSpProperty {
    name: string;
    value: string;
    displayName?: string;
}

export enum AuthenticationSequenceType {
    DEFAULT = "DEFAULT",
    USER_DEFINED = "USER_DEFINED"
}

export interface AuthenticatorInterface {
    idp: string;
    authenticator: string;
}

export interface AuthenticationStepInterface {
    id: number;
    options: AuthenticatorInterface[];
}

/**
 * Authentication Sequence model.
 */
export interface AuthenticationSequenceInterface  {
    type?: AuthenticationSequenceType;
    steps?: AuthenticationStepInterface[];
    requestPathAuthenticators?: string[];
    script?: string;
    subjectStepId?: number;
    attributeStepId?: number;
}

/**
 *  Application template list item interface.
 */
export interface ApplicationTemplateListItemInterface {
    id: string;
    name: string;
    description?: string;
    image?: string;
    authenticationProtocol?: string;
    /**
     * Specifies a Management Application
     */
    isManagementApp?: boolean;
    /**
     * Template group.
     * ex: "web-application"
     */
    templateGroup?: string;
    /**
     * Template identifier.
     * ex: "single-page-application"
    */
    templateId?: string;
    types?: any[];
    category?: string;
    displayOrder?: number;
    self?: string;
    /**
     * List of Sub templates.
     * ex: `OIDC Web Application` under `Web Application` template.
     */
    subTemplates?: ApplicationTemplateListItemInterface[];
    /**
     * Title for the sub template selection section inside the wizard.
     */
    subTemplatesSectionTitle?: string;
    previewOnly?: boolean;
}

export interface ApplicationTemplateGroupInterface {
    /**
     * Application template group category.
     */
    category?: string;
    /**
     * Group Description.
     */
    description?: string;
    /**
     * Group id.
     */
    id: string;
    /**
     * Group Image.
     */
    image?: string;
    /**
     * Template group name.
     */
    name: string;
    /**
     * List of Sub templates.
     * ex: `OIDC Web Application` under `Web Application` template.
     */
    subTemplates?: ApplicationTemplateListItemInterface[];
    /**
     * Title for the sub template selection section inside the wizard.
     */
    subTemplatesSectionTitle?: string;
    /**
     * Template group identifier.
     * ex: "traditional-web-application"
    */
    templateId?: string;
}

/**
 * Interface for application template categories.
 */
export interface ApplicationTemplateCategoryInterface {
    /**
     * Category id.
     */
    id: string;
    /**
     * Category Display Name.
     */
    displayName: string;
    /**
     * Category Description.
     */
    description: string;
    /**
     * Templates belonging to the category.
     */
    templates?: ApplicationTemplateInterface[];
    /**
     * View configurations.
     */
    viewConfigs?: ApplicationTemplateCategoryViewConfigInterface;
}

/**
 * Interface for the application templates category view config.
 */
export interface ApplicationTemplateCategoryViewConfigInterface {
    /**
     * Config for the UI tags displayed on templates.
     */
    tags: {
        /**
         * Element to render the tag as.
         */
        as: "icon" | "label" | "default";
        /**
         * Title for the section.
         */
        sectionTitle: string;
        /**
         * Show/Hide the tag icon.
         */
        showTagIcon: boolean;
        /**
         * Show/Hide the tags.
         */
        showTags: boolean;
        /**
         * Tag size.
         */
        tagSize: string;
        /**
         * Where to find the tags in the templates object.
         */
        tagsKey: string;
    };
}

/**
 *  Application template list interface.
 */
export interface ApplicationTemplateListInterface {
    templates: ApplicationTemplateInterface[];
}

/**
 *  Contains Application template data.
 */
export interface ApplicationTemplateInterface extends ApplicationTemplateListItemInterface {
    application?: MainApplicationInterface;
    content?: TemplateContentInterface;
    /**
     * Should resource be listed as coming soon.
     */
    comingSoon?: boolean;
}

/**
 * Enum for supported application template categories.
 *
 * @readonly
 * @enum {string}
 */
export enum SupportedApplicationTemplateCategories {
    QUICK_START = "quick_start"
}

/**
 * Enum for application template categories.
 *
 * @readonly
 * @enum {string}
 */
export enum ApplicationTemplateCategories {
    /**
     * Templates supported by default.
     * ex: Web Application, SPA etc.
     * @type {string}
     */
    DEFAULT = "DEFAULT",
    /**
     * Vendor templates.
     * ex: Zoom, Salesforce etc.
     * @type {string}
     */
    VENDOR = "VENDOR",
}

/**
 * Enum for application template loading strategies.
 *
 * @readonly
 * @enum {string}
 */
export enum ApplicationTemplateLoadingStrategies {
    /**
     * App will resort to in app templates.
     * @type {string}
     */
    LOCAL = "LOCAL",
    /**
     * App will fetch templates from the template management REST API.
     * @type {string}
     */
    REMOTE = "REMOTE"
}

/**
 *  Application template technology interface.
 */
export interface ApplicationTemplateTechnology {
    name: string;
    displayName: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    logo: any;
}

/**
 * Adaptive auth templates interface.
 */
export interface AdaptiveAuthTemplatesListInterface {
    /**
     * Templates as a JSON.
     */
    templatesJSON: AdaptiveAuthTemplateCategoryListItemInterface;
}

/**
 * Adaptive auth template category list item interface.
 * Category name will be the key.
 */
export interface AdaptiveAuthTemplateCategoryListItemInterface {
    [ key: string ]: AdaptiveAuthTemplateCategoryInterface;
}

/**
 * Adaptive auth template category interface.
 */
export interface AdaptiveAuthTemplateCategoryInterface {
    displayName: string;
    templates?: AdaptiveAuthTemplateInterface[];
    icon?: string;
    order: number;
}

/**
 * Adaptive auth template interface.
 */
export interface AdaptiveAuthTemplateInterface {
    summary: string;
    preRequisites: string[];
    helpLink: string;
    code: string[];
    defaultStepsDescription: AdaptiveAuthTemplateDefaultStepsDescriptionInterface;
    parametersDescription: AdaptiveAuthTemplateParametersDescriptionInterface;
    name: string;
    defaultAuthenticators: AdaptiveAuthTemplateDefaultAuthenticatorsListInterface;
    category: string;
    title: string;
    authenticationSteps: number;
}

/**
 * Adaptive auth template parameters description interface.
 */
interface AdaptiveAuthTemplateParametersDescriptionInterface {
    [ key: string ]: string;
}

/**
 * Adaptive auth template default steps description interface.
 */
interface AdaptiveAuthTemplateDefaultStepsDescriptionInterface {
    [ key: string ]: string;
}

/**
 * Adaptive auth template default authenticators list interface.
 */
interface AdaptiveAuthTemplateDefaultAuthenticatorsListInterface {
    [ key: string ]: AdaptiveAuthTemplateDefaultAuthenticatorInterface;
}

/**
 * Adaptive auth template default authenticator interface.
 */
interface AdaptiveAuthTemplateDefaultAuthenticatorInterface {
    federated: string[];
    local: string[];
}

export const emptyApplication = (): ApplicationInterface => ({
    accessUrl: "",
    advancedConfigurations: {
        certificate: {
            type: CertificateTypeInterface.JWKS,
            value: ""
        },
        discoverableByEndUsers: false,
        enableAuthorization: false,
        returnAuthenticatedIdpList: false,
        saas: false,
        skipLoginConsent: false,
        skipLogoutConsent: false
    },
    authenticationSequence: undefined,
    claimConfiguration: undefined,
    description: "",
    id: "",
    imageUrl: "",
    inboundProtocols: undefined,
    name: ""
});

/**
 * Inbound SCIM Provisioning configuration.
 */
export interface InboundSCIMProvisioningConfigurationInterface {
    proxyMode: boolean;
    provisioningUserstoreDomain?: string;
}

/**
 * Outbound Provisioning Configuration.
 */
export interface OutboundProvisioningConfigurationInterface {
    idp: string;
    connector: string;
    blocking?: boolean;
    rules?: boolean;
    jit?: boolean;
}

/**
 * Provisioning configuration for the application.
 */
export interface ProvisioningConfigurationInterface {
    inboundProvisioning?: InboundSCIMProvisioningConfigurationInterface;
    outboundProvisioningIdps?: OutboundProvisioningConfigurationInterface[];
}

/**
 * Captures name and id of the user store.
 */
export interface SimpleUserStoreListItemInterface {
    id?: string;
    name: string;
}

/**
 * Captures name and id of the user store.
 */
export interface SimpleUserStoreListItemInterface {
    id?: string;
    name: string;
}

/**
 * OIDC configurations for the application.
 */
export interface OIDCApplicationConfigurationInterface {
    authorizeEndpoint: string;
    endSessionEndpoint: string;
    introspectionEndpoint: string;
    tokenEndpoint: string;
    tokenRevocationEndpoint: string;
    userEndpoint: string;
    jwksEndpoint: string;
    wellKnownEndpoint: string;
}

/**
 * SAML configurations for the application.
 */
export interface SAMLApplicationConfigurationInterface {
    issuer: string;
    ssoUrl: string;
    sloUrl: string;
    certificate: string;
    metadata: string;
}

export const emptyOIDCAppConfiguration = (): OIDCApplicationConfigurationInterface => ({
    authorizeEndpoint: "",
    endSessionEndpoint: "",
    introspectionEndpoint: "",
    jwksEndpoint: "",
    tokenEndpoint: "",
    tokenRevocationEndpoint: "",
    userEndpoint: "",
    wellKnownEndpoint: ""
});

export const emptySAMLAppConfiguration = (): SAMLApplicationConfigurationInterface => ({
    certificate: "",
    issuer: "",
    metadata: "",
    sloUrl: "",
    ssoUrl: ""
});

/**
 * Enum for adaptive auth template types.
 *
 * @readonly
 * @enum {string}
 */
export enum AdaptiveAuthTemplateTypes {
    GROUP_BASED = "Group-Based",
    IP_BASED = "IP-Based",
    NEW_DEVICE_BASED = "New-Device-Based",
    USER_AGE_BASED = "User-Age-Based"
}

/**
 * Enum for application template types.
 *
 * @readonly
 * @enum {string}
 */
export enum ApplicationTemplateIdTypes {
    SPA = "single-page-application",
    OIDC_WEB_APPLICATION = "oidc-web-application",
    SAML_WEB_APPLICATION = "saml-web-application"
}

/**
 * Enum for default application template group ids.
 *
 * @readonly
 * @enum {string}
 */
export enum DefaultTemplateGroupIds {
    WEB_APPLICATION = "web-application",
    DESKTOP_APPLICATION = "desktop",
    MOBILE_APPLICATION = "mobile"
}

/**
 * Enum for sign-in method login flow options.
 *
 * @readonly
 * @enum {string}
 */
export enum LoginFlowTypes {
    FACEBOOK_LOGIN = "FACEBOOK_LOGIN",
    GOOGLE_LOGIN = "GOOGLE_LOGIN",
    GITHUB_LOGIN = "GITHUB_LOGIN",
    SECOND_FACTOR_TOTP = "SECOND_FACTOR_TOTP",
    SECOND_FACTOR_SMS_OTP = "SECOND_FACTOR_SMS_OTP",
    SECOND_FACTOR_EMAIL_OTP = "SECOND_FACTOR_EMAIL_OTP",
    FIDO_LOGIN = "FIDO_LOGIN",
    MAGIC_LINK = "MAGIC_LINK",
    DEFAULT = "DEFAULT"
}

/**
 * Enum for URL fragment types used in the edit application.
 *
 * @readonly
 * @enum {string}
 */
export enum URLFragmentTypes {
    TAB_INDEX = "tab=",
    VIEW = "view=",
}

/**
 * Enum for customized tab types
 */
export enum ApplicationTabTypes {
    GENERAL = "General",
    PROTOCOL ="protocol",
    USER_ATTRIBUTES = "user-attributes",
    SIGN_IN_METHOD = "sign-in-method",
    PROVISIONING = "provisioning",
    ADVANCED = "advanced",
    INFO = "info"
}
