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

import { Context, createContext } from "react";
import { UserStoreListItem } from "../models/user-stores";

/**
 * Props interface for the User stores context.
 */
export interface UserStoresContextProps {
    /**
     * User stores list.
     */
    userStoresList: UserStoreListItem[];
    /**
     * Is user stores list loading.
     */
    isLoading: boolean;
    /**
     * Read only user stores list.
     */
    readOnlyUserStoreNamesList: string[];
    /**
     * Function to check if a user store is read only.
     *
     * @param userStoreName - User store name.
     */
    isUserStoreReadOnly: (userStoreName: string) => boolean;
    /**
     * Function to mutate the user stores list.
     */
    mutateUserStoreList: (delay?: number) => void;
}

/**
 * Context object for managing user stores.
 */
const UserStoresContext: Context<UserStoresContextProps> = createContext<
    null | UserStoresContextProps
>(
    null
);

/**
 * Display name for the UserStoresContext.
 */
UserStoresContext.displayName = "UserStoresContext";

export default UserStoresContext;
