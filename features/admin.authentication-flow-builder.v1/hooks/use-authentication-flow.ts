/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import AuthenticationFlowContext, { AuthenticationFlowContextProps } from "./../context/authentication-flow-context";
import useUserPreferences from "../../admin-core-v1/hooks/use-user-preferences";
import { UserPreferencesInterface } from "../../admin-core-v1/models/user-preferences";
import { AuthenticationFlowBuilderModes } from "../models/flow-builder";

/**
 * Interface for the return type of the UseAuthenticationFlow hook.
 */
export interface UseAuthenticationFlowInterface extends AuthenticationFlowContextProps {
    /**
     * The preferred authentication flow builder mode.
     */
    preferredAuthenticationFlowBuilderMode: AuthenticationFlowBuilderModes;
    /**
     * Sets the preferred authentication flow builder mode.
     * @param mode - The preferred mode.
     */
    setPreferredAuthenticationFlowBuilderMode: (mode: AuthenticationFlowBuilderModes) => void;
}

/**
 * Hook that provides access to the branding preference context.
 * @returns An object containing the current branding preference theme and raw API response.
 */
const useAuthenticationFlow = (): UseAuthenticationFlowInterface => {
    const context: AuthenticationFlowContextProps = useContext(AuthenticationFlowContext);

    const { setPreferences, preferredAuthenticationFlowBuilderMode } = useUserPreferences<UserPreferencesInterface>();

    if (context === undefined) {
        throw new Error("UseAuthenticationFlow must be used within a AuthenticationFlowProvider");
    }

    /**
     * Get the preferred authentication flow builder mode.
     */
    const getPreferredAuthenticationFlowBuilderMode = (): AuthenticationFlowBuilderModes => {
        return preferredAuthenticationFlowBuilderMode as AuthenticationFlowBuilderModes;
    };

    /**
     * Sets the preferred authentication flow builder mode.
     *
     * @param mode - The preferred mode.
     */
    const setPreferredAuthenticationFlowBuilderMode = (mode: AuthenticationFlowBuilderModes): void => {
        setPreferences({
            preferredAuthenticationFlowBuilderMode: mode
        });
    };

    return {
        preferredAuthenticationFlowBuilderMode: getPreferredAuthenticationFlowBuilderMode(),
        setPreferredAuthenticationFlowBuilderMode,
        ...context
    };
};

export default useAuthenticationFlow;
