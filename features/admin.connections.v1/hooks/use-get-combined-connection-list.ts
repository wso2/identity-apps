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
import { useGetConnections } from "../api/connections";
import { AuthenticatorMeta } from "../meta/authenticator-meta";
import { ConnectionInterface, ConnectionTypes } from "../models/connection";
import { ConnectionsManagementUtils } from "../utils/connection-utils";

export const useGetCombinedConnectionList = <Data = ConnectionInterface[], Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string,
    filterAuthenticatorsOnly?: boolean
): Omit<RequestResultInterface<Data, Error>, "mutate"> & { mutate: () => void } => {

    const {
        data: fetchedAuthenticatorsList,
        isLoading: isAuthenticatorsFetchRequestLoading,
        isValidating: isAuthenticatorsFetchRequestValidating,
        error: authenticatorsFetchRequestError,
        mutate: mutateAuthenticatorsFetchRequest
    } = useGetAuthenticators(
        filter,
        offset === 0
    );

    const {
        data: fetchedConnectionsListResponse,
        isLoading: isConnectionsFetchRequestLoading,
        isValidating: isConnectionsFetchRequestValidating,
        error: connectionsFetchRequestError,
        mutate: mutateConnectionsFetchRequest
    } = useGetConnections(
        limit,
        offset,
        filter,
        "federatedAuthenticators",
        !filterAuthenticatorsOnly,
        filterAuthenticatorsOnly
    );

    const {
        data: fetchedIdVPsListResponse,
        isLoading: isIdVPListFetchRequestLoading,
        isValidating: isIdVPListFetchRequestValidating,
        error: idVPListFetchRequestError,
        mutate: mutateIdVPListFetchRequest
    } = useGetIdentityVerificationProviderList(
        limit,
        offset
    );

    const combinedData: ConnectionInterface[] = [];

    if (!isAuthenticatorsFetchRequestLoading && !isConnectionsFetchRequestLoading && !isIdVPListFetchRequestLoading) {

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

        if (fetchedConnectionsListResponse.identityProviders) {
            for (const idp of fetchedConnectionsListResponse.identityProviders) {
                combinedData.push( {
                    ...idp,
                    tags: ConnectionsManagementUtils
                        .resolveConnectionTags((idp as ConnectionInterface).federatedAuthenticators)
                } as ConnectionInterface);
            }
        }

        if (fetchedIdVPsListResponse.identityVerificationProviders) {
            // TODO: Remove this once the tags are added to the identity verification providers.
            for (const idVP of fetchedIdVPsListResponse.identityVerificationProviders) {
                combinedData.push( {
                    ...idVP,
                    tags: [ IdVPTemplateTags.IDENTITY_VERIFICATION ],
                    type: ConnectionTypes.IDVP,
                    image: "https://raw.githubusercontent.com/wso2-extensions/identity-verification-onfido/main/ui-metadata/images/onfido-icon.png"
                } as ConnectionInterface);
            }
        }
    }


    return {
        data: combinedData as Data,
        error: authenticatorsFetchRequestError as AxiosError<Error>
            || connectionsFetchRequestError as AxiosError<Error>
            || idVPListFetchRequestError as AxiosError<Error>,
        isLoading: isAuthenticatorsFetchRequestLoading
            || isConnectionsFetchRequestLoading
            || isIdVPListFetchRequestLoading,
        isValidating: isAuthenticatorsFetchRequestValidating
            || isConnectionsFetchRequestValidating
            || isIdVPListFetchRequestValidating,
        mutate: () => {
            mutateAuthenticatorsFetchRequest();
            mutateConnectionsFetchRequest();
            mutateIdVPListFetchRequest();
        }
    };
};
