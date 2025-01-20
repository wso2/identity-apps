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

import { IdentifiableComponentInterface, LinkInterface, TestableComponentInterface } from "@wso2is/core/models";
import { GenericIconProps } from "@wso2is/react-components";
import { ComponentType, LazyExoticComponent, ReactElement } from "react";
import { AuthenticatorSettingsFormModes } from "./authenticators";

export interface ConnectionTemplateGroupInterface {
    category?: string;
    description?: string;
    id?: string;
    image?: string;
    name?: string;
    subTemplates?: ConnectionInterface[];
    subTemplatesSectionTitle?: string;
    docLink?: string;
}

/**
 * Connections list item mandatory attributes interface.
 */
export interface StrictConnectionInterface {
    id?: string;
    name?: string;
    description?: string;
    isEnabled?: boolean;
    image?: string;
    self?: string;
    federatedAuthenticators?: FederatedAuthenticatorListResponseInterface;
    templateId?: string;
    comingSoon?: boolean;
}

/**
 * Available Identity Provider list.
 */
export interface ConnectionListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: LinkInterface[];
    identityProviders?: StrictConnectionInterface[];
}

/**
 * Connections list item interface.
 */
export interface ConnectionInterface extends StrictConnectionInterface {
    idpIssuerName?: string;
    isPrimary?: boolean;
    isFederationHub?: boolean;
    homeRealmIdentifier?: string;
    alias?: string;
    claims?: ConnectionClaimsInterface;
    roles?: ConnectionRolesInterface;
    certificate?: CertificateConfigInterface;
    provisioning?: ProvisioningInterface;
    docLink?: string;
    type?: string;
    implicitAssociation?: ImplicitAssociaionConfigInterface;
}

export interface ImplicitAssociaionConfigInterface {
    isEnabled: boolean;
    lookupAttribute: string[];
}

/**
 * Captures connection claims details.
 */
export interface ConnectionClaimsInterface {
    userIdClaim?: ConnectionClaimInterface;
    roleClaim?: ConnectionClaimInterface;
    mappings?: ConnectionClaimMappingInterface[];
    provisioningClaims?: ConnectionProvisioningClaimInterface[];
}

/**
 * Captures the connection provisioning claim details.
 */
export interface ConnectionProvisioningClaimInterface {
    claim: ConnectionClaimInterface;
    defaultValue: string;
}

/**
 * Captures the connection claim mapping details.
 */
export interface ConnectionClaimMappingInterface {
    idpClaim: string;
    localClaim: ConnectionClaimInterface;
}

export interface ConnectionClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

export interface ConnectionCommonClaimMappingInterface {
    mappedValue: string;
    claim: ConnectionClaimInterface;
}

/**
 * Captures the connection claim details.
 */
export interface ConnectionClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

/**
 * Captures the connection role mapping details.
 */
export interface ConnectionRoleMappingInterface {
    idpRole?: string;
    localRole?: string;
}

/**
 * Captures the connection roles details.
 */
export interface ConnectionRolesInterface {
    mappings?: ConnectionRoleMappingInterface[];
    outboundProvisioningRoles?: string[];
}

/**
 * Captures the certificate configurations details.
 */
export interface CertificateConfigInterface {
    certificates?: string[];
    jwksUri?: string;
}

export interface OutboundProvisioningConnectorMetaInterface extends CommonPluggableComponentMetaInterface {
    connectorId?: string;
    name?: string;
    displayName?: string;
    blockingEnabled?: boolean;
    rulesEnabled?: boolean;
}

/**
 * Captures the outbound provisioning connector details.
 */
export interface OutboundProvisioningConnectorInterface extends CommonPluggableComponentInterface {
    name?: string;
    connectorId?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
    blockingEnabled?: boolean;
    rulesEnabled?: boolean;
}

/**
 * Captures the outbound provisioning connectors.
 */
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

export interface FederatedAuthenticatorMetaInterface extends CommonPluggableComponentMetaInterface {
    authenticatorId?: string;
    name?: string;
    displayName?: string;
}

export interface OutboundProvisioningConnectorWithMetaInterface {
    /**
     * Id of the connector.
     */
    id?: string;
    /**
     * API metadata of the connector.
     */
    meta?: FederatedAuthenticatorMetaInterface;
    /**
     * Local metadata of the connector.
     */
    localMeta?: FederatedAuthenticatorMetaInterface & { icon: GenericIconProps };
    /**
     * Metadata object.
     */
    data?: FederatedAuthenticatorInterface;
}

