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

import { rulesNS } from "../../../models";

export const rules: rulesNS = {
    alerts: {
        resourceNotFound: {
            description: "Please update to a valid resource.",
            title: "The resource linked to this rule is no longer available."
        }
    },
    buttons: {
        and: "And",
        clearRule: "Clear Rule",
        newRule: "New Rule",
        or: "Or"
    },
    fields: {
        autocomplete: {
            clearFilterActionText: "Clear search value to see more",
            moreItemsMessage: "Only the recent resources are listed. Type to search for others ...",
            placeholderText: "Please select a resource or type to search ..."
        }
    },
    texts: {
        execute: "Execute",
        if: "If"
    }
};
