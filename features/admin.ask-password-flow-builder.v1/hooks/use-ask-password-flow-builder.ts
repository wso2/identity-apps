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
import AskPasswordFlowBuilderContext, {
    AskPasswordFlowBuilderContextProps
} from "../context/ask-password-flow-builder-context";

/**
 * Props interface of {@link useAskPasswordFlowBuilder}
 */
export type useAskPasswordFlowBuilderInterface = AskPasswordFlowBuilderContextProps;

/**
 * Hook that provides access to the Password Recovery Flow Builder context.
 *
 * This hook allows components to access the password recovery flow builder related data and functions
 * provided by the {@link AskPasswordFlowBuilderProvider}. It returns an object containing
 * the context values defined in {@link AskPasswordFlowBuilderContext}.
 *
 * @returns An object containing the context values of {@link AskPasswordFlowBuilderContext}.
 *
 * @throws Will throw an error if the hook is used outside of an AskPasswordFlowBuilderProvider.
 *
 * @example
 * ```tsx
 * const { selectedAttributes } = useAskPasswordFlowBuilderContext();
 * ```
 */
const useAskPasswordFlowBuilder = (): useAskPasswordFlowBuilderInterface => {
    const context: AskPasswordFlowBuilderContextProps = useContext(AskPasswordFlowBuilderContext);

    if (context === undefined) {
        throw new Error("useAskPasswordFlowBuilder must be used within a AskPasswordFlowBuilderProvider");
    }

    return context;
};

export default useAskPasswordFlowBuilder;
