/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureAccessConfigInterface, FeatureFlagsInterface } from "@wso2is/core/models";
import { useMemo } from "react";

/**
 * Custom hook to get the status of a feature flag.
 *
 * @param featureFlags - Feature flags.
 * @param featureConfig - Feature access configuration.
 * @param featureKey - Feature key.
 * @param featureName - Feature name.
 *
 * @returns Feature status flag.
 */
const useFeatureFlag = (
    featureFlags: FeatureFlagsInterface[],
    featureKey: string,
    featureConfig?: FeatureAccessConfigInterface,
    featureName?: string
): string => {

    return useMemo(() => {
        if (!featureKey) {
            return null;
        }

        let flag: string = "";

        if (!featureConfig) {
            flag = featureFlags.find(
                (featureFlag: FeatureFlagsInterface) => featureFlag.feature === featureKey)?.flag;
        }

        if (featureConfig && featureName) {
            const config: FeatureAccessConfigInterface = featureConfig?.[featureName];

            if (!config) {
                return null;
            }

            flag = config?.featureFlags?.find(
                (featureFlag: FeatureFlagsInterface) => featureFlag.feature === featureKey)?.flag;
        }

        return flag;

    }, [ featureKey, featureName, featureFlags, featureConfig ]);
};

export default useFeatureFlag;
