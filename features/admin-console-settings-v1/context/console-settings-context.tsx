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

import { Context, createContext } from "react";
import { ApplicationInterface, AuthenticationSequenceInterface } from "../../applications/models/application";
import { OIDCDataInterface } from "../../applications/models/application-inbound";

/**
 * Props interface of {@link ConsoleSettingsContext}
 */
export interface ConsoleSettingsContextProps {
    /**
     * ID of the Console application.
     */
    consoleId: string;
    /**
     * Display name of the Console application.
     */
    consoleDisplayName: string;
    /**
     * Console application configurations.
     */
    consoleConfigurations: ApplicationInterface;
    /**
     * Console application inbound configurations.
     */
    consoleInboundConfigurations: OIDCDataInterface;
    /**
     * Authentication sequence of the Console.
     */
    consoleAuthenticationSequence: AuthenticationSequenceInterface;
    /**
     * Flag to determine if the Console configurations fetch request loading.
     */
    isConsoleConfigurationsFetchRequestLoading: boolean;
    /**
     * Flag to determine if the Console inbound configurations fetch request loading.
     */
    isConsoleApplicationInboundConfigsFetchRequestLoading: boolean;
    /**
     * Mutate the Console application configurations and get updated values for `consoleAuthenticationSequence`, etc .
     */
    mutateConsoleConfigurations: () => void;
    /**
     * Mutate the Console application inbound configurations.
     */
    mutateConsoleApplicationInboundConfigs: () => void;
    /**
     * Update the Console login flow.
     * @param authenticationSequence - Authentication sequence.
     */
    updateConsoleLoginFlow: (authenticationSequence?: AuthenticationSequenceInterface) => Promise<void>;
}

/**
 * Context object for managing the Console settings context.
 */
const ConsoleSettingsContext: Context<ConsoleSettingsContextProps> =
  createContext<null | ConsoleSettingsContextProps>(null);

/**
 * Display name for the ConsoleSettingsContext.
 */
ConsoleSettingsContext.displayName = "ConsoleSettingsContext";

export default ConsoleSettingsContext;
