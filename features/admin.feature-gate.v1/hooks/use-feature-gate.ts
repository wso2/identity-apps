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

import { useContext } from "react";
import FeatureGateContext, { FeatureGateContextProps } from "../context/feature-gate-context";

/**
 * Props interface of {@link useFeatureGate}
 */
export type UseFeatureGateInterface = FeatureGateContextProps;

/**
 * Hook that provides access to the Feature Gate context.
 *
 * This hook allows components to access the feature gate related data and functions
 * provided by the {@link FeatureGateProvider}. It returns an object containing
 * the context values defined in {@link FeatureGateContext}.
 *
 * @returns An object containing the context values of {@link FeatureGateContext}.
 *
 * @throws Will throw an error if the hook is used outside of a FeatureGateProvider.
 *
 * @example
 * ```tsx
 * const { isFeatureEnabled } = useFeatureGate();
 * ```
 */
const useFeatureGate = (): UseFeatureGateInterface => {
    const context: FeatureGateContextProps = useContext(FeatureGateContext);

    if (context === undefined) {
        throw new Error("useFeatureGate must be used within a FeatureGateProvider");
    }

    return context;
};

export default useFeatureGate;
