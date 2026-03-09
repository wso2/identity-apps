/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs";
import { ResourceInterface } from "../models/resource";

/**
 * Normalizes the user store list by:
 *  - Removing system reserved user stores
 *  - Ensuring the primary user store always exists in the list
 *
 * @param stores - Raw user store list from API
 * @param systemReservedUserStores - Reserved user stores configured in UI config
 * @returns Normalized user store list
 */
export const normalizeUserstoreList = (
    stores: ResourceInterface[],
    systemReservedUserStores: string[] = []
): ResourceInterface[] => {

    if (!stores) {
        return [];
    }

    const primaryUserStoreName: string = userstoresConfig.primaryUserstoreName;

    // Remove internal/system reserved stores
    let filteredStores: ResourceInterface[] = stores.filter(
        (store: ResourceInterface) =>
            !systemReservedUserStores?.includes(store.name?.toUpperCase())
    );

    // Ensure PRIMARY (configured primary user store) always exists
    const primaryExists: boolean = filteredStores.some(
        (store: ResourceInterface) =>
            store.name?.toUpperCase() === primaryUserStoreName?.toUpperCase()
    );

    if (!primaryExists) {
        filteredStores = [
            {
                id: primaryUserStoreName,
                name: primaryUserStoreName
            } as ResourceInterface,
            ...filteredStores
        ];
    }

    return filteredStores;
};
