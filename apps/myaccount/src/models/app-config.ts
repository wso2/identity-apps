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

import { ResponseMode, Storage } from "@asgardio/oidc-js";
import {
    CommonConfigInterface,
    CommonDeploymentConfigInterface,
    CommonUIConfigInterface,
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
    profileSchemas: string;
    sessions: string;
    smsOtpResend: string;
    smsOtpValidate: string;
    token: string;
    totp: string;
    totpSecret: string;
    user: string;
    revoke: string;
    wellKnown: string;

    /**
     * Swagger Documentation {@link https://docs.wso2.com/display/IS511/apidocs/Consent-management-apis/}
     *
     * Below we declare the type definitions for resource routes in consent-management-api
     * (CMA). There's multiple endpoints under our CMA but in here we only specify the
     * routes which is used by this application.
     */
    consentManagement: {
        consent: {
            listAllConsents: string;
            addConsent: string; // Also for updating
            consentReceipt: string;
        };
        purpose: {
            getPurpose: string;
            list: string;
        };
    };

    /**
     * Documentation {@link https://is.docs.wso2.com/en/5.11.0/develop/configs-rest-api/#/Server%20Configs}
     *
     * Below {@code config} is the route that we use to fetch the server configurations.
     * @see fetchServerConfiguration to see the usages.
     */
    config: string;
}

/**
 * Authenticator app interface.
 */
export interface AuthenticatorAppInterface {
    link: string;
    name: string;
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
    authenticatorApp?: AuthenticatorAppInterface[];
}

/**
 * Portal Deployment config interface inheriting the common configs from core module.
 */
export type DeploymentConfigInterface = CommonDeploymentConfigInterface<ResponseMode, Storage>;
