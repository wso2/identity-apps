/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { RemoteUserStoreManagerType } from "@wso2is/admin.userstores.v1/constants";
import { HttpMethods } from "@wso2is/core/models";
import { AgentConnectionAPIResponseInterface, AgentConnectionInterface } from "../models/remote-user-stores";

/**
 * Function to normalize the agent connection data due to the API response inconsistency
 * between remote and on-prem user store agents.
 *
 * @param apiAgentConnection - Agent connection data to be normalized.
 * @returns The normalized agent connection data.
 */
export const normalizeAgentConnection = (
    apiAgentConnection: AgentConnectionAPIResponseInterface
): AgentConnectionInterface => ({
    agent: {
        agentId: apiAgentConnection.agent?.Id ?? apiAgentConnection.agent?.id ?? "",
        displayName: apiAgentConnection.agent?.displayName
    },
    connected: apiAgentConnection.connected,
    tokenId: apiAgentConnection.tokenId
});

/**
 * Hook to get connections list of a user store.
 * The endpoint will be different based on the user store manager type.
 *
 * @param userStoreId - User store id.
 * @param userStoreManager - User store manager type.
 * @param shouldFetch - If true, will fetch the data.
 *
 * @returns the list of available connections of a user store.
 */
const useGetUserStoreAgentConnections = <Data = AgentConnectionInterface[], Error = RequestErrorInterface>(
    userStoreId: string,
    userStoreManager: RemoteUserStoreManagerType,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const url: string = userStoreManager === RemoteUserStoreManagerType.RemoteUserStoreManager
        ? `${store.getState().config.endpoints.remoteUserStoreAgentConnection}/${userStoreId}`
        : `${store.getState().config.endpoints.onPremUserStoreAgentConnection}/${userStoreId}`;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    const normalizedData: AgentConnectionInterface[] | undefined = Array.isArray(data)
        ? data.map(normalizeAgentConnection)
        : undefined;

    return {
        data: normalizedData as Data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetUserStoreAgentConnections;
