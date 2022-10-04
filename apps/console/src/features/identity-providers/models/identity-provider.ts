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

import { LinkInterface, TestableComponentInterface } from "@wso2is/core/models";
import { ApplicationBasicInterface } from "../../applications/models";
import { GovernanceConnectorInterface } from "../../server-configurations/models";
import { TemplateContentInterface } from "../data/identity-provider-templates";

export interface IdentityProviderTemplateGroupInterface {
    category?: string;
    description?: string;
    id?: string;
    image?: string;
    name?: string;
    subTemplates?: IdentityProviderInterface[];
    subTemplatesSectionTitle?: string;
}

/**
 * Available Identity Provider list.
 */
export interface IdentityProviderListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: LinkInterface[];
    identityProviders?: StrictIdentityProviderInterface[];
}

/**
 * Captures each Identity provider details from the list.
 */
export interface StrictIdentityProviderInterface {
    id?: string;
    name?: string;
    description?: string;
    isEnabled?: boolean;
    image?: string;
    self?: string;
    federatedAuthenticators?: FederatedAuthenticatorListResponseInterface;
    templateId?: string;
}

export interface IdentityProviderInterface extends StrictIdentityProviderInterface {
    isPrimary?: boolean;
    isFederationHub?: boolean;
    homeRealmIdentifier?: string;
    alias?: string;
    claims?: IdentityProviderClaimsInterface;
    roles?: IdentityProviderRolesInterface;
    certificate?: CertificateConfigInterface;
    provisioning?: ProvisioningInterface;
}

export interface IdentityProviderRolesInterface {
    mappings?: IdentityProviderRoleMappingInterface[];
    outboundProvisioningRoles?: string[];
}

export interface IdentityProviderRoleMappingInterface {
    idpRole?: string;
    localRole?: string;
}

export interface IdentityProviderClaimsInterface {
    userIdClaim?: IdentityProviderClaimInterface;
    roleClaim?: IdentityProviderClaimInterface;
    mappings?: IdentityProviderClaimMappingInterface[];
    provisioningClaims?: IdentityProviderProvisioningClaimInterface[];
}

export interface IdentityProviderClaimMappingInterface {
    idpClaim: string;
    localClaim: IdentityProviderClaimInterface;
}

export interface IdentityProviderCommonClaimMappingInterface {
    mappedValue: string;
    claim: IdentityProviderClaimInterface;
}

export interface IdentityProviderProvisioningClaimInterface {
    claim: IdentityProviderClaimInterface;
    defaultValue: string;
}

export interface IdentityProviderClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

export interface IdentityProviderAdvanceInterface {
    isFederationHub?: boolean;
    homeRealmIdentifier?: string;
    alias?: string;
    certificate?: CertificateConfigInterface;
}

export interface CertificateConfigInterface {
    certificates?: string[];
    jwksUri?: string; // TODO  Check for upload option.
}

export interface FederatedAuthenticatorMetaDataInterface {
    authenticatorId: string;
    description: string;
    icon: any;
    name: string;
    displayName: string;
}

export interface FederatedAuthenticatorListItemInterface extends FederatedAuthenticatorInterface {
    self?: string;
}

export interface FederatedAuthenticatorInterface extends CommonPluggableComponentInterface {
    authenticatorId?: string;
    name?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
    /**
     * The list of tags that the authenticator can be categorized under.
     */
    tags?: string[];
}

export interface FederatedAuthenticatorWithMetaInterface {
    id?: string;
    meta?: FederatedAuthenticatorMetaInterface;
    data?: FederatedAuthenticatorInterface;
}

export interface AuthenticatorPropertyInterface {
    key: string;
    value: string;
}

export interface FederatedAuthenticatorListResponseInterface {
    defaultAuthenticatorId?: string;
    authenticators?: FederatedAuthenticatorListItemInterface[];
}

