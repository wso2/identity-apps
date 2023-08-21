/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { featureGateConfig } from "../../features/feature-gate/configs/feature-gate";
import { FeatureGateInterface } from "../../features/feature-gate/models/feature-gate";

/**
 * Hook to get the updated feature gate configuration.
 *
 * @returns The updated feature gate configuration.
 */
export const useGetUpdatedFeatureGateConfig = (): FeatureGateInterface => {

    return featureGateConfig;
};

