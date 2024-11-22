/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import RegistrationFlowBuilderContext, {
    RegistrationFlowBuilderContextProps
} from "../context/registration-flow-builder-context";

/**
 * Props interface of {@link useRegistrationFlowBuilder}
 */
export type useRegistrationFlowBuilderInterface = RegistrationFlowBuilderContextProps;

/**
 * Hook that provides access to the Registration Flow Builder context.
 *
 * This hook allows components to access the registration flow builder related data and functions
 * provided by the {@link RegistrationFlowBuilderProvider}. It returns an object containing
 * the context values defined in {@link RegistrationFlowBuilderContext}.
 *
 * @returns An object containing the context values of {@link RegistrationFlowBuilderContext}.
 *
 * @throws Will throw an error if the hook is used outside of an RegistrationFlowBuilderProvider.
 *
 * @example
 * ```tsx
 * const { selectedAttributes } = useRegistrationFlowBuilderContext();
 * ```
 */
const useRegistrationFlowBuilder = (): useRegistrationFlowBuilderInterface => {
    const context: RegistrationFlowBuilderContextProps = useContext(RegistrationFlowBuilderContext);

    if (context === undefined) {
        throw new Error("useRegistrationFlowBuilder must be used within a RegistrationFlowBuilderProvider");
    }

    return context;
};

export default useRegistrationFlowBuilder;
