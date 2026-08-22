/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, useRequiredScopes } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { useSelector } from "react-redux";
import {
    ApplicationFeatureDictionaryKeys,
    ApplicationManagementConstants
} from "../constants/application-management";

/**
 * Return type for the `useClientSecretManagement` hook.
 */
interface UseClientSecretManagementInterface {
    /**
     * Whether client secret permission enforcement is enabled (the inverse of the skip-enforce
     * configuration), which governs the legacy single-secret path and the regenerate action.
     */
    isEnforceClientSecretPermissionEnabled: boolean;
    /**
     * Whether the user holds the client secret view scope.
     */
    hasClientSecretReadPermission: boolean;
    /**
     * Whether the user holds the client secret create scope (also authorizes regeneration).
     */
    hasClientSecretCreatePermission: boolean;
    /**
     * Whether the user holds the client secret delete scope.
     */
    hasClientSecretDeletePermission: boolean;
    /**
     * Maximum number of client secrets an application can hold. A count above one enables the
     * multiple client secrets experience; one keeps the legacy single-secret view.
     */
    maxSecretCount: number;
}

/**
 * Resolves the multiple client secrets feature configuration and the user's client secret permissions.
 *
 * @returns `UseClientSecretManagementInterface`
 */
const useClientSecretManagement = (): UseClientSecretManagementInterface => {

    const applicationFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState): FeatureAccessConfigInterface => state?.config?.ui?.features?.applications);
    const maxSecretCount: number = useSelector((state: AppState): number =>
        state?.config?.ui?.features?.applications?.properties?.multipleClientSecretsMaxCount as number);

    const isEnforceClientSecretPermissionEnabled: boolean = isFeatureEnabled(
        applicationFeatureConfig,
        ApplicationManagementConstants.FEATURE_DICTIONARY.get(
            ApplicationFeatureDictionaryKeys.ApplicationEditEnforceClientSecretPermission) ?? ""
    );

    const hasClientSecretReadPermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationClientSecretManagement?.scopes?.read ?? []);
    const hasClientSecretCreatePermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationClientSecretManagement?.scopes?.create ?? []);
    const hasClientSecretDeletePermission: boolean = useRequiredScopes(
        applicationFeatureConfig?.subFeatures?.applicationClientSecretManagement?.scopes?.delete ?? []);

    return {
        hasClientSecretCreatePermission,
        hasClientSecretDeletePermission,
        hasClientSecretReadPermission,
        isEnforceClientSecretPermissionEnabled,
        maxSecretCount
    };
};

export default useClientSecretManagement;