export interface FederatedAuthenticatorMetaInterface extends CommonPluggableComponentMetaInterface {
    authenticatorId?: string;
    name?: string;
    displayName?: string;
}

/**
 * Captures the Identity provider details.
 */
export interface IdentityProviderResponseInterface {
    id?: string;
    name?: string;
    image?: string;
    isEnabled?: string;
    federatedAuthenticators?: FederatedAuthenticatorListResponseInterface;
}

/**
 *  Identity provider template list interface.
 */
export interface IdentityProviderTemplateListInterface {
    templates: IdentityProviderTemplateInterface[];
}

/**
 *  Identity provider template list response interface.
 */
export interface IdentityProviderTemplateListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: number;
    templates?: IdentityProviderTemplateListItemInterface[];
}

/**
 *  Identity provider template item interface. Updated the interface
 *  to support grouped templates. You can see that {@link templateGroup},
 *  {@link subTemplates} and etc., are part of this interface.
 */
export interface IdentityProviderTemplateItemInterface {
    id?: string;
    name?: string;
    description?: string;
    image?: any;
    category?: string;
    displayOrder?: number;
    idp?: IdentityProviderInterface;
    disabled?: boolean;
    provisioning?: ProvisioningInterface;
    /**
     * IDP Type.
     * ex: Social Login, Enterprise etc.
     */
    type?: string;
    templateGroup?: string;
    subTemplates?: IdentityProviderTemplateItemInterface[];
    subTemplatesSectionTitle?: string;
    /**
     * Template identifier.
    */
    templateId?: string;
}

/**
 *  Identity provider template list item interface.
 */
export interface IdentityProviderTemplateInterface extends IdentityProviderTemplateItemInterface {
    services?: SupportedServicesInterface[];
    content?: TemplateContentInterface;
    /**
     * The list of tags that the IDP template can be categorized under.
     */
    tags?: string[];
    /**
     * Should resource be listed as coming soon.
     */
    comingSoon?: boolean;
}

/**
 *  Identity provider template list item response interface.
 */
export interface IdentityProviderTemplateListItemInterface extends IdentityProviderTemplateItemInterface {
    services?: string[];
    content?: TemplateContentInterface;
}

/**
 * Interface for IDP template categories.
 */
export interface IdentityProviderTemplateCategoryInterface {
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
    templates?: IdentityProviderTemplateInterface[];
    /**
     * View configurations.
     */
    viewConfigs?: IdentityProviderTemplateCategoryViewConfigInterface;
}

/**
 * Interface for the IDP templates category view config.
 */
export interface IdentityProviderTemplateCategoryViewConfigInterface {
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
         * Where to find the tags in the templates object.
         */
        tagsKey: string;
    };
}

/**
 * Enum for IDP template loading strategies.
 *
 * @readonly
 * enum string
 */
export enum IdentityProviderTemplateLoadingStrategies {
    /**
     * App will resort to in-app templates.
     * @typeParam LOCAL - string
     */
    LOCAL = "LOCAL",
    /**
     * App will fetch templates from the template management REST API.
     * @typeParam REMOTE - string
     */
    REMOTE = "REMOTE"
}

/**
 * Enum for the supported quick start template types.
 *
 * @readonly
 * enum string
 */
export enum SupportedQuickStartTemplateTypes {
    GOOGLE = "Google"
}

/**
 * Enum for the supported authenticator types.
 *
 * @readonly
 * enum string
 */
export enum SupportedAuthenticators {
    NONE = "none",
    FACEBOOK = "FacebookAuthenticator",
    GOOGLE = "GoogleOIDCAuthenticator",
    TWITTER = "TwitterAuthenticator",
    OIDC = "OpenIDConnectAuthenticator",
    SAML = "SAMLSSOAuthenticator"
}

/**
 * Enum for the supported provisioning connector types.
 *
 * @readonly
 * enum string
 */
export enum SupportedProvisioningConnectors {
    NONE = "none",
    GOOGLE = "google"
}

