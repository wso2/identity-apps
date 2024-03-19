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
import { BusinessGroupsNS } from "../../../models";

export const businessGroups:BusinessGroupsNS = {
    fields: {
        groupName: {
            label: "{{type}} Name",
            placeholder: "Enter {{type}} Name",
            validations: {
                duplicate: "A {{type}} already exists with the given {{type}} name.",
                empty: "{{type}} Name is required to proceed.",
                invalid: "A {{type}} name can only contain alphanumeric characters, -, and _. "
                    + "And must be of length between 3 to 30 characters."
            }
        }
    }
};

