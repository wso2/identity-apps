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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { HttpMethods } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import { SubscribedOrganizationListInterface } from "../models/webhooks";
import { getWebhooksEndpoint } from "../utils/api-version-utils";

/**
 * Maximum number of organizations the API returns per page.
 */
const ORGANIZATIONS_PAGE_SIZE: number = 500;

/**
 * Hook to get the child organizations currently receiving events for a webhook channel.
 *
 * The only representation of the subscribed organizations; the webhook and channel
 * representations report the policy and a link, never the list itself.
 *
 * @param webhookId - ID of the webhook.
 * @param channelId - ID of the subscribed channel.
 * @param shouldFetch - Whether the request should be issued.
 * @param limit - Maximum number of records to return.
 * @param offset - Number of records to skip.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetChannelOrganizations = <
    Data = SubscribedOrganizationListInterface,
    Error = RequestErrorInterface
>(
        webhookId: string,
        channelId: string,
        shouldFetch: boolean = true,
        limit: number = ORGANIZATIONS_PAGE_SIZE,
        offset: number = 0
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset
        },
        url: `${getWebhooksEndpoint()}/${webhookId}/channels/${channelId}/organizations`
    };

    const isFetchable: boolean = shouldFetch
        && !isEmpty(webhookId)
        && webhookId !== "new"
        && !isEmpty(channelId);

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        isFetchable ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetChannelOrganizations;
