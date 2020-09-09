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
 * Model of the application configurations.
 */
export interface FeatureConfigInterface {
    /**
     * User overview feature.
     */
    overview?: FeatureAccessConfigInterface;
    /**
     * Personal info feature.
     */
    personalInfo?: FeatureAccessConfigInterface;
    /**
     * Application management feature.
     */
    applications?: FeatureAccessConfigInterface;
    /**
     * Account security feature.
     */
    security?: FeatureAccessConfigInterface;
    /**
     * Pending operation tasks feature.
     */
    operations?: FeatureAccessConfigInterface;
}

/**
 * Service resource endpoints config.
 */
export interface ServiceResourceEndpointsInterface {
    applications: string;
    associations: string;
    authorize: string;
    challenges: string;
    challengeAnswers: string;
    consents: string;
    federatedAssociations: string;
    fidoEnd: string;
    fidoMetaData: string;
    fidoStart: string;
    fidoStartUsernameless: string;
    isReadOnlyUser: string;
    issuer: string;
    jwks: string;
    logout: string;
    me: string;
    pendingApprovals: string;
    profileSchemas: string;
    receipts: string;
    sessions: string;
    token: string;
    totp: string;
    totpSecret: string;
    user: string;
    revoke: string;
    wellKnown: string;
}

/**
 * Authenticator app interface.
 */
export interface AuthenticatorAppInterface {
    link: string;
    name: string;
}

/**
 * Authenticator app list interface.
 */
export interface AuthenticatorAppListInterface {
    apps: AuthenticatorAppInterface[];
}

/**
 * Dev portal UI config interface.
 */
export interface UIConfigInterface extends CommonUIConfigInterface {
    /**
     * Copyright text for the footer.
     */
    copyrightText: string;
    /**
     * Title text.
     * ex: `WSO2 Identity Server`
     */
    titleText?: string;
    /**
     * TOTP authenticator apps.
     */
    authenticatorApp?: AuthenticatorAppListInterface;
}
