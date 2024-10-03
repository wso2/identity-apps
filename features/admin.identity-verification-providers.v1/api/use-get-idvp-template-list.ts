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

import { ConnectionTemplateInterface } from "@wso2is/admin.connections.v1/models/connection";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { AcceptHeaderValues, HttpMethods } from "@wso2is/core/models";

export const useGetIdVPTemplateList = <
    Data = ConnectionTemplateInterface[], Error = RequestErrorInterface
>(shouldFetch: boolean = true): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.IDVPExtensionEndpoint
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null
    );

    if (Array.isArray(data)) {
        data.sort(
            (template1: ConnectionTemplateInterface, template2: ConnectionTemplateInterface) =>
                template1?.displayOrder - template2?.displayOrder
        );
    }

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};
