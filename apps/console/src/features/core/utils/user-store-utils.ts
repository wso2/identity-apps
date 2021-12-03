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
 */

import { getUserStoreList } from "@wso2is/core/api";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import isEmpty from "lodash-es/isEmpty";
import { UserStoreProperty } from "../../userstores/models";
import { getAUserStore, getPrimaryUserStore } from "../api";
import { SharedUserStoreConstants } from "../constants";
import { UserStoreDetails } from "../models";
import { store } from "../store";

/**
 * Utility class for common user store operations.
 */
export class SharedUserStoreUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * The following method get the username regEx for the selected user store.
     *
     * @param userstore
     * @param regExName
     */
    public static async getUserStoreRegEx(userstore: string, regExName: string): Promise<string> {
        let usernameRegEx: UserStoreProperty = null;

        return getUserStoreList()
            .then((response) => {
                const store = response.data.find(item => item.name === userstore);

                if (!isEmpty(store)) {
                    return getAUserStore(store.id)
                        .then((resp) => {
                            usernameRegEx = resp.properties.find(property => property.name === regExName);

                            return usernameRegEx?.value;
                        });
                }
            });
    }

    /**
     * The following method validate user input against the user store regEx.
     *
     * @param inputValue
     * @param regExValue
     */
    public static validateInputAgainstRegEx(inputValue: string, regExValue: string): boolean {
        const regEx = new RegExp(regExValue);

        return regEx.test(inputValue);
    }

    /**
     * The following method fetch the user store ids list.
     */
    public static async getUserStoreIds(): Promise<string[]> {
        const userStoreIds: string[] = [];

        return getUserStoreList().then((response) => {
            response.data.map((userStore) => {
                userStoreIds.push(userStore.id);
            });

            return userStoreIds;
        });
    }

    /**
     * The following method will fetch the primary user store details.
     */
    public static async getPrimaryUserStore(): Promise<void | UserStoreDetails> {
        return getPrimaryUserStore().then((response) => {
            return response;
        }).catch(() => {
            store.dispatch(addAlert({
                description: I18n.instance.t("console:develop.features.userstores.notifications.fetchUserstores." +
                    "genericError.description"),
                level: AlertLevels.INFO,
                message: I18n.instance.t("console:develop.features.userstores.notifications.fetchUserstores." + 
                    "genericError.message")
            }));
        });
    }

    /**
     * The following method fetch the readonly user stores list.
     */
    public static async getReadOnlyUserStores(): Promise<string[]> {
        const ids = await SharedUserStoreUtils.getUserStoreIds();
        const primaryUserStore = await SharedUserStoreUtils.getPrimaryUserStore();
        const readOnlyUserStores: string[] = [];

        // Checks if the primary user store is readonly as well.
        if ( primaryUserStore && primaryUserStore.properties.find(property => { 
            return property.name === SharedUserStoreConstants.READONLY_USER_STORE; }).value === "true"
        ) {
            readOnlyUserStores.push(primaryUserStore.name.toUpperCase());
        }

        for (const id of ids) {
            await getAUserStore(id)
                .then((res) => {
                    res.properties.map((property: UserStoreProperty) => {
                        if (property.name === SharedUserStoreConstants.READONLY_USER_STORE
                            && property.value === "true") {
                            readOnlyUserStores.push(res.name.toUpperCase());
                        }
                    });
                });
        }

        return readOnlyUserStores;
    }
}