/**
 *  Provisioning list response interface.
 */
export interface ProvisioningResponseInterface {
    jit?: JITProvisioningResponseInterface;
    outboundConnectors?: OutboundProvisioningConnectorsListResponseInterface;
}

export interface ProvisioningInterface {
    jit?: JITProvisioningResponseInterface;
    outboundConnectors?: OutboundProvisioningConnectorsInterface;
}

export interface JITProvisioningResponseInterface {
    isEnabled?: boolean;
    scheme?: SupportedJITProvisioningSchemes;
    userstore?: string;
}

export enum SupportedJITProvisioningSchemes {
    PROVISION_SILENTLY = "PROVISION_SILENTLY",
    PROMPT_CONSENT = "PROMPT_CONSENT",
    PROMPT_PASSWORD_CONSENT = "PROMPT_PASSWORD_CONSENT",
    PROMPT_USERNAME_PASSWORD_CONSENT = "PROMPT_USERNAME_PASSWORD_CONSENT"
}

export interface OutboundProvisioningConnectorsInterface {
    defaultConnectorId?: string;
    connectors?: OutboundProvisioningConnectorInterface[];
}

export interface OutboundProvisioningConnectorsListResponseInterface {
    defaultConnectorId?: string;
    connectors?: OutboundProvisioningConnectorListItemInterface[];
}

export interface OutboundProvisioningConnectorListItemInterface {
    connectorId?: string;
    name?: string;
    isEnabled?: boolean;
    self?: string;
}

export interface OutboundProvisioningConnectorInterface extends CommonPluggableComponentInterface {
    name?: string;
    connectorId?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
    blockingEnabled?: boolean;
    rulesEnabled?: boolean;
}

export interface OutboundProvisioningConnectorMetaInterface extends CommonPluggableComponentMetaInterface {
    connectorId?: string;
    name?: string;
    displayName?: string;
    blockingEnabled?: boolean;
    rulesEnabled?: boolean;
}

export interface OutboundProvisioningConnectorWithMetaInterface {
    id?: string;
    meta?: FederatedAuthenticatorMetaInterface;
    data?: FederatedAuthenticatorInterface;
}

export interface CommonPluggableComponentFormPropsInterface extends TestableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    metadata?: CommonPluggableComponentMetaInterface;
    initialValues: CommonPluggableComponentInterface;
    onSubmit: (values: CommonPluggableComponentInterface) => void;
    triggerSubmit?: boolean;
    enableSubmitButton?: boolean;
    showCustomProperties?: boolean;
    readOnly?: boolean;
    isSubmitting?: boolean;
}

export interface CommonPluggableComponentInterface {
    properties?: CommonPluggableComponentPropertyInterface[];
}

export interface CommonPluggableComponentMetaInterface {
    properties?: CommonPluggableComponentMetaPropertyInterface[];
}

export interface CommonPluggableComponentPropertyInterface {
    key?: string;
    name?: string;
    value?: string;
}

/**
 * Interface for Authenticator Form metadata.
 * @remarks Use this interface in manually defined Authenticator to resolve form meta.
 */
export type CommonAuthenticatorFormMetaInterface = CommonPluggableComponentMetaInterface;

/**
 * Interface for Authenticator Form initial values..
 * @remarks Use this interface in manually defined Authenticator to resolve form initial values.
 */
export type CommonAuthenticatorFormInitialValuesInterface = CommonPluggableComponentInterface;

/**
 * Interface for Authenticator Form property interface.
 * @remarks Use this interface in manually defined Authenticator to resolve form property.
 */
export type CommonAuthenticatorFormPropertyInterface = CommonPluggableComponentPropertyInterface;

/**
 * Interface for Authenticator Form fields.
 * @remarks Use this interface in manually defined Authenticator to resolve form field data and meta.
 */
