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

import AIGeneratedFlowContext, {
    AIGeneratedFlowContextProps
} from "@wso2is/admin.flow-builder-core.v1/context/ai-generated-flow-context";
import { useContext } from "react";

/**
 * Interface for the return type of the `useAIGeneratedAskPasswordFlow` hook.
 */
export type UseAIGeneratedAskPasswordFlowInterface = AIGeneratedFlowContextProps;

/**
 * Hook that provides access to the ai generated flow context.
 * @returns An object containing the ai generated flow preference.
 */
const useAIGeneratedAskPasswordFlow = (): UseAIGeneratedAskPasswordFlowInterface => {
    const context: AIGeneratedFlowContextProps = useContext(AIGeneratedFlowContext);

    if (context === undefined) {
        throw new Error("useAIGeneratedAskPasswordFlow must be used within a AIGeneratedFlowProvider.");
    }

    return context;
};

export default useAIGeneratedAskPasswordFlow;
