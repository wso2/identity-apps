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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { LogType } from "../models/remote-log-publishing";

/**
 * Hook to get the remote log publishing configurations.
 *
 * @param shouldFetch - Should fetch the configurations.
 * @param logType - Log type to test.
 * @returns remote log publishing configurations.
 */
const useTestRemoteLogPublishingConfiguration = <
    Error = RequestErrorInterface
>(
        shouldFetch: boolean = true,
        logType: LogType
    ): RequestResultInterface<Error> => {
    const requestConfig: RequestConfigInterface = {
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.remoteLogging}/${logType}/test`
    };

    const { data, error, isValidating, mutate } =
        useRequest<Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: isValidating && !error,
        isValidating,
        mutate: mutate
    };
};

export default useTestRemoteLogPublishingConfiguration;
