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

import { useContext } from "react";
import ProfileUpdateFlowBuilderContext, {
    ProfileUpdateFlowBuilderContextProps
} from "../context/profile-update-flow-builder-context";

/**
 * Props interface of {@link useProfileUpdateFlowBuilder}
 */
type useProfileUpdateFlowBuilderInterface = ProfileUpdateFlowBuilderContextProps;

/**
 * Hook that provides access to the Profile Update Flow Builder context.
 *
 * This hook allows components to access the profile update flow builder related data and functions
 * provided by the {@link ProfileUpdateFlowBuilderProvider}. It returns an object containing
 * the context values defined in {@link ProfileUpdateFlowBuilderContext}.
 *
 * @returns An object containing the context values of {@link ProfileUpdateFlowBuilderContext}.
 *
 * @throws Will throw an error if the hook is used outside of an ProfileUpdateFlowBuilderProvider.
 *
 * @example
 * ```tsx
 * const { selectedAttributes } = useProfileUpdateFlowBuilderContext();
 * ```
 */
const useProfileUpdateFlowBuilder = (): useProfileUpdateFlowBuilderInterface => {
    const context: ProfileUpdateFlowBuilderContextProps = useContext(ProfileUpdateFlowBuilderContext);

    if (context === undefined) {
        throw new Error("useProfileUpdateFlowBuilder must be used within a ProfileUpdateFlowBuilderProvider");
    }

    return context;
};

export default useProfileUpdateFlowBuilder;