/**
 * Captures the JIT provisioning schemes.
 */
export enum SupportedJITProvisioningSchemes {
    PROVISION_SILENTLY = "PROVISION_SILENTLY",
    PROMPT_CONSENT = "PROMPT_CONSENT",
    PROMPT_PASSWORD_CONSENT = "PROMPT_PASSWORD_CONSENT",
    PROMPT_USERNAME_PASSWORD_CONSENT = "PROMPT_USERNAME_PASSWORD_CONSENT"
}

/**
 * Captures the properties of a JIT provisioning configuration.
 */
export interface JITProvisioningResponseInterface {
    isEnabled?: boolean;
    scheme?: SupportedJITProvisioningSchemes;
    userstore?: string;
    associateLocalUser?: boolean;
    attributeSyncMethod?: string;
}

/**
 * Captures the properties of a provisioning configuration.
 */
export interface ProvisioningInterface {
    jit?: JITProvisioningResponseInterface;
    outboundConnectors?: OutboundProvisioningConnectorsInterface;
}

/**
 * Captures the properties of a pluggable component property.
 */
export interface FederatedAuthenticatorListResponseInterface {
    defaultAuthenticatorId?: string;
    authenticators?: FederatedAuthenticatorListItemInterface[];
}

/**
 * Captures the properties of a federated authenticator list item.
 */
export interface FederatedAuthenticatorListItemInterface extends FederatedAuthenticatorInterface {
    self?: string;
}

/**
 * Captures the properties of a federated authenticator.
 */
export interface FederatedAuthenticatorInterface extends CommonPluggableComponentInterface {
    authenticatorId?: string;
    name?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
    tags?: string[];
    endpoint?: ExternalEndpoint;
}

/**
 * Captures the properties of a externally implemented local authenticator.
 */
export interface CustomAuthenticatorInterface extends StrictConnectionInterface {
    name?: string;
    displayName?: string;
    isEnabled?: boolean;
    isDefault?: boolean;
    endpoint?: ExternalEndpoint;
    authenticationType?: string;
    description?: string;
}

/**
 * Captures the properties of a external endpoint associated with the authenticator.
 */
export interface ExternalEndpoint {
    uri?: string;
    authentication?: ExternalEndpointAuthentication
}

/**
 * Captures the authentication properties of an external endpoint associated with the authenticator.
 */
export interface ExternalEndpointAuthentication {
    type?: AuthenticationType;
    properties?: string[]
}

/**
 * Captures the properties of a pluggable component.
 */
export interface CommonPluggableComponentInterface {
    properties?: CommonPluggableComponentPropertyInterface[];
}

/**
 * Captures the meta properties of a pluggable component.
 */
export interface CommonPluggableComponentMetaInterface {
    properties?: CommonPluggableComponentMetaPropertyInterface[];
}

/**
 * Captures the properties of a pluggable component.
 */
export interface CommonPluggableComponentPropertyInterface {
    key?: string;
    name?: string;
    value?: string;
}

/**
 * Captures the meta properties of a pluggable component.
 */
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

/**
 * Captures the connected apps response of a connection.
 */
export interface ConnectedAppsInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: LinkInterface[];
    connectedApps?: ConnectedAppInterface[];
}

/**
 * Captures the connected app details of connection.
 */
export interface ConnectedAppInterface extends ApplicationBasicInterface{
    appId?: string;
    self?: string;
}

/**
 *  Captures the basic details in the applications.
 */
export interface ApplicationBasicInterface {
    access?: ApplicationAccessTypes;
    id?: string;
    name: string;
    description?: string;
    applicationVersion?: string;
    accessUrl?: string;
    clientId?: string;
    issuer?: string;
    templateId?: string;
    isManagementApp?: boolean;
    advancedConfigurations?: AdvancedConfigurationsInterface;
}

/**
 * Captures the application access types.
 */
