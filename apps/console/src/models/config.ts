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
    CommonUIConfigInterface,
    FeatureAccessConfigInterface
} from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";

export type ConfigInterface = CommonConfigInterface<
    CommonDeploymentConfigInterface,
    ServiceResourceEndpointsInterface,
    FeatureConfigInterface,
    I18nModuleOptionsInterface,
    UIConfigInterface>;

/**
 * Application configuration interface.
 */
export interface FeatureConfigInterface {
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
 * Portal Deployment config interface inheriting the common configs from core module.
 */
export interface DeploymentConfigInterface extends CommonDeploymentConfigInterface {
    /**
     * Configs of the user portal app.
     */
    accountApp: ExternalAppConfigInterface;
    /**
     * Configs of the developer portal app.
     */
    developerApp: ExternalAppConfigInterface;
}

/**
 * Interface for defining settings and configs of an external app.
 */
interface ExternalAppConfigInterface {
    path: string;
}

/**
 * Portal UI config interface inheriting the common configs from core module.
 */
export type UIConfigInterface = CommonUIConfigInterface;

/**
 * Service resource endpoints config.
 */
export interface ServiceResourceEndpointsInterface {
    accountDisabling: string;
    accountLocking: string;
    accountRecovery: string;
    bulk: string;
    captchaForSSOLogin: string;
    certificates: string;
    claims: string;
    clientCertificates: string;
    emailTemplateType: string;
    externalClaims: string;
    governanceConnectorCategories: string;
    groups: string;
    localClaims: string;
    loginPolicies: string;
    // TODO: Remove this endpoint and use ID token to get the details
    me: string;
    passwordHistory: string;
    passwordPolicies: string;
    passwordPolicy: string;
    permission: string;
    publicCertificates: string;
    requestPathAuthenticators: string;
    selfSignUp: string;
    serverConfigurations: string;
    userStores: string;
    users: string;
}
