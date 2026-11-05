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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpErrorResponseDataInterface, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { WebhooksConstants } from "../constants/webhooks-constants";
import { WebhookPatchRequestInterface, WebhookResponseInterface } from "../models/webhooks";
import { getWebhooksEndpoint } from "../utils/api-version-utils";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Partially update a webhook, leaving every property the request omits as it is.
 *
 * @param webhookId - ID of the webhook to patch.
 * @param webhookData - Properties to change.
 * @returns Promise containing the response.
 * @throws Throws an IdentityAppsApiException if the request fails.
 */
const patchWebhook = (
    webhookId: string,
    webhookData: WebhookPatchRequestInterface
): Promise<WebhookResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        data: webhookData,
        headers: {
            Accept: "application/json",
            "Content-Type": WebhooksConstants.MERGE_PATCH_CONTENT_TYPE
        },
        method: HttpMethods.PATCH,
        url: `${getWebhooksEndpoint()}/${webhookId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    WebhooksConstants.ERROR_MESSAGES.PATCH_WEBHOOK_INVALID_STATUS_CODE,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data as WebhookResponseInterface);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default patchWebhook;
