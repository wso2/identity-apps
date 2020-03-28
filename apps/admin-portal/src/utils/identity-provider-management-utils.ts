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

import {
    AuthProtocolMetaListItemInterface,
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorMetaInterface
} from "../models";
import {getFederatedAuthenticatorsList} from "../api";
import _ from "lodash";
import {store} from "../store";
import {addAlert} from "@wso2is/core/store";
import {AlertLevels} from "@wso2is/core/models";
import {setAvailableAuthenticatorsMeta} from "../store/actions/IdentityProvider";

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
    private constructor() {
    }

    /**
     * Gets the list of available authenticator list and sets them in the redux store.
     *
     * @param {AuthProtocolMetaListItemInterface[]} meta - Meta data to filter.
     */
    public static getAuthenticators(): Promise<void> {
        return getFederatedAuthenticatorsList()
            .then((response) => {
                store.dispatch(
                    setAvailableAuthenticatorsMeta(response)
                );
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                    return;
                }
                store.dispatch(addAlert({
                    description: "An error occurred retrieving the available authenticators.",
                    level: AlertLevels.ERROR,
                    message: "Retrieval error"
                }));
            });
    }
}
