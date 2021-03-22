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

import isEmpty from "lodash-es/isEmpty";
import { FeatureAccessConfigInterface } from "../models";
import { AuthenticateUtils } from "../utils";

/**
 * Checks if the feature is enabled.
 *
 * @param {FeatureAccessConfigInterface} feature - Evaluating feature.
 * @param {string | string[]} key - Feature key/keys to check.
 *
 * @return {boolean} True is feature is enabled and false if not.
 */
export const isFeatureEnabled = (feature: FeatureAccessConfigInterface, key: string | string[]): boolean => {
    const isDefined = feature?.disabledFeatures
        && Array.isArray(feature.disabledFeatures)
        && feature.disabledFeatures.length > 0;

    if (!isDefined) {
        return true;
    }

    if (typeof key === "string") {
        return !feature.disabledFeatures.includes(key);
    }

    if (key instanceof Array) {
        return !key.some((item) => feature.disabledFeatures.includes(item));
    }

    return true;
};

/**
 * Checks if the required scopes are available to perform the desired CRUD operation.
 *
 * @param {FeatureAccessConfigInterface} feature - Evaluating feature.
 * @param {string[]} scopes - Set of scopes to check.
 * @param {string} allowedScopes - Set of allowed scopes.
 *
 * @return {boolean} True is scopes are enough and false if not.
 */
export const hasRequiredScopes = (
    feature: FeatureAccessConfigInterface, scopes: string[], allowedScopes: string
): boolean => {
    const isDefined = feature?.scopes && !isEmpty(feature.scopes) && scopes && !isEmpty(scopes);

    if (!isDefined) {
        return true;
    }

    if (scopes instanceof Array) {
        return scopes.every((scope) => AuthenticateUtils.hasScope(scope, allowedScopes));
    }

    return true;
};

/**
 * Checks if the portal access is allowed.
 *
 * @remarks
 * Currently the check passes if at least one feature has the required read permissions.
 *
 * @param {FeatureAccessConfigInterface} featureConfig - Feature configuration.
 *
 * @return {boolean} True is access is granted, false if not.
 */
export const isPortalAccessGranted = <T = {}>(featureConfig: T, allowedScopes: string): boolean => {
    const isDefined = featureConfig && !isEmpty(featureConfig);

    if (!isDefined) {
        return true;
    }

    let isAllowed = false;

    for (const value of Object.values(featureConfig)) {
        const feature: FeatureAccessConfigInterface = value;

        if (hasRequiredScopes(feature, feature?.scopes?.read, allowedScopes)) {
            isAllowed = true;

            break;
        }
    }

    return isAllowed;
};

/**
 * This is a temporary util method added to conditionally render the manage tab depending on the
 * scopes of the user.
 *
 * Git issue to track - https://github.com/wso2/product-is/issues/11319
 *
 * @param featureConfig
 * @param allowedScopes
 */
export const hasRequiredScopesForAdminView = (featureConfig: any, allowedScopes: string): boolean => {

    let feature = null;
    let isAllowed = null;

    for (const [ key, value ] of Object.entries(featureConfig)) {
        feature = value;

        if (value) {

            if (key === "attributeDialects" || key === "userStores" || key === "roles") {

                const hasReadAccess = hasRequiredManageScopes(feature, feature.scopes?.read, allowedScopes);
                const hasUpdateAccess = hasRequiredManageScopes(feature, feature.scopes?.update, allowedScopes);

                if (!(hasReadAccess && hasUpdateAccess)) {
                    isAllowed = false;
                }
            }

            isAllowed = hasRequiredManageScopes(feature, feature.scopes?.read, allowedScopes);
        }
    }

    return isAllowed;
};

/**
 * This is a temporary util method added to specially handle the scopes of
 * "Application Developer" role.
 *
 * Git issue to track - https://github.com/wso2/product-is/issues/11319
 *
 * @param feature
 * @param scopes
 * @param allowedScopes
 */
export const hasRequiredManageScopes = (
    feature: FeatureAccessConfigInterface, scopes: string[], allowedScopes: string
): boolean => {

    let hasScope = true;

    if (scopes instanceof Array) {
        hasScope = scopes.every((scope) => AuthenticateUtils.hasScope(scope, allowedScopes));
    }

    return hasScope;
};
