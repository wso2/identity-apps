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
import PasswordRecoveryFlowBuilderContext, {
    PasswordRecoveryFlowBuilderContextProps
} from "../context/password-recovery-flow-builder-context";

/**
 * Props interface of {@link usePasswordRecoveryFlowBuilder}
 */
export type usePasswordRecoveryFlowBuilderInterface = PasswordRecoveryFlowBuilderContextProps;

/**
 * Hook that provides access to the Password Recovery Flow Builder context.
 *
 * This hook allows components to access the password recovery flow builder related data and functions
 * provided by the {@link PasswordRecoveryFlowBuilderProvider}. It returns an object containing
 * the context values defined in {@link PasswordRecoveryFlowBuilderContext}.
 *
 * @returns An object containing the context values of {@link PasswordRecoveryFlowBuilderContext}.
 *
 * @throws Will throw an error if the hook is used outside of an PasswordRecoveryFlowBuilderProvider.
 *
 * @example
 * ```tsx
 * const { selectedAttributes } = usePasswordRecoveryFlowBuilderContext();
 * ```
 */
const usePasswordRecoveryFlowBuilder = (): usePasswordRecoveryFlowBuilderInterface => {
    const context: PasswordRecoveryFlowBuilderContextProps = useContext(PasswordRecoveryFlowBuilderContext);

    if (context === undefined) {
        throw new Error("usePasswordRecoveryFlowBuilder must be used within a PasswordRecoveryFlowBuilderProvider");
    }

    return context;
};

export default usePasswordRecoveryFlowBuilder;