export interface CommonAuthenticatorFormFieldInterface extends CommonAuthenticatorFormPropertyInterface {
    meta: CommonPluggableComponentMetaPropertyInterface;
}

/**
 * Interface for Authenticator Form field meta.
 * @remarks Use this interface in manually defined Authenticator to resolve form field meta.
 */
export type CommonAuthenticatorFormFieldMetaInterface = CommonPluggableComponentMetaPropertyInterface;

export interface CommonPluggableComponentMetaPropertyInterface {
    key?: string;
    displayName?: string;
    description?: string;
    type?: string;
    displayOrder?: number;
    regex?: string;
    isMandatory?: boolean;
    isConfidential?: boolean;
    options?: string[];
    defaultValue?: string;
    maxLength?: number;
    isDisabled?: boolean;
    readOnly?: boolean;
    properties?: any;
    subProperties?: CommonPluggableComponentMetaPropertyInterface[];
}

export enum AuthenticatorSettingsFormModes {
    CREATE = "CREATE",
    EDIT = "EDIT"
}

/**
 * Identity provider supported services interface.
 */
export interface SupportedServicesInterface {
    name: string;
    displayName: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    logo: any;
}

/**
 * Enum for supported services.
 *
 * @readonly
 * enum string
 */
export enum SupportedServices {
    AUTHENTICATION = "authentication",
    PROVISIONING = "provisioning"
}

/**
 * Enum for supported identity provider template categories.
 *
 * @readonly
 * enum string
 */
export enum SupportedIdentityProviderTemplateCategories {
    QUICK_START = "quick_start"
}

/**
 * Interface for the identity provider reducer state. With {@link groupedTemplates}
 * we add support for grouped templates for identity providers.
 */
export interface IdentityProviderReducerStateInterface {
    templates: IdentityProviderTemplateItemInterface[];
    groupedTemplates: IdentityProviderTemplateItemInterface[];
    meta: IdentityProviderMetaInterface;
}

/**
 * Interface for the identity provider meta for the redux store.
 */
interface IdentityProviderMetaInterface {
    authenticators: FederatedAuthenticatorListItemInterface[];
}

/**
 * Interface for Local authenticator list response mapping.
 */
export interface LocalAuthenticatorInterface extends CommonPluggableComponentInterface {
    /**
     * ID of the local authenticator.
     */
    id: string;
    /**
     * Name of the local authenticator.
     */
    name: string;
    /**
     * Display name of the local authenticator.
     */
    displayName?: string;
    /**
     * Is authenticator enabled.
     */
    isEnabled?: boolean;
    /**
     * Authenticator Type.
     * @example [ LOCAL, REQUEST_PATH ]
     */
    type?:  string;
    /**
     * Details endpoint.
     */
    self?: string;
}

/**
 * Interface for Multi-factor Authenticators.
 */
export type MultiFactorAuthenticatorInterface = GovernanceConnectorInterface;

/**
 * Interface to map response list item from Authenticators API.
 */
export interface AuthenticatorInterface {

    /**
     * Authenticator ID.
     * @example QmFzaWNBdXRoZW50aWNhdG9y
     */
    id: string;
    /**
     * Authenticator Name.
     * @example BasicAuthenticator
     */
    name: string;
    /**
     * Authenticator Description.
     * @example Log in users with WSO2 Identity Server.
     */
    description?: string;
    /**
     * Authenticator Display Name.
     * @example basic
     */
    displayName: string;
    /**
     * Is authenticator enabled.
     * @example true
     */
    isEnabled: boolean;
    /**
     * Authenticator type.
     * @example [ LOCAL, FEDERATED ]
     */
    type: AuthenticatorTypes;
    /**
     * Authenticator Image.
     * @example basic-authenticator-logo-url
     */
    image?: string;
    /**
     * Authenticator meta tags.
     * @example [ "2FA", "MFA" ]
     */
    tags: string[];
    /**
     * Details endpoint.
     * ex: `/t/carbon.super/api/server/v1/configs/authenticators/eDUwOUNlcnRpZmljYXRlQXV0aGVudGljYXRvcg`
     */
    self: string;
}

