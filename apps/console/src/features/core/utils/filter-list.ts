/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { sortList } from "./sort-list";

export const filterList = <T extends unknown>(list: T[], query: string, sortBy: string, isAscending: boolean): T[] => {
    if (!query) {
        return sortList(list, sortBy, isAscending);
    }

    const queryElements: string[] = query.split(" ");

    const filterBy = queryElements[0];
    const filterMethod = queryElements[1];
    const filterString = queryElements[2]?.toLowerCase();

    const filteredList: T[] = list.filter((element: T) => {
        const key: string = element[filterBy]?.toLowerCase();

        if (key) {
            switch (filterMethod) {
                case "eq":
                    return key === filterString;
                case "co":
                    return key.includes(filterString);
                case "sw":
                    return key.startsWith(filterString);
                case "ew":
                    return key.endsWith(filterString);
                default:
                    return false;
            }
        }

        return false;
    });

    return sortList(filteredList, sortBy, isAscending);
};
