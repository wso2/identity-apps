/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { getAUserStore } from "@wso2is/admin.core.v1/api";
import { SharedUserStoreConstants } from "@wso2is/admin.core.v1/constants";
import { getUserStoreList } from "@wso2is/admin.userstores.v1/api";
import { UserStoreListItem, UserStorePostData, UserStoreProperty } from "@wso2is/admin.userstores.v1/models";
import { AxiosResponse } from "axios";

/**
 * Utility class for common user store operations.
 */
export class UserStoreUtils {

    private static primaryUserStore:string = "PRIMARY";

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * The following method fetch the user store ids list.
     *
     * @param userstores - Externally provided usertores list.
     * @returns userstores list
     */
    public static async getUserStoreIds(userstores?: UserStoreListItem[]): Promise<string[] | void> {

        const getIds = (userstoresList: UserStoreListItem[]): string[] => {
            const userStoreIds: string[] = userstoresList.map((userStore: UserStoreListItem) => userStore.id);

            return userStoreIds;
        };

        if (userstores) {
            return getIds(userstores);
        }

        return getUserStoreList()
            .then((response: AxiosResponse<UserStoreListItem[]>) => {
                return getIds(response.data);
            })
            .catch(() => {
                // Add debug logs here one a logger is added.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            });
    }

    /**
     * The following method fetch the readonly user stores list.
     *
     * @param userstores - Externally provided usertores list.
     */
    public static async getReadOnlyUserStores(userstores?: UserStoreListItem[]): Promise<string[]> {
        const ids: string[] = await UserStoreUtils.getUserStoreIds(userstores) as string[];
        const readOnlyUserStores: string[] = [];

        readOnlyUserStores.push(UserStoreUtils.primaryUserStore);

        ids.forEach((id: string) => {
            getAUserStore(id)
                .then((res: UserStorePostData) => {
                    res.properties.forEach((property: UserStoreProperty) => {
                        if (property.name === SharedUserStoreConstants.READONLY_USER_STORE
                            && property.value === "true") {
                            readOnlyUserStores.push(res.name.toUpperCase());
                        }
                    });
                }).catch(() => {
                    // Add debug logs here one a logger is added.
                    // Tracked here https://github.com/wso2/product-is/issues/11650.
                });
        });

        return readOnlyUserStores;
    }
}
