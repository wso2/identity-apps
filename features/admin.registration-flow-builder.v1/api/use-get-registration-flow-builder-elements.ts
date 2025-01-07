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

import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import useGetFlowBuilderCoreElements from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-builder-core-elements";
import { Elements } from "@wso2is/admin.flow-builder-core.v1/models/elements";
import templates from "../data/templates.json";
import widgets from "../data/widgets.json";

/**
 * Hook to get the elements supported by the registration flow builder.
 * This hook will aggregate the core elements and the registration specific elements.
 *
 * This function calls the GET method of the following endpoint to get the elements.
 * - TODO: Fill this
 * For more details, refer to the documentation:
 * {@link https://TODO:<fillthis>)}
 *
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetRegistrationFlowBuilderElements = <Data = Elements, Error = RequestErrorInterface>(
    _shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { data: coreElements } = useGetFlowBuilderCoreElements();

    return {
        data: ({
            ...coreElements,
            templates: [
                ...coreElements?.templates,
                ...templates
            ],
            widgets: [
                ...coreElements?.widgets,
                ...widgets
            ]
        } as unknown) as Data,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: () => null
    };
};

export default useGetRegistrationFlowBuilderElements;