export enum ApplicationAccessTypes {
    READ = "READ",
    WRITE = "WRITE"
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
 * Captures the certificate details.
 */
export interface CertificateInterface {
    value?: string;
    type?: CertificateTypeInterface;
}

/**
 *  Acceptable certificate types.
 */
export enum CertificateTypeInterface {
    NONE ="None",
    JWKS = "JWKS",
    PEM = "PEM"
}

/**
 * Interface for the additional sp properties.
 */
export interface additionalSpProperty {
    name: string;
    value: string;
    displayName?: string;
}

/**
 * Interface for the connection templates category view config.
 */
export interface ConnectionTemplateCategoryViewConfigInterface {
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
 *  Connection template list item response interface.
 */
export interface ConnectionTemplateListItemInterface extends ConnectionTemplateItemInterface {
    services?: string[];
    content?: TemplateContentInterface;
    docLink?: string;
}

/**
 *  Connection template item interface. Updated the interface
 *  to support grouped templates. You can see that {@link templateGroup},
 *  {@link subTemplates} and etc., are part of this interface.
 */
export interface ConnectionTemplateItemInterface {
    id?: string;
    version?: string;
    name?: string;
    description?: string;
    image?: any;
    category?: string;
    displayOrder?: number;
    idp?: ConnectionInterface;
    customAuth?: CustomAuthenticatorInterface;
    disabled?: boolean;
    provisioning?: ProvisioningInterface;
    type?: string;
    templateGroup?: string;
    subTemplates?: ConnectionTemplateItemInterface[];
    subTemplatesSectionTitle?: string;
    templateId?: string;
    docLink?: string;
}

/**
 * Interface for Connection template categories.
 */
export interface ConnectionTemplateCategoryInterface {
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
    templates?: ConnectionTemplateInterface[];
    /**
     * View configurations.
     */
    viewConfigs?: ConnectionTemplateCategoryViewConfigInterface;
}

export interface StrictTemplateContentInterface {
    wizardHelp?: LazyExoticComponent<ComponentType<any>> | ReactElement | any;
}

export interface TemplateContentInterface extends StrictTemplateContentInterface {
    [ key: string ]: any;
}

/**
 * Connection supported services interface.
 */
export interface SupportedServicesInterface {
    name: string;
    displayName: string;
    logo: string;
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
 *  Connection template list item interface.
 */
export interface ConnectionTemplateInterface extends ConnectionTemplateItemInterface {
    services?: SupportedServicesInterface[];
    content?: TemplateContentInterface;
    tags?: string[];
    comingSoon?: boolean;
    docLink?: string;
}

/**
 *  Connection template list response interface.
 */
export interface ConnectionTemplateListResponseInterface {
    totalResults?: number;
    startIndex?: number;
    count?: number;
    links?: number;
    templates?: ConnectionTemplateListItemInterface[];
}

/**
 * Captures the generic connection wizard props.
 */
export interface GenericConnectionCreateWizardPropsInterface {
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
    template: ConnectionTemplateInterface;
    /**
     * Subtile of the wizard.
     */
    subTitle?: string;
    /**
     * Connections list.
     */
    connectionNamesList?: string[];
}

export interface TemplateConfigInterface<T = Record<string, unknown>> {
    content?: TemplateContentInterface;
    enabled: boolean;
    id: string;
    resource?: T | Promise<T> | string;
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

export interface TemplateConfigInterface<T = Record<string, unknown>> {
    content?: TemplateContentInterface;
    enabled: boolean;
    id: string;
    resource?: T | Promise<T> | string;
}

export interface ConnectionTemplatesConfigInterface {
    categories: TemplateConfigInterface<ConnectionTemplateCategoryInterface>[] | any;
    groups?: TemplateConfigInterface<ConnectionTemplateGroupInterface>[] | any;
}

/**
 * Enum for the supported quick start template types.
 *
 * @readonly
 */
export enum SupportedQuickStartTemplateTypes {
    GOOGLE = "Google"
}

export interface ConnectionAdvanceInterface {
    isFederationHub?: boolean;
    homeRealmIdentifier?: string;
    issuer?: string;
    alias?: string;
    certificate?: CertificateConfigInterface;
}

export interface ConnectionGroupInterface {
    id: string;
    name: string;
}

/**
 * Enum for IdP Tab types
 */
export enum ConnectionTabTypes {
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

export interface FederatedAuthenticatorWithMetaInterface {
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

export interface OutboundProvisioningConnectorMetaDataInterface {
    /**
     * Provisioning connector ID.
     */
    connectorId: string;
    /**
     * Displayname of the connector.
     */
    displayName: string;
    /**
     * Name of the connector.
     */
    name: string;
    /**
     * Description for the connector.
     */
    description: string;
    /**
     * Self link for the connector.
     */
    self: string;
    /**
     * Icon for the connector.
     */
    icon: any;
}

/**
 * Interface representing the cache for IDP name validation results.
 */
export interface IdpNameValidationCache {
    /**
     * The previously validated IDP name.
     */
    value: string;
    /**
     * Indicates whether the above IDP name is already taken.
     */
    state: boolean;
}

/**
 * Interface for the general form values in the enterprise connection wizard.
 */
export interface EnterpriseConnectionCreateWizardGeneralFormValuesInterface {
    /**
     * Name ID type used in the SAML protocol connection.
     */
    NameIDType: string;
    /**
     * Request method for the SAML protocol connection.
     */
    RequestMethod: string;
    /**
     * Unique name for the connection.
     */
    name: string;
}

/**
 * Interface for the general form values in the custom authentication wizard.
 */
export interface CustomAuthenticationCreateWizardGeneralFormValuesInterface {
    /**
     * Identifier of the custom authentication.
     */
    identifier: string;
    /**
     * Display name of the custom authentication.
     */
    displayName: string;
}

/**
 *  Custom authentication endpoint config form property Interface.
 */
export interface EndpointConfigFormPropertyInterface {
    /**
     * Endpoint Uri of the Action.
     */
    endpointUri: string;
    /**
     * Endpoint Uri of the Action.
     */
    authenticationType: string;
    /**
     * Username property of basic authentication.
     */
    usernameAuthProperty?: string;
    /**
     * Password property of basic authentication.
     */
    passwordAuthProperty?: string;
    /**
     * Access Token property of bearer authentication.
     */
    accessTokenAuthProperty?: string;
    /**
     * Header property of apiKey authentication.
     */
    headerAuthProperty?: string;
    /**
     * Value property of apiKey authentication.
     */
    valueAuthProperty?: string;
}

/**
 *  Endpoint configuration.
 */
export interface EndpointInterface {
    /**
     * External endpoint.
     */
    uri: string;
    /**
     * Authentication configurations of the Action.
     */
    authentication: AuthenticationInterface;
}

/**
 *  Endpoint authentication configuration.
 */
interface AuthenticationInterface {
    /**
     * Authentication Type.
     */
    type: AuthenticationType;
    /**
     * Authentication properties.
     */
    properties: Partial<AuthenticationPropertiesInterface>;
}

/**
 * Authentication Properties.
 */
export interface AuthenticationPropertiesInterface {
    /**
     * Username auth property.
     */
    username: string;
    /**
     * Password auth property.
     */
    password: string;
    /**
     * Access Token auth property.
     */
    accessToken: string;
    /**
     * Header auth property.
     */
    header: string;
    /**
     * Value auth property.
     */
    value: string;
}

/**
 * Interface for the authentication type dropdown options.
 */
export interface AuthenticationTypeDropdownOption {
    key: AuthenticationType;
    text: string;
    value: AuthenticationType;
}

/**
 * Enum for the connection type.
 */
export enum ConnectionTypes {
    CONNECTION = "connections",
    IDVP = "identity-verification-providers"
}

/**
 * Enum for the endpoint authentication types.
 */
export enum AuthenticationType {
    NONE = "NONE",
    BASIC = "BASIC",
    API_KEY = "API_KEY",
    BEARER = "BEARER",
}

export interface CustomAuthenticationCreateWizardProps extends GenericConnectionCreateWizardPropsInterface,
    IdentifiableComponentInterface {}

/**
 * Enum for the steps of the custom authentication create wizard.
 */
export enum WizardStepsCustomAuth {
    AUTHENTICATION_TYPE = "Authentication Type",
    GENERAL_SETTINGS = "General Settings",
    CONFIGURATION = "Configuration"
}
export interface WizardStepInterface {
    icon: any;
    title: string;
    submitCallback: any;
    name: WizardStepsCustomAuth;
}

export type AvailableCustomAuthentications = "external" | "internal" | "two-factor";
export type FormErrors = { [key: string]: string };
