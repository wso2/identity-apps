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
import { HttpMethods,
    HttpErrorResponseDataInterface
} from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import type { CDSConfig, CDSConfigUpdateRequest, CDSServerConfigInterface } from "../models/config";
import { isCDSServerConfigEnabled } from "../utils/ui-mode-utils";

/**
 * Initialize an Http client.
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * PATCH /cds/api/v1/config
 * Update the CDS configuration
 */
export const updateCDSConfig = (
    payload: Partial<CDSConfigUpdateRequest>
): Promise<CDSConfig> => {

    const requestConfig: RequestConfigInterface = {
        data: payload,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.cdsConfig
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update CDS configuration."));
            }

            return Promise.resolve(response.data as CDSConfig);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            return Promise.reject(error);
        });
};

/**
 * PATCH /api/server/v1/configs/cds
 * Update the CDS status of the organization in the Identity Server. The Identity Server sends the status
 * to CDS before it stores the status.
 *
 * @param enabled - The new CDS status.
 * @returns The CDS status that the Identity Server stored.
 */
export const updateCDSServerConfig = (enabled: boolean): Promise<CDSServerConfigInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: { enabled },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.cdsServerConfig
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update the CDS status."));
            }

            return Promise.resolve(response.data as CDSServerConfigInterface);
        })
        .catch((error: AxiosError<HttpErrorResponseDataInterface>) => {
            return Promise.reject(error);
        });
};

/**
 * Enable or disable CDS and set the CDS system applications.
 *
 * When the server configuration API is enabled, the Identity Server gets the status first, and then CDS gets
 * the system applications. Else, CDS gets both in one request.
 *
 * @param enabled - The new CDS status.
 * @param systemApplications - The new list of CDS system application identifiers.
 * @returns A promise that resolves when both values are updated.
 */
export const updateCDSStatus = async (enabled: boolean, systemApplications: string[]): Promise<void> => {

    if (isCDSServerConfigEnabled()) {
        await updateCDSServerConfig(enabled);
        await updateCDSConfig({ system_applications: systemApplications });

        return;
    }

    await updateCDSConfig({
        cds_enabled: enabled,
        system_applications: systemApplications
    });
};
