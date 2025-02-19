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

import { useContext } from "react";
import UserStoresContext, { UserStoresContextProps } from "../context/user-stores-context";

/**
 * Interface for the return type of `useUserStores` hook.
 */
type UseUserStoresInterface = UserStoresContextProps;

/**
 * Hook that provides access to the user stores context.
 * @returns An object containing the user stores context.
 */
const useUserStores = (): UseUserStoresInterface => {
    const context: UserStoresContextProps = useContext(UserStoresContext);

    if (!context) {
        throw new Error("useUserStores must be used within a UserStoresProvider");
    }

    return context;
};

export default useUserStores;
