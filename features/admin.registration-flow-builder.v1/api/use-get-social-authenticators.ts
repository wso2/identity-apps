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

import { useGetAuthenticators } from "@wso2is/admin.connections.v1/api/authenticators";
import { AuthenticatorInterface, AuthenticatorLabels } from "@wso2is/admin.connections.v1/models/authenticators";
import { RequestErrorInterface, RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";

/**
 * Hook to get the list of social authenticators.
 *
 * This function calls the GET method of the following endpoint.
 * - `https://{serverUrl}/t/{tenantDomain}/server/v1/authenticators?filter=(tag+eq+Social-Login)`
 * For more details, refer to the documentation:
 * {@link https://is.docs.wso2.com/en/latest/apis/authenticators-rest-api/}
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetSocialAuthenticators = <Data = AuthenticatorInterface[], Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const {
        data,
        isLoading,
        isValidating,
        error,
        mutate
    } = useGetAuthenticators<Data, Error>(`(tag eq ${AuthenticatorLabels.SOCIAL})`, shouldFetch);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetSocialAuthenticators;
