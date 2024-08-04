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

import { ApplicationBasicInterface } from "@wso2is/admin.applications.v1/models";
import { CertificateConfigInterface } from "@wso2is/admin.connections.v1";
import { GovernanceConnectorInterface } from "@wso2is/admin.server-configurations.v1/models";
import { IdentifiableComponentInterface, LinkInterface, TestableComponentInterface } from "@wso2is/core/models";
import { FunctionComponent, SVGProps } from "react";
import { TemplateContentInterface } from "../data/identity-provider-templates";

/**
 * Available Identity Provider list.
 */
export interface IdentityProviderListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: LinkInterface[];
    identityProviders?: IdentityProviderInterface[];
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
    groups?: IdentityProviderGroupInterface[];
    templateId?: string;
    tags?: string[];
}

export interface IdentityProviderInterface extends StrictIdentityProviderInterface {
    isPrimary?: boolean;
    isFederationHub?: boolean;
    homeRealmIdentifier?: string;
    idpIssuerName?: string;
    alias?: string;
    claims?: IdentityProviderClaimsInterface;
    roles?: IdentityProviderRolesInterface;
    certificate?: CertificateConfigInterface;
    provisioning?: ProvisioningInterface;
    groups?: IdentityProviderGroupInterface[];
    docLink?: string;
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
    docLink?: string;
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
    docLink?: string;
}

/**
 *  Identity provider template list item response interface.
 */
export interface IdentityProviderTemplateListItemInterface extends IdentityProviderTemplateItemInterface {
    services?: string[];
    content?: TemplateContentInterface;
    docLink?: string;
}

/**
 * Enum for the supported authenticator types.
 *
 * @readonly
 */
export enum SupportedAuthenticators {
    NONE = "none",
    APPLE = "AppleOIDCAuthenticator",
    FACEBOOK = "FacebookAuthenticator",
    GOOGLE = "GoogleOIDCAuthenticator",
    TWITTER = "TwitterAuthenticator",
    MICROSOFT= "MicrosoftAuthenticator",
    OIDC = "OpenIDConnectAuthenticator",
    SAML = "SAMLSSOAuthenticator"
}

export interface ProvisioningInterface {
    jit?: JITProvisioningResponseInterface;
    outboundConnectors?: OutboundProvisioningConnectorsInterface;
}

export interface JITProvisioningResponseInterface {
    isEnabled?: boolean;
    scheme?: SupportedJITProvisioningSchemes;
    userstore?: string;
    associateLocalUser?: boolean;
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
 */
export enum SupportedServices {
    AUTHENTICATION = "authentication",
    PROVISIONING = "provisioning"
}

/**
 * Enum for supported identity provider template categories.
 *
 * @readonly
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
export interface IdentityProviderMetaInterface {
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
    /**
     * The list of tags that the authenticator can be categorized under.
     */
    tags?: string[];
}

/**
 * Interface for Multi-factor Authenticators.
 */
export type MultiFactorAuthenticatorInterface = GovernanceConnectorInterface;

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
 * Interface for Identity Provider Group.
 */
export interface IdentityProviderGroupInterface {
    id: string;
    name: string;
}

/**
 * Interface for Identity Provider Initial Values.
 */
export interface IdentityProviderInitialValuesInterface {
    NameIDType: string;
    RequestMethod: string;
    name: string;
}

/**
 * Interface for Identity Provider Form Values.
 */
export interface IdentityProviderFormValuesInterface {
    name?: string;
    issuer?: string;
    alias?: string;
    NameIDType?: string;
    RequestMethod?: string;
    clientId?: string;
    clientSecret?: string;
    authorizationEndpointUrl?: string;
    tokenEndpointUrl?: string;
    jwks_endpoint?: string;
    IdPEntityId?: string;
    SPEntityId?: string;
    SSOUrl?: string;
}

/**
 * Authenticator Categories.
 * @readonly
 */
export enum AuthenticatorCategories {
    ENTERPRISE = "ENTERPRISE",
    LOCAL = "LOCAL",
    SECOND_FACTOR = "SECOND_FACTOR",
    SOCIAL = "SOCIAL",
    RECOVERY = "RECOVERY"
}

/**
 * Enum for the supported auth protocol types.
 *
 * @readonly
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
    ATTRIBUTES = "attributes",
    CONNECTED_APPS = "connected-apps",
    IDENTITY_PROVIDER_GROUPS = "identity-provider-groups",
    OUTBOUND_PROVISIONING = "outbound-provisioning",
    JIT_PROVISIONING = "jit-provisioning",
}

/**
 * Enum for Certificate Types
 */
export enum CertificateType {
    JWKS = "jwks",
    PEM = "pem"
}

/**
 * Enum for Trusted Token Issuer Wizard Steps
 */
export enum TrsutedTokenIssuerWizardStep {
    GENERAL_DETAILS = "GeneralDetails",
    CERTIFICATES = "Certificates"
}

/**
 * Interface for Trusted Token Issuer Wizard Step
 */
