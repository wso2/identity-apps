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
import RulesContext, { RulesContextInterface } from "../contexts/rules-context";

/**
 * Hook that provides access to the Rules context.
 *
 * This hook allows components to access the rules component related data and functions
 * provided by the {@link RulesProvider}. It returns an object containing
 * the context values defined in {@link RulesContext}.
 *
 * @returns An object containing the context values of {@link RulesContext}.
 *
 * @throws Will throw an error if the hook is used outside of an RegistrationFlowBuilderProvider.
 *
 * @example
 * ```tsx
 * const { rulesInstance } = useRulesContext();
 * ```
 */
export const useRulesContext = (): RulesContextInterface => {
    const context: RulesContextInterface = useContext(RulesContext);

    if (!context) {
        throw new Error("useRulesContext must be used within a RulesProvider");
    }

    return context;
};

export default useRulesContext;
