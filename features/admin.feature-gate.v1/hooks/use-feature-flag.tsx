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
 * @param featureKey - Feature key.
 * @param featureFlags - Feature flags.
 * @param featureConfig - Feature access configuration.
 * @param featureName - Feature name.
 *
 * @returns Feature status flag.
 */
const useFeatureFlag = (
    featureKey: string,
    featureFlags?: FeatureFlagsInterface[],
    featureConfig?: FeatureAccessConfigInterface,
    featureName?: string
): string | null => {
    return useMemo(() => {
        if (!featureKey) return null;

        // If feature flags are provided, find the flag directly.
        if (featureFlags) {
            return featureFlags.find(
                (featureFlag: FeatureFlagsInterface) => featureFlag.feature === featureKey
            )?.flag ?? null;
        }

        // If feature config is provided with feature name.
        if (featureConfig && featureName) {
            const config: FeatureAccessConfigInterface = featureConfig[featureName];

            if (!config) return null;

            return config.featureFlags?.find(
                (featureFlag: FeatureFlagsInterface) => featureFlag.feature === featureKey
            )?.flag ?? null;
        }

        return null;
    }, [ featureKey, featureName, featureFlags, featureConfig ]);
};

export default useFeatureFlag;
