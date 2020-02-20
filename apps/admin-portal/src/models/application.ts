/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import {
    AuthProtocolMetaListItemInterface,
    OIDCDataInterface,
    OIDCMetadataInterface,
    SupportedAuthProtocolTypes,
    SupportedQuickStartTemplateTypes
} from "./application-inbound";

/**
 *  Captures the basic details in the applications.
 */
export interface ApplicationBasicInterface {
    id?: string;
    name: string;
    description?: string;
    accessUrl?: string;
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
    displayname?: string;
}

interface ClaimMappingInterface {
    applicationClaim: string;
    localClaim: AppClaimInterface;
}

interface SubjectInterface {
    claim: AppClaimInterface[];
    includeUserDomain: boolean;
    includeTenantDomain: boolean;
    useMappedLocalSubject: boolean;
}

interface RoleInterface {
    claim: AppClaimInterface[];
    includeUserDomain: boolean;
}

interface RoleMappingInterface {
    localRole: string;
    applicationRole: string;
}

interface RoleConfigInterface {
    mappings: RoleMappingInterface[];
    includeUserDomain: boolean;
    claim: AppClaimInterface;
}

interface RequestedClaimConfigurationInterface {
    claim: AppClaimInterface;
    mandatory: boolean;
}

interface SubjectConfigInterface {
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
    claimMapping: ClaimMappingInterface[];
    requestedClaims: RequestedClaimConfigurationInterface[];
    subject: SubjectConfigInterface;
    role: RoleConfigInterface;
}

/**
 *  Acceptable certificate types.
 */
enum CertificateTypeInterface {
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
    skipConsent?: boolean; // TODO  Add consent for logout
    returnAuthenticatedIdpList?: boolean;
    enableAuthorization?: boolean;
}

export interface LinkInterface {
    href: string;
    rel: string;
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
 * Interface for the Application reducer state.
 */
export interface ApplicationReducerStateInterface {
    meta: ApplicationMetaInterface;
}

/**
 * Interface for the application meta for the redux store.
 */
interface ApplicationMetaInterface {
    inboundProtocols: AuthProtocolMetaListItemInterface[];
    protocolMeta: AuthProtocolMetaInterface;
}

/**
 * Interface for the auth protocol metadata.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
interface AuthProtocolMetaInterface {
    [ key: string ]: OIDCMetadataInterface | any;
}

/**
 *  Application template list item interface.
 */
export interface ApplicationTemplateListItemInterface {
    description: string;
    displayName: string;
    id: SupportedQuickStartTemplateTypes;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    image: any;
    protocols: SupportedAuthProtocolTypes[];
    technologies: ApplicationTemplateTechnology[];
}

/**
 *  Application templates interface.
 */
export interface ApplicationTemplatesInterface {
    [ key: string ]: ApplicationTemplateListItemInterface[];
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
 *  Application template technology interface.
 */
export interface ApplicationTemplateTechnology {
    name: string;
    displayName: string;
    /* eslint-disable @typescript-eslint/no-explicit-any */
    logo: any;
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
        skipConsent: false,
    },
    authenticationSequence: undefined,
    claimConfiguration: undefined,
    description: "",
    id: "",
    imageUrl: "",
    inboundProtocols: undefined,
    name: ""
});
