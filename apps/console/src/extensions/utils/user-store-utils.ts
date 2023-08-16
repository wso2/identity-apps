/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AxiosResponse } from "axios";
import { getAUserStore } from "../../features/core/api";
import { SharedUserStoreConstants } from "../../features/core/constants";
import { getUserStoreList } from "../../features/userstores/api";
import { UserStoreListItem, UserStorePostData, UserStoreProperty } from "../../features/userstores/models";

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