/**
 * Generic interface for authenticators local/federated.
 */
export interface GenericAuthenticatorInterface extends StrictGenericAuthenticatorInterface {

    /**
     * Group category.
     */
    category?: string;
    /**
     * Displayname of the category.
     */
    categoryDisplayName?: string;
    /**
     * Identity provider name. ex: LOCAL, Facebook etc.
     */
    idp: string;
    /**
     * Description for the authenticator.
     */
    description?: string;
    /**
     * Display name of the authenticator.
     */
    displayName: string;
    /**
     * Is authenticator enabled.
     */
    isEnabled: boolean;
    /**
     * Default authenticator info.
     */
    defaultAuthenticator: FederatedAuthenticatorInterface;
    /**
     * Set of authenticators(federated).
     */
    authenticators: FederatedAuthenticatorInterface[];
    /**
     * The list of tags that the authenticator can be categorized under.
     */
    tags?: string[];
}

/**
 * Interface  for strict attributes for the generic authenticator.
 */
export interface StrictGenericAuthenticatorInterface {
    /**
     * ID of the local authenticator.
     */
    id: string;
    /**
     * Name of the local authenticator.
     */
    name: string;
    /**
     * Image for the authenticator.
     */
    image: any;
}

/**
 * Connected apps response of IDP
 */
export interface ConnectedAppsInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: LinkInterface[];
    connectedApps?: ConnectedAppInterface[];
}

/**
 * Connected app details of IDP
 */
export interface ConnectedAppInterface extends ApplicationBasicInterface{
    appId?: string;
    self?: string;
}

export interface GenericIdentityProviderCreateWizardPropsInterface {
    /**
     * Current wizard step.
     */
    currentStep?: number;
    /**
     * Wizard title.
     */
    title: string;
    /**
     * Wizard close callback.
     */
    onWizardClose: () => void;
    /**
     * Callback to be triggered on successful IDP create.
     */
    onIDPCreate: (id?: string) => void;
    /**
     * Template object.
     */
    template: IdentityProviderTemplateInterface;
    /**
     * Subtile of the wizard.
     */
    subTitle?: string;
}

/**
 * Authenticator Labels.
 * @readonly
 * enum string
 */
export enum AuthenticatorLabels {
    SOCIAL = "Social-Login",
    FIRST_FACTOR = "First Factor",
    SECOND_FACTOR = "2FA",
    MULTI_FACTOR = "MFA",
    OIDC = "OIDC",
    SAML = "SAML",
    PASSWORDLESS = "Passwordless",
    HANDLERS = "Handlers",
    USERNAMELESS = "Usernameless"
}

/**
 * Authenticator Categories.
 * @readonly
 * enum string
 */
export enum AuthenticatorCategories {
    ENTERPRISE = "ENTERPRISE",
    LOCAL = "LOCAL",
    SECOND_FACTOR = "SECOND_FACTOR",
    SOCIAL = "SOCIAL"
}

/**
 * Enum for Authenticator Types.
 * @readonly
 * enum string
 */
export enum AuthenticatorTypes {
    FEDERATED = "FEDERATED",
    LOCAL = "LOCAL"
}

/**
 * Enum for the supported auth protocol types.
 *
 * @readonly
 * enum string
 */
export enum AuthProtocolTypes {
    SAML = "saml",
    OIDC = "oidc",
    WS_FEDERATION = "passive-sts",
    WS_TRUST = "ws-trust",
    CUSTOM= "custom"
}

/**
 * Enum for IdP Tab types
 */
export enum IdentityProviderTabTypes {
    GENERAL = "General",
    SETTINGS ="settings",
    USER_ATTRIBUTES = "user-attributes",
    ADVANCED = "advanced",
}
