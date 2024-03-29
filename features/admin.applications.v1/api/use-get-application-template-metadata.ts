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

import { HttpMethods } from "@wso2is/core/models";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin-core-v1/hooks/use-request";
import { store } from "../../admin-core-v1/store";
import {
    ApplicationTemplateMetadataInterface
} from "../models/application-templates";

/**
 * Hook to fetches the application template metadata from the API.
 *
 * @param id - The id of the application template.
 * @returns A promise containing the response.
 */
const useGetApplicationTemplateMetadata = <Data = ApplicationTemplateMetadataInterface, Error = RequestErrorInterface>(
    id: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store?.getState()?.config?.endpoints?.applicationTemplateMetadata?.replace("{{id}}", id)
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export default useGetApplicationTemplateMetadata;