export interface  TrustedTokenIssuerWizardStepInterface {
    /**
     * Content of the step.
     */
    content: JSX.Element,
    /**
     * Icon of the step.
     */
    icon: FunctionComponent<SVGProps<SVGSVGElement>>,
    /**
     * Title of the step.
     */
    title: string,
    /**
     * Add API resource wizard steps form type of the step.
     */
    name: TrsutedTokenIssuerWizardStep
}

/**
 * Interface for from values of the connection general details step
 */
export interface GeneralDetailsFormValuesInterface {
    /**
     * Alias of the connection
     */
    alias: string;
    /**
     * Description of the connection
     */
    description: string;
    /**
     * Issuer of the connection
     */
    idpIssuerName: string;
    /**
     * Image URL of the connection
     */
    image: string;
    /**
     * Set is primary connection
     */
    isPrimary: boolean;
    /**
     * Name of the connection
     */
    name: string;
}

/**
 * Interface to capture the certificate details for certificate PATCH request.
 */
export interface CertificatePatchRequestInterface {
    /**
     * The operation to be performed.
     */
    operation: string;
    /**
     * Path of the certificate.
     */
    path: string;
    /**
     * Value of the certificate.
     */
    value: string;
}

/**
 * Interface for FIDO Authenticator Form props.
 */
export interface FIDOAuthenticatorFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * The intended mode of the authenticator form.
     * If the mode is "EDIT", the form will be used in the edit view and will rely on metadata for readonly states, etc.
     * If the mode is "CREATE", the form will be used in the add wizards and will all the fields will be editable.
     */
    mode: AuthenticatorSettingsFormModes;
    /**
     * FIDO Authenticator metadata.
     */
    metadata: CommonAuthenticatorFormMetaInterface;
    /**
     * FIDO Authenticator configured initial values.
     */
    initialValues: CommonAuthenticatorFormInitialValuesInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: CommonAuthenticatorFormInitialValuesInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Flag to trigger form submit externally.
     */
    triggerSubmit: boolean;
    /**
     * Flag to enable/disable form submit button.
     */
    enableSubmitButton: boolean;
    /**
     * Flag to show/hide custom properties.
     * @remarks Not implemented ATM. Do this when needed.
     */
    showCustomProperties: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Form initial values interface.
 */
export interface FIDOAuthenticatorFormInitialValuesInterface {
    /**
     * Allow passkey progressive enrollment.
     */
    FIDO_EnablePasskeyProgressiveEnrollment: boolean;
    /**
     * Allow FIDO usernameless authentication
     */
    FIDO_EnableUsernamelessAuthentication: boolean;
}

/**
 * Form fields interface.
 */
export interface FIDOAuthenticatorFormFieldsInterface {
    /**
     * Allow passkey progressive enrollment field.
     */
    FIDO_EnablePasskeyProgressiveEnrollment: CommonAuthenticatorFormFieldInterface;
    /**
     * Allow FIDO usernameless authentication field.
     */
    FIDO_EnableUsernamelessAuthentication: CommonAuthenticatorFormFieldInterface;
}

/**
 * Interface for FIDO connector configuration properties.
 */
export interface FIDOConnectorConfigsAttributeInterface {
    /**
     * Key of the attribute.
     */
    key: string;
    /**
     * Value of the attribute.
     */
    value: string;
}

/**
 * Interface for FIDO connector configuration.
 */
export interface FIDOConnectorConfigsInterface {
    /**
     * Attributes of the FIDO connector configuration.
     */
    attributes: FIDOConnectorConfigsAttributeInterface[]
}

/**
 * Interface for FIDO configuration.
 */
export interface FIDOConfigsInterface extends FIDOConnectorConfigsInterface{
    /**
     * Fido configuration name.
     */
    name: string;
}

/**
 * Interface for FIDO trusted apps.
 */
export interface FIDOTrustedAppsValuesInterface {
    /**
     * List of FIDO Trusted Android Apps.
     */
    android: FIDOTrustedAppTypeInterface;
    /**
     * List of FIDO Trusted IOS Apps.
     */
    ios: FIDOTrustedAppTypeInterface
}

/**
 * Interface for FIDO trusted app type.
 */
export interface FIDOTrustedAppTypeInterface {
    /**
     * App names with their corresponding SHA values.
     */
    [appName: string]: string[]
}

/**
 * Interface for FIDO trusted apps response.
 */
export interface FIDOTrustedAppsResponseInterface {
    /**
     * List of FIDO Trusted Android Apps.
     */
    android: string[];
    /**
     * List of FIDO Trusted IOS Apps.
     */
    ios: string[]
}

/**
 * Types of FIDO trusted apps.
 */
export enum FIDOTrustedAppTypes {
    ANDROID = "android",
    IOS = "ios"
}

/**
 * FIDO trusted apps list interface.
 */
export interface FIDOTrustedAppsListInterface {
    /**
     * Name of the trusted app.
     */
    appName: string;
    /**
     * Type of the trusted app.
     */
    appType: FIDOTrustedAppTypes;
    /**
     * SHA values associated with the current app.
     */
    shaValues?: string[];
}
