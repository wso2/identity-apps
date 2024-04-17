/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import isEmpty from "lodash-es/isEmpty";
import { FeatureAccessConfigInterface } from "../models";
import { OrganizationType } from "../models/organization";
import { AuthenticateUtils } from "../utils";

/**
 * Checks if the feature is enabled.
 *
 * @param feature -`FeatureAccessConfigInterface` Evaluating feature.
 * @param  key -`string | string[]` Feature key/keys to check.
 *
 * @returns `boolean` True is feature is enabled and false if not.
 */
export const isFeatureEnabled = (feature: FeatureAccessConfigInterface, key: string | string[]): boolean => {
    const isDefined: boolean = feature?.disabledFeatures
        && Array.isArray(feature.disabledFeatures)
        && feature.disabledFeatures.length > 0;

    if (!isDefined) {
        return true;
    }

    if (typeof key === "string") {
        return !feature.disabledFeatures.includes(key);
    }

    if (key instanceof Array) {
        return !key.some((item: string) => feature.disabledFeatures.includes(item));
    }

    return true;
};

/**
 * Checks if the required scopes are available to perform the desired CRUD operation.
 *
 * @param feature - `FeatureAccessConfigInterface` Evaluating feature.
 * @param scopes - `string[]` Set of scopes to check.
 * @param allowedScopes - `string` Set of allowed scopes.
 * @param organzationType - `string` Organization type. This should be equals to the `OrganizationType` enum in
 * `modules/common/src/constants/organization-constants.ts`.
 * @param isLegacyRuntimeDisabled - `boolean` Is legacy runtime disabled. This is used to ensure backward compatibility.
 *
 * @returns `boolean` True is scopes are enough and false if not.
 * @deprecated This function is deprecated. Use the `useRequiredScopes` hook instead.
 */
export const hasRequiredScopes = (
    feature: FeatureAccessConfigInterface,
    scopes: string[],
    allowedScopes: string,
    organzationType?: string,
    isLegacyRuntimeEnabled?: boolean
): boolean => {
    const isDefined: boolean = feature?.scopes && !isEmpty(feature.scopes) && scopes && !isEmpty(scopes);

    if (!isDefined) {
        return true;
    }

    // TODO: Remove these variables once the hasRequiredScopes() function is moved as a hook.
    // Use window org type if the org type is not passed as a parameter.
    // This was added as workaround to fix the issue with the delay to update the window object.
    // TODO: Remove the reliance on the window object to provide a consistent experience.
    const orgType: string = organzationType ?? window["AppUtils"].getOrganizationType();

    const windowLegacyAuthzRuntime: boolean = window["AppUtils"]?.getConfig()?.legacyAuthzRuntime;

    if (scopes instanceof Array) {
        if (!windowLegacyAuthzRuntime && orgType === OrganizationType.SUBORGANIZATION) {
            /**
             * If the organization type is `SUBORGANIZATION`, the `internal_` scopes should be replaced with
             * `internal_org_` scopes.
             */
            const interal: string = "internal_";
            const internalOrg: string = "internal_org_";
            const internalLogin: string = "internal_login";
            const consolePrefix: string = "console:";
            const consoleOrgPrefix: string = `${ consolePrefix }org:`;

            return scopes.every((scope: string) => {
                // If the scope begins with `internal_`, replace it with `internal_org_`.
                if (scope.startsWith(interal) && scope !== internalLogin) {
                    scope = scope.replace(interal, internalOrg);
                }

                // If the scope begins with `console:`, replace it with `console:org:`
                if (scope.startsWith(consolePrefix)) {
                    scope = scope.replace(consolePrefix, consoleOrgPrefix);
                }

                return AuthenticateUtils.hasScope(scope, allowedScopes);
            });
        }

        if (isLegacyRuntimeEnabled ||
            !organzationType ||
            organzationType === OrganizationType.SUPER_ORGANIZATION ||
            organzationType === OrganizationType.FIRST_LEVEL_ORGANIZATION ||
            organzationType === OrganizationType.TENANT) {

            return scopes.every((scope: string) => AuthenticateUtils.hasScope(scope, allowedScopes));
        }
    }

    return true;
};

/**
 * Checks if the portal access is allowed.
 *
 * @remarks
 * Currently the check passes if at least one feature has the required read permissions.
 *
 * @param featureConfig - `FeatureAccessConfigInterface` Feature configuration.
 * @param organzationType - `string` Organization type. This should be equals to the `OrganizationType` enum in
 * `modules/common/src/constants/organization-constants.ts`.
 * @param isLegacyRuntimeDisabled - `boolean` Is legacy runtime disabled. This is used to ensure backward compatibility.
 *
 * @returns `boolean` True is access is granted, false if not.
 */
export const isPortalAccessGranted = <T = unknown>(
    featureConfig: T,
    allowedScopes: string,
    organzationType?: string,
    isLegacyRuntimeDisabled?: boolean
): boolean => {
    const isDefined: boolean = featureConfig && !isEmpty(featureConfig);

    if (!isDefined) {
        return true;
    }

    let isAllowed: boolean = false;

    for (const value of Object.values(featureConfig)) {
        const feature: FeatureAccessConfigInterface = value;

        if (hasRequiredScopes(feature,
            feature?.scopes?.read,
            allowedScopes,
            organzationType,
            isLegacyRuntimeDisabled)) {
            isAllowed = true;

            break;
        }
    }

    return isAllowed;
};

