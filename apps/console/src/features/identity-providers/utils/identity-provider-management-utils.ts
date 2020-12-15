/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 *
 */

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import axios from "axios";
import _ from "lodash";
import { DocPanelUICardInterface, store } from "../../core";
import { getFederatedAuthenticatorsList, getIdentityProviderList, getLocalAuthenticators } from "../api";
import { getSelectedFederatedAuthenticators, getSelectedLocalAuthenticators } from "../components";
import { getAuthenticatorIcons } from "../configs";
import { IdentityProviderManagementConstants } from "../constants";
import {
    GenericAuthenticatorInterface,
    IdentityProviderListResponseInterface,
    LocalAuthenticatorInterface,
    StrictGenericAuthenticatorInterface,
    StrictIdentityProviderInterface
} from "../models";
import { setAvailableAuthenticatorsMeta } from "../store/actions";

/**
 * Utility class for identity provider operations.
 */
export class IdentityProviderManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Gets the list of available authenticator list and sets them in the redux store.
     */
    public static getAuthenticators(): Promise<void> {
        return getFederatedAuthenticatorsList()
            .then((response): void => {
                store.dispatch(
                    setAvailableAuthenticatorsMeta(response)
                );
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: I18n.instance.t("console:develop.features.idp.notifications." +
                            "getFederatedAuthenticatorsList.error.description",
                            { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:develop.features.idp.notifications." +
                            "getFederatedAuthenticatorsList.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("console:develop.features.idp.notifications." +
                        "getFederatedAuthenticatorsList.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("console:develop.features.idp.notifications." +
                        "getFederatedAuthenticatorsList.genericError.message")
                }));
            });
    }

    /**
     * Modifies the federated and local authenticators to convert them to a more
     * generic model which will be easier to handle.
     *
     * @return {Promise<GenericAuthenticatorInterface[][]>} Combined response as a Promise.
     */
    public static getAllAuthenticators(): Promise<GenericAuthenticatorInterface[][]> {

        const loadFederatedAuthenticators = (): Promise<IdentityProviderListResponseInterface> => {
            return getIdentityProviderList(null, null, "isEnabled eq \"true\"", "federatedAuthenticators");
        };

        const loadLocalAuthenticators = (): Promise<LocalAuthenticatorInterface[]> | any => {
            return getLocalAuthenticators();
        };

        return axios.all([ loadLocalAuthenticators(), loadFederatedAuthenticators() ])
            .then(axios.spread((local: LocalAuthenticatorInterface[],
                                          federated: IdentityProviderListResponseInterface) => {

                const localAuthenticators: GenericAuthenticatorInterface[] = [];

                local.forEach((authenticator: LocalAuthenticatorInterface) => {
                    if (!authenticator.isEnabled) {
                        return;
                    }

                    if (
                        authenticator.name ===
                            IdentityProviderManagementConstants.BASIC_AUTH_REQUEST_PATH_AUTHENTICATOR ||
                        authenticator.name === IdentityProviderManagementConstants.OAUTH_REQUEST_PATH_AUTHENTICATOR
                    ) {
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
                            name: authenticator.name
                        },
                        displayName: authenticator.displayName,
                        id: `${ IdentityProviderManagementConstants.LOCAL_IDP_IDENTIFIER }-${ authenticator.id }`,
                        idp: IdentityProviderManagementConstants.LOCAL_IDP_IDENTIFIER,
                        image: this.findAuthenticatorIcon(getSelectedLocalAuthenticators(), authenticator.id,
                            authenticator.name),
                        isEnabled: authenticator.isEnabled,
                        name: authenticator.name
                    });
                });

                const federatedAuthenticators: GenericAuthenticatorInterface[] = [];

                if (federated?.identityProviders
                    && federated.identityProviders instanceof Array
                    && federated.identityProviders.length > 0) {

                    federated.identityProviders.forEach((authenticator: StrictIdentityProviderInterface) => {

                        if (_.isEmpty(authenticator?.federatedAuthenticators?.authenticators)
                            || !authenticator?.federatedAuthenticators?.defaultAuthenticatorId) {

                            return;
                        }

                        federatedAuthenticators.push({
                            authenticators: authenticator.federatedAuthenticators.authenticators,
                            defaultAuthenticator: authenticator.federatedAuthenticators.authenticators
                                .find((item) => item.authenticatorId ===
                                    authenticator.federatedAuthenticators.defaultAuthenticatorId),
                            displayName: authenticator.name,
                            id: authenticator.id,
                            idp: authenticator.name,
                            image: authenticator.image
                                ? authenticator.image
                                : this.findAuthenticatorIcon(getSelectedFederatedAuthenticators(), authenticator.id,
                                    authenticator.name),
                            isEnabled: authenticator.isEnabled,
                            name: authenticator.name
                        });
                    });

                }

                return Promise.resolve([ localAuthenticators, federatedAuthenticators ]);
            }))
            .catch((error) => {
                throw new IdentityAppsApiException(
                    IdentityProviderManagementConstants.COMBINED_AUTHENTICATOR_FETCH_ERROR,
                    error.stack,
                    error.code,
                    error.request,
                    error.response,
                    error.config);
            });
    }

    /**
     * Resolves the icon for an authenticator.
     *
     * @param {StrictGenericAuthenticatorInterface[]} meta - Internal metadata.
     * @param {string} id - Id of the authenticator.
     * @param {string} name - Name of the authenticator.
     *
     * @return {any} Resolved image.
     */
    public static findAuthenticatorIcon(meta: StrictGenericAuthenticatorInterface[], id: string, name: string): any {

        if (!(id || name)) {
            return getAuthenticatorIcons().default;
        }

        const found: StrictGenericAuthenticatorInterface = meta.find((item) => {
            if (item.id === id) {
                return true;
            }

            if (item.name === name) {
                return true;
            }
        });

        if (found && found.image) {
            return found.image;
        }

        return getAuthenticatorIcons().default;
    }

    /**
     * Generate IDP template docs for the help panel.
     *
     * @param {object} raw  - Object with IDP template and corresponding docs links.
     *
     * @return {DocPanelUICardInterface[]} Generated docs.
     */
    public static generateIDPTemplateDocs = (raw: object): DocPanelUICardInterface[] => {
        if (typeof raw !== "object") {
            return [];
        }

        const templates: DocPanelUICardInterface[] = [];

        for (const [ key, value ] of Object.entries(raw)) {
            templates.push({
                displayName: key,
                docs: value.toString(),
                image: _.camelCase(key).toLowerCase(),
                name: _.camelCase(key).toLowerCase()
            });
        }

        return templates;
    };
}
