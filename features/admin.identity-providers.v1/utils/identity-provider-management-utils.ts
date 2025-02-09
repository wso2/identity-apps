/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { getConnections } from "@wso2is/admin.connections.v1/api/connections";
import { ConnectionUIConstants } from "@wso2is/admin.connections.v1/constants/connection-ui-constants";
import { LocalAuthenticatorConstants } from "@wso2is/admin.connections.v1/constants/local-authenticator-constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import axios, { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import { getLocalAuthenticators } from "../api";
import { AuthenticatorMeta } from "../meta";
import {
    FederatedAuthenticatorInterface,
    FederatedAuthenticatorListItemInterface,
    GenericAuthenticatorInterface,
    IdentityProviderListResponseInterface,
    LocalAuthenticatorInterface,
    ProvisioningInterface,
    StrictIdentityProviderInterface
} from "../models";

/**
 * Utility class for identity provider operations.
 */
export class IdentityProviderManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * @deprecated
     * Modifies the federated and local authenticators to convert them to a more
     * generic model which will be easier to handle.
     *
     * @param skipFederated - Should skip loading federated authenticators.
     *
     * @returns Combined response as a Promise.
     */
    public static getAllAuthenticators(skipFederated?: boolean): Promise<GenericAuthenticatorInterface[][]> {

        // Loads the federated authenticators. ATM, the IDP listing API has a default pagination
        // limit of 15. Until there is a proper solution from the backend, we are continuously
        // fetching the items until the limit is reached.
        // TODO: Refactor this block once there is a solution from the APIs side.
        // Tracked here - https://github.com/wso2/product-is/issues/11913
        const loadFederatedAuthenticators = (): Promise<IdentityProviderListResponseInterface> => {

            let idp: IdentityProviderListResponseInterface = {};
            const limit: number = 15;
            let offset: number = 0;

            const getIdPs = ():Promise<IdentityProviderListResponseInterface> => {
                const attrs: string = "federatedAuthenticators,provisioning";

                return getConnections(limit, offset, "isEnabled eq \"true\"", attrs)
                    .then((response: IdentityProviderListResponseInterface) => {
                        if (!isEmpty(idp)) {
                            idp = {
                                ...idp,
                                identityProviders: [
                                    ...idp.identityProviders,
                                    ...response.identityProviders
                                ]
                            };
                        } else {
                            idp = { ...response };
                        }

                        // If there is a links section and that has a link to the next set of results, fetch again..
                        if (!isEmpty(response.links) && response.links[0].rel && response.links[0].rel === "next") {
                            offset = offset + limit;

                            return getIdPs();
                        } else {
                            return Promise.resolve(idp);
                        }
                    });
            };

            return getIdPs();
        };

        /**
         * Loads the set of Local authenticators in the system.
         * @returns Promise containing list of LocalAuthenticatorInterface.
         */
        const loadLocalAuthenticators = (): Promise<LocalAuthenticatorInterface[]> | any => {
            return getLocalAuthenticators();
        };

        /**
         * Combine the two promises.
         * @returns Promise containing list of LocalAuthenticatorInterface.
         */
        const getPromises = (): (Promise<LocalAuthenticatorInterface[]> | any)[] => {

            if (skipFederated) {
                return [ loadLocalAuthenticators() ];
            }

            return [ loadLocalAuthenticators(), loadFederatedAuthenticators() ];
        };

        /**
         * Check if the authenticator is a custom local authenticator.
         *
         * Currently authenticator id is being used to fetch the respective authenticator data from the meta content.
         * The existing approach cannot be used for custom authenticators since the id and the name of
         * custom authenticators are not pre defined. Therefore, if the authenticator is a custom authenticator,
         * then the respective details will be resolved from the API.
         *
         * @param authenticator - Authenticator to be checked.
         * @returns whether the authenticator is a custom local authenticator or not.
         */
        const isCustomLocalAuthenticator = (authenticator: LocalAuthenticatorInterface): boolean => {
            return authenticator?.tags?.includes("Custom");
        };

        return axios.all(getPromises())
            .then(axios.spread((local: LocalAuthenticatorInterface[],
                federated: IdentityProviderListResponseInterface) => {

                const localAuthenticators: GenericAuthenticatorInterface[] = [];

                local.forEach((authenticator: LocalAuthenticatorInterface) => {
                    if (!authenticator.isEnabled) {
                        return;
                    }

                    localAuthenticators.push({
                        authenticators: [
                            {
                                authenticatorId: authenticator.id,
                                isEnabled: authenticator.isEnabled,
                                name: authenticator.name
                            }
                        ],
                        defaultAuthenticator: {
                            authenticatorId: authenticator.id,
                            isEnabled: authenticator.isEnabled,
                            name: authenticator.name,
                            tags: authenticator.tags
                                ? authenticator.tags
                                : []
                        },
                        description: isCustomLocalAuthenticator(authenticator) ?
                            authenticator?.description :
                            AuthenticatorMeta.getAuthenticatorDescription(authenticator.id),
                        displayName: authenticator.displayName,
                        id: authenticator.id,
                        idp: LocalAuthenticatorConstants.LOCAL_IDP_IDENTIFIER,
                        image: isCustomLocalAuthenticator(authenticator) ?
                            AuthenticatorMeta.getCustomAuthenticatorIcon() :
                            AuthenticatorMeta.getAuthenticatorIcon(authenticator.id),
                        isEnabled: authenticator.isEnabled,
                        name: authenticator.name
                    });
                });

                const federatedAuthenticators: GenericAuthenticatorInterface[] = [];

                if (federated?.identityProviders
                    && federated.identityProviders instanceof Array
                    && federated.identityProviders.length > 0) {

                    federated.identityProviders.forEach((authenticator: StrictIdentityProviderInterface) => {

                        if (isEmpty(authenticator?.federatedAuthenticators?.authenticators)
                            || !authenticator?.federatedAuthenticators?.defaultAuthenticatorId) {

                            return;
                        }

                        const defaultAuthenticator: FederatedAuthenticatorInterface = authenticator
                            .federatedAuthenticators
                            .authenticators
                            .find((item: FederatedAuthenticatorListItemInterface) => {
                                return (item.authenticatorId ===
                                    authenticator.federatedAuthenticators.defaultAuthenticatorId);
                            });

                        federatedAuthenticators.push({
                            authenticators: authenticator.federatedAuthenticators.authenticators,
                            defaultAuthenticator: defaultAuthenticator,
                            description: !isEmpty(authenticator.description)
                                ? authenticator.description
                                : AuthenticatorMeta.getAuthenticatorDescription(
                                    defaultAuthenticator?.authenticatorId),
                            displayName: authenticator.name,
                            id: authenticator.id,
                            idp: authenticator.name,
                            image: authenticator.image
                                ? authenticator.image
                                : AuthenticatorMeta.getAuthenticatorIcon(authenticator.id),
                            isEnabled: authenticator.isEnabled,
                            name: authenticator.name,
                            provisioning: authenticator[ "provisioning" ] as ProvisioningInterface
                        } as any);
                    });

                }

                return Promise.resolve([ localAuthenticators, federatedAuthenticators ]);
            }))
            .catch((error: AxiosError) => {
                throw new IdentityAppsApiException(
                    ConnectionUIConstants.ERROR_MESSAGES.COMBINED_AUTHENTICATOR_FETCH_ERROR,
                    error.stack,
                    error.code,
                    error.request,
                    error.response,
                    error.config);
            });
    }
}
