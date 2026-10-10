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

import { FeatureStatus } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import useFeatureFlag from "@wso2is/admin.feature-gate.v1/hooks/use-feature-flag";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { useSelector } from "react-redux";
import { isCDSUnifiedProfileViewEnabled } from "../utils/ui-mode-utils";

/**
 * Whether tolerant matching may be configured from the Console.
 *
 * Gated separately from the Customer Data Service itself so a deployment can take the rest
 * of the feature without it. Off, a rule is created the way it was before tolerant matching
 * existed — the server reads an unspecified type and method as an exact match on a plain
 * value — so nothing an operator has already configured changes, and nothing starts
 * tolerating typos because the Console was upgraded.
 *
 * It also requires the unified Customer Data view. Tolerant matching produces pairs the engine
 * will not merge on its own, and the pages that resolve them — the review queue and the
 * matching settings — are reachable only from that view. Offering the controls without them
 * would let an operator create rules whose output has nowhere to go.
 *
 * @returns Whether the tolerant matching controls should be offered.
 */
const useFuzzyUnificationEnabled = (): boolean => {
    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService);

    const flag: string = useFeatureFlag(
        FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.CUSTOMER_DATA_FUZZY_UNIFICATION,
        cdsFeatureConfig?.featureFlags
    );

    return flag === FeatureStatus.ENABLED && isCDSUnifiedProfileViewEnabled();
};

export default useFuzzyUnificationEnabled;
