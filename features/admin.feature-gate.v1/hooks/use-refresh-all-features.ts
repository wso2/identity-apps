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

import { useCallback } from "react";
import { useSWRConfig } from "swr";
import FeatureGateConstants from "../constants/feature-gate-constants";

/**
 * Hook that returns a function to re-fetch the feature gate's list of all features.
 *
 * @returns A function that revalidates the all features request.
 */
const useRefreshAllFeatures = (): () => Promise<void> => {
    const { mutate } = useSWRConfig();

    return useCallback(async (): Promise<void> => {
        // `useRequest` keys its SWR cache entries by the stringified Axios request config,
        // so the all features entry is matched by the endpoint it points at.
        await mutate(
            (key: unknown): boolean =>
                typeof key === "string" && key.includes(FeatureGateConstants.ALL_FEATURES_ENDPOINT_SUFFIX)
        );
    }, [ mutate ]);
};

export default useRefreshAllFeatures;
