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
import { ImageUtils, URLUtils } from "@wso2is/core/utils";
import { I18n } from "@wso2is/i18n";
import axios from "axios";
import camelCase from "lodash-es/camelCase";
import isEmpty from "lodash-es/isEmpty";
import { identityProviderConfig } from "../../../extensions";
import { DocPanelUICardInterface, store } from "../../core";
import { getFederatedAuthenticatorsList, getIdentityProviderList, getLocalAuthenticators } from "../api";
import { getSelectedFederatedAuthenticators, getSelectedLocalAuthenticators } from "../components";
import { getAuthenticatorIcons } from "../configs";
import { IdentityProviderManagementConstants } from "../constants";
import { AuthenticatorMeta } from "../meta";
import {
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    IdentityProviderListResponseInterface,
    LocalAuthenticatorInterface,
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
                    store.dispatch(
                        addAlert({
                            description: I18n.instance.t(
                                "console:develop.features.authenticationProvider.notifications." +
                                    "getFederatedAuthenticatorsList.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: I18n.instance.t(
                                "console:develop.features.authenticationProvider.notifications." +
                                    "getFederatedAuthenticatorsList.error.message"
                            )
                        })
                    );

                    return;
                }

                store.dispatch(
                    addAlert({
                        description: I18n.instance.t(
                            "console:develop.features.authenticationProvider.notifications." +
                                "getFederatedAuthenticatorsList.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t(
                            "console:develop.features.authenticationProvider.notifications." +
                                "getFederatedAuthenticatorsList.genericError.message"
                        )
                    })
                );
            });
    }

    /**
     * Modifies the federated and local authenticators to convert them to a more
     * generic model which will be easier to handle.
     *
     * @return {Promise<GenericAuthenticatorInterface[][]>} Combined response as a Promise.
     */
    public static getAllAuthenticators(): Promise<GenericAuthenticatorInterface[][]> {

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

                return getIdentityProviderList(limit, offset, "isEnabled eq \"true\"", "federatedAuthenticators")
                    .then((response) => {
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

                    if (identityProviderConfig.utils.isAuthenticatorAllowed(authenticator.name)) {
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
                        description: AuthenticatorMeta.getAuthenticatorDescription(authenticator.id),
                        displayName: authenticator.displayName,
                        id: `${ IdentityProviderManagementConstants.LOCAL_IDP_IDENTIFIER }-${ authenticator.id }`,
                        idp: IdentityProviderManagementConstants.LOCAL_IDP_IDENTIFIER,
                        image: AuthenticatorMeta.getAuthenticatorIcon(authenticator.id),
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
                            .find((item) => {
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
                image: camelCase(key).toLowerCase(),
                name: camelCase(key).toLowerCase()
            });
        }

        return templates;
    };

    /**
     * Get the labels for a particular authenticator.
     *
     * @param {GenericAuthenticatorInterface} authenticator - Authenticator.
     *
     * @return {string[]}
     */
    public static getAuthenticatorLabels(authenticator: GenericAuthenticatorInterface): string[] {

        return AuthenticatorMeta.getAuthenticatorLabels(authenticator.defaultAuthenticator.authenticatorId)
            ? AuthenticatorMeta.getAuthenticatorLabels(authenticator.defaultAuthenticator.authenticatorId)
            : [];
    }

    /**
     * Get the Authenticator label display name.
     *
     * @param {string} name - Raw name.
     *
     * @return {string}
     */
    public static getAuthenticatorLabelDisplayName(name: string): string {

        return name;
    }

    /**
     * Checks if the template image URL is a valid image URL and if not checks if it's
     * available in the passed in icon set.
     *
     * @param image Input image.
     *
     * @return Predefined image if available. If not, return input parameter.
     */
    public static resolveTemplateImage(image: string | any, icons: Record<string, any>): string | any {

        if (image) {
            if (typeof image !== "string") {
                return image;
            }

            if ((URLUtils.isHttpsUrl(image) || URLUtils.isHttpUrl(image)) && ImageUtils.isValidImageExtension(image)) {
                return image;
            }

            if (URLUtils.isDataUrl(image)) {
                return image;
            }

            if (!icons) {
                return image;
            }
        }
        const match = Object.keys(icons).find(key => key.toString() === image);

        return match ? icons[ match ] : icons[ "default" ] ?? image;
    }
}
