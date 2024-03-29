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
import { useSelector } from "react-redux";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin-core-v1/hooks/use-request";
import { AppState, store } from "../../admin-core-v1/store";
import { CONSOLE_BASE_URL_PLACEHOLDER } from "../constants/application-templates";
import { ApplicationTemplateListInterface } from "../models/application-templates";

/**
 * Hook to fetches the application templates from the API.
 *
 * @returns A promise containing the response.
 */
const useGetApplicationTemplates = <
    Data = ApplicationTemplateListInterface[],
    Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store?.getState()?.config?.endpoints?.applicationTemplates
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);
    const clientOrigin: string = useSelector((state: AppState) => state?.config?.deployment?.clientOrigin);
    const appBaseNameWithoutTenant: string = useSelector(
        (state: AppState) => state?.config?.deployment?.appBaseNameWithoutTenant
    );

    if (Array.isArray(data)) {
        for (const template of data) {
            if (template?.image?.includes(CONSOLE_BASE_URL_PLACEHOLDER)) {
                template.image = template.image.replace(
                    CONSOLE_BASE_URL_PLACEHOLDER,
                    `${clientOrigin}/${appBaseNameWithoutTenant}`
                );
            }
        }
    }

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

export default useGetApplicationTemplates;
