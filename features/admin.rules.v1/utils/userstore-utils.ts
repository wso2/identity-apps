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

import { ResourceInterface } from "../models/resource";

const INTERNAL_USERSTORES: string[] = [
    "AGENT"
];

export const normalizeUserstoreList = (
    stores: ResourceInterface[]
): ResourceInterface[] => {

    if (!stores) {
        return [];
    }

    // Remove internal/system stores.
    let filteredStores: ResourceInterface[] = stores.filter(
        (store: ResourceInterface) =>
            !INTERNAL_USERSTORES.includes(store.name)
    );

    // Ensure PRIMARY always exists.
    const primaryExists: boolean = filteredStores.some(
        (store: ResourceInterface) => store.name === "PRIMARY"
    );

    if (!primaryExists) {
        filteredStores = [
            { id: "PRIMARY", name: "PRIMARY" } as ResourceInterface,
            ...filteredStores
        ];
    }

    return filteredStores;
};
