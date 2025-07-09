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

import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import useGetFlowBuilderCoreResources from "@wso2is/admin.flow-builder-core.v1/api/use-get-flow-builder-core-resources";
import { Resources } from "@wso2is/admin.flow-builder-core.v1/models/resources";
import templates from "../data/templates.json";
import widgets from "../data/widgets.json";

/**
 * Hook to get the resources supported by the password recovery flow builder.
 * This hook will aggregate the core resources and the password recovery specific resources.
 *
 * This function calls the GET method of the following endpoint to get the resources.
 * - TODO: Fill this
 * For more details, refer to the documentation:
 * {@link https://TODO:<fillthis>)}
 *
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetPasswordRecoveryFlowBuilderResources = <Data = Resources, Error = RequestErrorInterface>(
    _shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const { data: coreResources } = useGetFlowBuilderCoreResources();

    return {
        data: ({
            ...coreResources,
            templates: [
                ...coreResources?.templates,
                ...templates
            ],
            widgets: [
                ...coreResources?.widgets,
                ...widgets
            ]
        } as unknown) as Data,
        error: null,
        isLoading: false,
        isValidating: false,
        mutate: () => null
    };
};

export default useGetPasswordRecoveryFlowBuilderResources;
