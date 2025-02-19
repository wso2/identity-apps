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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import useResourceEndpoints from "@wso2is/admin.core.v1/hooks/use-resource-endpoints";
import useUIConfig from "@wso2is/admin.core.v1/hooks/use-ui-configs";
import { HttpMethods } from "@wso2is/core/models";
import { CommonAuthenticatorConstants } from "../constants/common-authenticator-constants";
import { ConnectionTemplateInterface } from "../models/connection";
import { groupConnectionTemplates } from "../utils/connection-template-utils";

/**
 * Hook to get the connection template list with limit and offset.
 *
 * @param limit - Maximum Limit of the connection templates.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param shouldFetch - Whether the request should be fetched.
 * @param isLoginFlow - Whether the templates list is for login flow.
 *
 * @returns Requested connections.
 */
export const useGetConnectionTemplates = <Data = ConnectionTemplateInterface[], Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string,
    shouldFetch: boolean = true,
    isLoginFlow: boolean = false
): RequestResultInterface<Data, Error> => {

    const { resourceEndpoints } = useResourceEndpoints();
    const { UIConfig } = useUIConfig();

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: resourceEndpoints.extensions + "/connections"
    };

    const {
        data,
        error,
        isValidating,
        mutate,
        isLoading
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    let groupedConnectionTemplates: ConnectionTemplateInterface[] = undefined;

    if (data) {
        const hiddenConnectionTemplateIds: string[] = [
            CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.LINKEDIN,
            CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS
                .ORGANIZATION_ENTERPRISE_IDP,
            CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.ENTERPRISE,
            CommonAuthenticatorConstants.CONNECTION_TEMPLATE_IDS.CUSTOM_AUTHENTICATOR,
            ...(UIConfig?.hiddenConnectionTemplates || [])
        ];

        // Hide specific connection templates for login flow builder.
        if (isLoginFlow) {
            hiddenConnectionTemplateIds.push(CommonAuthenticatorConstants
                .CONNECTION_TEMPLATE_IDS.TRUSTED_TOKEN_ISSUER);
        }

        const fetchedConnectionTemplates: ConnectionTemplateInterface[] = data as ConnectionTemplateInterface[];

        // Filter out the hidden connection templates.
        const filteredData: ConnectionTemplateInterface[] = fetchedConnectionTemplates
            .filter((template: ConnectionTemplateInterface) => {
                return !hiddenConnectionTemplateIds.includes(template.id);
            });

        // Group the connection templates.
        groupedConnectionTemplates = groupConnectionTemplates(filteredData);

        // Sort the connection templates based on the display order.
        groupedConnectionTemplates.sort((a: ConnectionTemplateInterface, b: ConnectionTemplateInterface) => {
            return a.displayOrder - b.displayOrder;
        });
    }

    return {
        data: groupedConnectionTemplates as Data,
        error: error,
        isLoading,
        isValidating,
        mutate
    };
};
