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

import { useGetAuthenticators } from "@wso2is/admin.connections.v1/api/authenticators";
import {
    AuthenticatorLabels,
    AuthenticatorInterface as ConnectionInterface
} from "@wso2is/admin.connections.v1/models/authenticators";
import { useMemo } from "react";
import {
    AuthenticationSequenceInterface,
    AuthenticationStepInterface,
    AuthenticatorInterface
} from "../models/application";

/**
 * Interface for unsupported authenticator details.
 */
export interface UnsupportedAuthenticatorInfo {
    /**
     * Name of the authenticator.
     */
    name: string;
    /**
     * Display name of the authenticator.
     */
    displayName: string;
    /**
     * Step number where the authenticator is configured.
     */
    stepNumber: number;
}

/**
 * Custom hook to check if any configured authenticator lacks API authentication support.
 *
 * @param authenticationSequence - The authentication sequence from the application.
 * @param isAPIBasedAuthEnabled - Whether API-based authentication is enabled for the application.
 * @returns Object containing hasNonApiAuthenticators flag, list of unsupported authenticators, and loading state.
 */
export const useApiAuthCompatibility = (
    authenticationSequence: AuthenticationSequenceInterface,
    isAPIBasedAuthEnabled: boolean = false
): {
    hasNonApiAuthenticators: boolean;
    isAPIBasedAuthCompatibilityLoading: boolean;
    unsupportedAuthenticators: UnsupportedAuthenticatorInfo[];
} => {
    const {
        data: authenticators,
        isLoading: isAuthenticatorsLoading
    } = useGetAuthenticators(null, isAPIBasedAuthEnabled);

    const unsupportedAuthenticators: UnsupportedAuthenticatorInfo[] = useMemo(() => {
        if (!isAPIBasedAuthEnabled || !authenticationSequence?.steps || !authenticators) {
            return [];
        }

        const unsupported: UnsupportedAuthenticatorInfo[] = [];

        authenticationSequence.steps.forEach((step: AuthenticationStepInterface, stepIndex: number) => {
            step.options?.forEach((option: AuthenticatorInterface) => {
                const authenticator: ConnectionInterface = authenticators.find(
                    (a: ConnectionInterface) => a.name === option.idp
                );

                if (authenticator && !authenticator.tags?.includes(AuthenticatorLabels.API_AUTHENTICATION)) {
                    unsupported.push({
                        displayName: authenticator.displayName || authenticator.name,
                        name: authenticator.name,
                        stepNumber: stepIndex + 1
                    });
                }
            });
        });

        return unsupported;
    }, [ authenticationSequence, authenticators, isAPIBasedAuthEnabled ]);

    const hasNonApiAuthenticators: boolean = unsupportedAuthenticators.length > 0;

    return {
        hasNonApiAuthenticators,
        isAPIBasedAuthCompatibilityLoading: isAPIBasedAuthEnabled && isAuthenticatorsLoading,
        unsupportedAuthenticators
    };
};
