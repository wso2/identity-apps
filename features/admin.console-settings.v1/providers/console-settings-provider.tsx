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

import { updateApplicationConfigurations, useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { useGetApplication } from "@wso2is/admin.applications.v1/api/use-get-application";
import useGetApplicationInboundConfigs from "@wso2is/admin.applications.v1/api/use-get-application-inbound-configs";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants";
import { AuthenticationSequenceInterface } from "@wso2is/admin.applications.v1/models/application";
import React, { PropsWithChildren, ReactElement, useMemo } from "react";
import ConsoleSettingsContext from "../context/console-settings-context";

/**
 * Props interface of {@link ConsoleSettingsProvider}
 */
export type ConsoleSettingsProviderProps = unknown;

/**
 * Provider for the Console settings context.
 *
 * @param props - Props for the client.
 * @returns Console settings provider.
 */
const ConsoleSettingsProvider = (props: PropsWithChildren<ConsoleSettingsProviderProps>): ReactElement => {
    const { children } = props;

    const { data: consoleApplicationFilter } = useApplicationList(null, null, null, "name eq Console");

    const consoleId: string = useMemo(() => {
        return consoleApplicationFilter?.applications[0]?.id;
    }, [ consoleApplicationFilter ]);

    const {
        data: consoleApplication,
        mutate: mutateConsoleApplication,
        isLoading: isConsoleConfigurationsFetchRequestLoading
    } = useGetApplication(consoleId, !!consoleId);

    const {
        data: consoleApplicationInboundConfigs,
        mutate: mutateConsoleApplicationInboundConfigs,
        isLoading: isConsoleApplicationInboundConfigsFetchRequestLoading
    } = useGetApplicationInboundConfigs(consoleId, "oidc", !!consoleId);

    /**
     * Function to update the console login flow sequence.
     *
     * @param authenticationSequence - Authentication sequence.
     * @returns Promise containing void.
     */
    const updateConsoleLoginFlow = (authenticationSequence: AuthenticationSequenceInterface): Promise<void> => {
        return updateApplicationConfigurations(consoleId, {
            authenticationSequence,
            name: ApplicationManagementConstants.CONSOLE_APP_NAME
        });
    };

    return (
        <ConsoleSettingsContext.Provider
            value={ {
                consoleAuthenticationSequence: consoleApplication?.authenticationSequence,
                consoleConfigurations: consoleApplication,
                consoleDisplayName: consoleApplication?.name,
                consoleId,
                consoleInboundConfigurations: consoleApplicationInboundConfigs,
                isConsoleApplicationInboundConfigsFetchRequestLoading,
                isConsoleConfigurationsFetchRequestLoading,
                mutateConsoleApplicationInboundConfigs,
                mutateConsoleConfigurations: mutateConsoleApplication,
                updateConsoleLoginFlow
            } }
        >
            { children }
        </ConsoleSettingsContext.Provider>
    );
};

export default ConsoleSettingsProvider;
