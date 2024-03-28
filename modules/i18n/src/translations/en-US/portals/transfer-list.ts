/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { transferListNS } from "../../../models";

export const transferList: transferListNS = {
    list: {
        emptyPlaceholders: {
            default: "There are no items in this list at the moment.",
            groups: {
                selected: "There are no {{type}} assigned to this group.",
                unselected: "There are no {{type}} available to assign to this group.",
                common: "No {{type}} found"
            },
            roles: {
                selected: "There are no {{type}} assigned with this role.",
                unselected: "There are no {{type}} available to assign to this group.",
                common: "No {{type}} found"
            },
            users: {
                roles: {
                    selected: "There are no {{type}} assigned to this user.",
                    unselected: "There are no {{type}} available to assign to this user."
                }
            }
        },
        headers: {
            0: "Domain",
            1: "Name",
            2: "Audience"
        }
    },
    searchPlaceholder: "Search {{type}}"
};
