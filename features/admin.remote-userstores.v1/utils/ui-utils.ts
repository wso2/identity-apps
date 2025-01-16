/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants";
import { isFeatureEnabled } from "@wso2is/core/helpers";
import { RemoteUserStoreConstants, UserStoresFeatureDictionaryKeys } from "../constants/remote-user-stores-constants";

/**
 * Checks if the read groups feature is enabled based on the feature config and the user store manager.
 *
 * @param userStoreFeatureConfig - User store feature config.
 * @param userStoreManager - User store manager type.
 */
export const getIsReadGroupsFeatureEnabled = (
    userStoreFeatureConfig: FeatureAccessConfigInterface,
    userStoreManager: RemoteUserStoreManagerType
) => {
    const isClassicUserStoreReadGroupsFeatureEnabled: boolean = isFeatureEnabled(
        userStoreFeatureConfig,
        RemoteUserStoreConstants.FEATURE_DICTIONARY
            .get(UserStoresFeatureDictionaryKeys.ClassicUserStoreReadGroups)
    );
    const isOptimizedUserStoreReadGroupsFeatureEnabled: boolean = isFeatureEnabled(
        userStoreFeatureConfig,
        RemoteUserStoreConstants.FEATURE_DICTIONARY
            .get(UserStoresFeatureDictionaryKeys.OptimizedUserStoreReadGroups)
    );
    const isReadGroupsFeatureEnabled: boolean = (
        (userStoreManager === RemoteUserStoreManagerType.WSOutboundUserStoreManager
            && isClassicUserStoreReadGroupsFeatureEnabled)
        || (userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager
            && isOptimizedUserStoreReadGroupsFeatureEnabled)
    );

    return isReadGroupsFeatureEnabled;
};
