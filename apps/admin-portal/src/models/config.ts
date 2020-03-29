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

import { CommonDeploymentConfigInterface, FeatureConfigInterface } from "@wso2is/core/models";
import { I18nModuleOptionsInterface } from "@wso2is/i18n";

/**
 * Application configuration interface.
 */
export interface AppConfigInterface {
    /**
     * Application management feature.
     */
    applications: FeatureConfigInterface<ApplicationManagementFeaturesConfigInterface>;
    /**
     * Claims management feature.
     */
    claimDialects: FeatureConfigInterface<ClaimDialectsConfigInterface>;
    /**
     * Identity provider management feature.
     */
    identityProviders: FeatureConfigInterface;
    /**
     * Server configurations feature.
     */
    serverConfigurations: FeatureConfigInterface;
    /**
     * User store configurations feature.
     */
    userStores: FeatureConfigInterface;
    /**
     * User management feature.
     */
    users: FeatureConfigInterface;
    /**
     * Role management feature.
     */
    roles: FeatureConfigInterface;
}

/**
 * Application management features interface.
 */
export interface ApplicationManagementFeaturesConfigInterface {
    /**
     * Application edit feature config.
     */
    edit: ApplicationEditFeaturesConfigInterface;
}

/**
 * Application edit config features.
 */
export interface ApplicationEditFeaturesConfigInterface {
    /**
     * Application general settings configuration feature.
     */
    generalSettings: FeatureConfigInterface;
    /**
     * Application access configuration feature.
     */
    accessConfiguration: FeatureConfigInterface;
    /**
     * Application attribute mapping feature.
     */
    attributeMapping: FeatureConfigInterface;
    /**
     * Application sign on methods feature.
     */
    signOnMethodConfiguration: FeatureConfigInterface;
    /**
     * Advance settings feature.
     */
    advanceSettings: FeatureConfigInterface;
}

/**
 * Claim Dialects configs.
 */
export interface ClaimDialectsConfigInterface {
    /**
     * Local claims configuration feature.
     */
    localClaims: FeatureConfigInterface;
    /**
     * External claims configuration feature.
     */
    externalClaims: FeatureConfigInterface;
}

/**
 * Config interface for deployment settings.
 */
export interface DeploymentConfigInterface extends CommonDeploymentConfigInterface {
    /**
     * Copyright text for the footer.
     */
    copyrightText: string;
    /**
     * Application(SPs) that shouldn't be allowed to delete.
     */
    doNotDeleteApplications?: string[];
    /**
     * i18n module options.
     */
    i18nModuleOptions?: I18nModuleOptionsInterface;
    /**
     * Title text.
     * ex: `WSO2 Identity Server`
     */
    titleText?: string;
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
