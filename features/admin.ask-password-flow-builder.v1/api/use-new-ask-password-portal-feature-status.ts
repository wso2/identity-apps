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

import {
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import useGovernanceConnector from "@wso2is/admin.server-configurations.v1/api/user-governance-connector";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import AskPasswordFlowBuilderConstants from "../constants/ask-password-flow-builder-constants";

/**
 * Hook to check if the new dynamic Password Recovery portal is enabled or disabled.
 *
 * This function calls the GET method of the following endpoint.
 * - `https://{serverUrl}/t/{tenantDomain}/api/server/v1/identity-governance/{categoryId}/connectors/{connectorId}`
 * For more details, refer to the documentation:
 * {@link https://is.docs.wso2.com/en/latest/apis/identity-governance-rest-api/}
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useNewAskPasswordPortalFeatureStatus = <Data = boolean, Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { data, error, isLoading, isValidating, mutate } = useGovernanceConnector(
        ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID,
        ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID,
        shouldFetch
    );

    const status: boolean = data?.properties?.find(
        (prop: { name: string }) => prop.name === AskPasswordFlowBuilderConstants.FLOW_BUILDER_STATUS_CONFIG_KEY
    )?.value === "true";

    return {
        data: status as Data,
        error: error as any,
        isLoading,
        isValidating,
        mutate: mutate as any
    };
};

export default useNewAskPasswordPortalFeatureStatus;
