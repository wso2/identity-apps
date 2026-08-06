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
import { store } from "@wso2is/admin.core.v1/store";
import { HttpErrorResponseDataInterface, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { CertificatePatch, PresentationDefinition } from "../models/presentation-definitions";

const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Patch trusted CA certificates for a specific credential in a presentation definition.
 *
 * @param definitionId - The definition ID.
 * @param credentialId - The credential query ID to target.
 * @param patchRequest - Array of patch operations (ADD, REMOVE, REPLACE).
 * @returns Promise with the updated definition.
 */
export const patchTrustedCas = (
    definitionId: string,
    credentialId: string,
    patchRequest: CertificatePatch[]
): Promise<PresentationDefinition> => {
    const requestConfig: RequestConfigInterface = {
        data: patchRequest,
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.vpTemplates}/${definitionId}/trusted-cas?credential-id=${encodeURIComponent(credentialId)}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => Promise.resolve(response?.data))
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => Promise.reject(error));
};
