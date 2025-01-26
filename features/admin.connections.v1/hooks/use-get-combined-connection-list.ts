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
import { AuthenticatorExtensionsConfigInterface } from "@wso2is/admin.extensions.v1/configs/models";
import {
    useGetIdentityVerificationProviderList
} from "@wso2is/admin.identity-verification-providers.v1/api/use-get-idvp-list";
import {
    IdVPTemplateTags
} from "@wso2is/admin.identity-verification-providers.v1/models/identity-verification-providers";
import { AxiosError } from "axios";
import get from "lodash-es/get";
import { useGetAuthenticators } from "../api/authenticators";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import { AuthenticatorLabels, AuthenticatorTypes } from "../models/authenticators";
import { ConnectionInterface, ConnectionTypes, CustomAuthConnectionInterface } from "../models/connection";
import { ConnectionsManagementUtils } from "../utils/connection-utils";

/**
 * Interface for the search inputs.
 */
export interface SearchInputsInterface {
    /**
     * List of selected filters.
     */
    filterTags: string[];
    /**
     * Search query.
     * Example: "name+sw+Google"
     */
    searchQuery: string;
};

/**
 * Fetch the combined list of connections.
 * - Authenticators
 * - Identity Providers
 * - Identity Verification Providers
 *
 * @param limit - Limit for pagination.
 * @param offset - Offset for pagination.
 * @param searchInputs - Search inputs.
 * @param shouldFetchAuthenticators - Should fetch authenticators.
 * @param shouldFetchIdVPs - Should fetch identity verification providers.
 *
 * @returns The fetched and filtered connections list.
 */
export const useGetCombinedConnectionList = <Data = ConnectionInterface[], Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    searchInputs?: SearchInputsInterface,
    shouldFetchAuthenticators: boolean = true,
    shouldFetchIdVPs: boolean = true
): Omit<RequestResultInterface<Data, Error>, "mutate"> & { mutate: () => void } => {

    const {
        data: fetchedAuthenticatorsList,
        isLoading: isAuthenticatorsFetchRequestLoading,
        isValidating: isAuthenticatorsFetchRequestValidating,
        error: authenticatorsFetchRequestError,
        mutate: mutateAuthenticatorsFetchRequest
    } = useGetAuthenticators(
        ConnectionsManagementUtils.buildConnectionsFilterQuery(searchInputs?.searchQuery, searchInputs?.filterTags),
        shouldFetchAuthenticators && offset === 0
    );

    // IdVPs API does not support filtering with tags. Hence, we need to treat it separately.
    const shouldFilterIdVPs = (): boolean => {
        if (!searchInputs?.filterTags || searchInputs.filterTags.length === 0) {
            return true;
        }

        return searchInputs.filterTags.includes(IdVPTemplateTags.IDENTITY_VERIFICATION);
    };

    const {
        data: fetchedIdVPsListResponse,
        isLoading: isIdVPListFetchRequestLoading,
        isValidating: isIdVPListFetchRequestValidating,
        error: idVPListFetchRequestError,
        mutate: mutateIdVPListFetchRequest
    } = useGetIdentityVerificationProviderList(
        limit,
        offset,
        ConnectionsManagementUtils.buildConnectionsFilterQuery(searchInputs?.searchQuery, []),
        shouldFetchIdVPs && shouldFilterIdVPs()
    );

    const combinedData: ConnectionInterface[] = [];

    /**
     * Check if the authenticator is a custom authenticator.
     *
     * @param authenticator - Authenticator to evaluate.
     * @returns - `true` if the authenticator is a custom authenticator.
     */
    const IsCustomAuthenticator = (authenticator: ConnectionInterface) => {
        const tags: string[] = (authenticator as CustomAuthConnectionInterface)?.tags ?? [];
        const isCustom: boolean = tags.some((tag: string) => tag === AuthenticatorLabels.CUSTOM);

        return isCustom;
    };

    if (!isAuthenticatorsFetchRequestLoading && !isIdVPListFetchRequestLoading) {

        // Add Local Authenticators to the beginning of the list.
        for (const authenticator of fetchedAuthenticatorsList) {
            const authenticatorConfig: AuthenticatorExtensionsConfigInterface = get(
                AuthenticatorMeta.getAuthenticators(),
                authenticator.id
            );

            // If authenticator is configurable, evaluate...
            if (authenticatorConfig && authenticatorConfig.isEnabled) {
                // If configurations are not available for the moment, push to the end of the array.
                if (authenticatorConfig.isComingSoon) {
                    combinedData.push(authenticator);

                    return;
                }

                // If configs are available, keep at the beginning of array.
                combinedData.unshift(authenticator);
            }
        }

        // Add Federated Authenticators to the list.
        combinedData.push(...(fetchedAuthenticatorsList
            .filter((authenticator: ConnectionInterface) => (
                authenticator.type === AuthenticatorTypes.FEDERATED
            ))
        ));

        // Add Custom Local Authenticators to the list.
        combinedData.push(...(fetchedAuthenticatorsList
            .filter((authenticator: ConnectionInterface) => (
                authenticator.type === AuthenticatorTypes.LOCAL && IsCustomAuthenticator(authenticator)
            ))
        ));

        if (fetchedIdVPsListResponse?.identityVerificationProviders) {
            // Manipulate the IdVPs list to match the UI.
            for (const idVP of fetchedIdVPsListResponse.identityVerificationProviders) {
                combinedData.push( {
                    ...idVP,
                    tags: [ IdVPTemplateTags.IDENTITY_VERIFICATION ],
                    type: ConnectionTypes.IDVP
                } as ConnectionInterface);
            }
        }
    }

    return {
        data: combinedData as Data,
        error: authenticatorsFetchRequestError as AxiosError<Error>
            || idVPListFetchRequestError as AxiosError<Error>,
        isLoading: isAuthenticatorsFetchRequestLoading
            || isIdVPListFetchRequestLoading,
        isValidating: isAuthenticatorsFetchRequestValidating
            || isIdVPListFetchRequestValidating,
        mutate: () => {
            mutateAuthenticatorsFetchRequest();
            mutateIdVPListFetchRequest();
        }
    };
};
