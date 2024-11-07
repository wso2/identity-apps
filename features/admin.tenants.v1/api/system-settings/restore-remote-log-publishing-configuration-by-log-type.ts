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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { I18n } from "@wso2is/i18n";
import { AxiosError, AxiosResponse } from "axios";
import { LogType } from "../../models/system-settings/remote-log-publishing";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Restore remote log publishing configurations.
 *
 * @param logType - Log type.
 * @returns a promise containing the response.
 */
const restoreRemoteLogPublishingConfigurationByLogType = (logType: LogType): Promise<AxiosResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.remoteLogging}/${logType}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                I18n.instance.t("console:manage.features.serverConfigs.remoteLogPublishing.errors.genericError"),
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default restoreRemoteLogPublishingConfigurationByLogType;
