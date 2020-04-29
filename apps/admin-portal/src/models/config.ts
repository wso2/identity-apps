/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import {
    CommonConfigInterface,
    CommonDeploymentConfigInterface,
    FeatureAccessConfigInterface
} from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";

export type ConfigInterface = CommonConfigInterface<
    DeploymentConfigInterface,
    ServiceResourceEndpointsInterface,
    FeatureConfigInterface,
    I18nModuleOptionsInterface,
    UIConfigInterface>;

/**
 * Application configuration interface.
 */
export interface FeatureConfigInterface {
    /**
     * Application management feature.
     */
    applications?: FeatureAccessConfigInterface;
    /**
     * Attribute dialects(Claim dialects) feature.
     */
    attributeDialects?: FeatureAccessConfigInterface;
    /**
     * Certificates configurations feature.
     */
    certificates?: FeatureAccessConfigInterface;
    /**
     * Email templates feature.
     */
    emailTemplates?: FeatureAccessConfigInterface;
    /**
     * General Configuration settings feature.
     */
    generalConfigurations?: FeatureAccessConfigInterface;
    /**
     * Groups feature.
     */
    groups?: FeatureAccessConfigInterface;
    /**
     * Identity provider management feature.
     */
    identityProviders?: FeatureAccessConfigInterface;
    /**
     * Role management feature.
     */
    roles?: FeatureAccessConfigInterface;
    /**
     * User store configurations feature.
     */
    userStores?: FeatureAccessConfigInterface;
    /**
     * User management feature.
     */
    users?: FeatureAccessConfigInterface;
}

/**
 * Deployment config interface for dev portal.
 */
export interface DeploymentConfigInterface extends CommonDeploymentConfigInterface {
    /**
     * Base name of the user portal.
     * ex: `/user-portal` ot `/t/wos2.com/user-portal`
     */
    userPortalBaseName: string;
    /**
     * User portal host.
     * ex: `https://localhost:9000`
     */
    userPortalClientHost: string;
}

/**
 * Dev portal UI config interface.
 */
export interface UIConfigInterface {
    /**
     * Copyright text for the footer.
     */
    copyrightText: string;
    /**
     * Application(SPs) that shouldn't be allowed to delete.
     */
    doNotDeleteApplications?: string[];
    /**
     * Application(SPs) that shouldn't be allowed to delete.
     */
    doNotDeleteIdentityProviders?: string[];
    /**
     * Title text.
     * ex: `WSO2 Identity Server`
     */
    titleText?: string;
}

/**
 * Service resource endpoints config.
 */
export interface ServiceResourceEndpointsInterface {
    applications: string;
    associations: string;
    authorize: string;
    bulk: string;
    challenges: string;
    challengeAnswers: string;
    consents: string;
    publicCertificates: string;
    certificates: string;
    clientCertificates: string;
    groups: string;
    claims: string;
    externalClaims: string;
    emailTemplateType: string;
    identityProviders: string;
    issuer: string;
    jwks: string;
    localAuthenticators: string;
    localClaims: string;
    logout: string;
    me: string;
    permission: string;
    portalDocumentationRawContent: string;
    portalDocumentationStructure: string;
    profileSchemas: string;
    sessions: string;
    token: string;
    user: string;
    users: string;
    userStores: string;
    revoke: string;
    wellKnown: string;
    selfSignUp: string;
    accountRecovery: string;
    loginPolicies: string;
    passwordPolicies: string;
    accountLocking: string;
    accountDisabling: string;
    captchaForSSOLogin: string;
    passwordHistory: string;
    passwordPolicy: string;
}
